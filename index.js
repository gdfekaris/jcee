const express = require('express');
const request = require('request');
const path = require('path');
const helmet = require('helmet');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const ExchangePool = require('./wallet/exchange-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');
const ExchangeMiner = require('./app/exchange-miner');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const exchangePool = new ExchangePool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, exchangePool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });
const exchangeMiner = new ExchangeMiner({ blockchain, exchangePool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool
      .existingTransaction({ inputAddress: wallet.publicKey });

    try {
      if (transaction) {
        transaction.update({ senderWallet: wallet, recipient, amount });
      } else {
        transaction = wallet.createTransaction({
          recipient,
          amount,
          chain: blockchain.chain
        });
      }
    } catch(error) {
      return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    })
});

app.post('/api/exchange', (req, res) => {
  const { cards, recipient } = req.body;

  let exchange = exchangePool
    .existingExchange({ inputAddress: wallet.publicKey });

  try {
    if (exchange) {
      exchange.update({ senderWallet: wallet, recipient, cards });
    } else {
      exchange = wallet.createExchange({ recipient, cards });
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  exchangePool.setExchange(exchange);

  pubsub.broadcastExchange(exchange);

  res.json({ type: 'success', exchange });
});

app.get('/api/exchange-pool-map', (req, res) => {
  res.json(exchangePool.exchangeMap);
});

app.get('/api/mine-exchanges', (req, res) => {
  exchangeMiner.mineExchanges();

  res.redirect('/api/blocks');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
})

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on sync with', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/exchange-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootExchangePoolMap = JSON.parse(body);

      console.log('replace exchange pool map on sync with', rootExchangePoolMap);
      exchangePool.setMap(rootExchangePoolMap);
    }
  });
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`\nlistening at localhost:${PORT}`);
  console.log(`*********************************`);
  console.log(`wallet public key: ${wallet.publicKey}`);
  console.log(`\nstarter deck: [${wallet.deck}]`);
  console.log(`\nbalance: ${wallet.balance}`);
  console.log(`*********************************`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});