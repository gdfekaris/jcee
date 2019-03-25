const Exchange = require('./exchange');

class ExchangePool {
  constructor() {
    this.exchangeMap = {}
  }

  clear() {
    this.exchangeMap = {};
  }

  setExchange(exchange) {
    this.exchangeMap[exchange.id] = exchange;
  }

  setMap(exchangeMap) {
    this.exchangeMap = exchangeMap;
  }

  existingExchange({ inputAddress }) {
    const exchanges = Object.values(this.exchangeMap);

    return exchanges.find((exchange) => exchange.input.address === inputAddress);
  }

  validExchanges() {
    return Object.values(this.exchangeMap).filter(
      exchange => Exchange.validExchange(exchange)
    );
  }

  clearBlockchainExchanges({ chain }) {
    for (let i = 0; i < chain.length; i++) {
      const block = chain[i];

      for (let exchange of block.data) {
        if (this.exchangeMap[exchange.id]) {
          delete this.exchangeMap[exchange.id];
        }
      }
    }
  }
}

module.exports = ExchangePool;