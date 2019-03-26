const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
  EXCHANGE: 'EXCHANGE'
};

class PubSub {
  constructor({ blockchain, transactionPool, exchangePool }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.exchangePool = exchangePool;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscribeToChannels();

    this.subscriber.on(
      'message',
      (channel, message) => this.handleMessage(channel, message));
  }

  handleMessage(channel, message) {
    console.log(`Message recieved. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message);

    switch(channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, () => {
          this.transactionPool.clearBlockchainTransactions({
            chain: parsedMessage
          })
          this.exchangePool.clearBlockchainExchanges({
            chain: parsedMessage
          })
        });
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;
      case CHANNELS.EXCHANGE:
        this.exchangePool.setExchange(parsedMessage);
        break;
      default:
        return;
    }
  };

  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    })
  }

  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }

  broadcastExchange(exchange) {
    this.publish({
      channel: CHANNELS.EXCHANGE,
      message: JSON.stringify(exchange)
    });
  }
}

module.exports = PubSub;
