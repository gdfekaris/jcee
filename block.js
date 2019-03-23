
const { GENESIS_BLOCK } = require('./config');

class Block {
  constructor({ timestamp, prevHash, hash, data }) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ prevBlock, data }) {
    return new this({
      timestamp: Date.now(),
      prevHash: prevBlock.hash,
      data
    })
  }

  // get key() {
  //   return JSON.stringify(this.transactions) + this.index + this.prevHash + this.nonce;
  // }

  // addTransaction(transaction) {
  //   this.transactions.push(transaction);
  // }
}

module.exports = Block;
