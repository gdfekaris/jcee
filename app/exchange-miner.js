const Exchange = require('../wallet/exchange');

class ExchangeMiner {
  constructor({ blockchain, exchangePool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.exchangePool = exchangePool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineExchanges() {
    const validExchanges = this.exchangePool.validExchanges();

    validExchanges.push(
      Exchange.rewardExchange({ minerWallet: this.wallet })
    );


    this.blockchain.addBlock({ data: validExchanges });

    this.pubsub.broadcastChain();

    this.exchangePool.clear();
  }
}

module.exports = ExchangeMiner;