const express = require('express');
const helmet = require('helmet');
const Blockchain = require('./blockchain-core/blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  res.redirect('/api/blocks');
});

const PORT = 3030;
app.listen(PORT, () => console.log(`listening at localhost:${PORT}`));