const cryptoHash = require('./crypto-hash');
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
    const timestamp = Date.now();
    const prevHash = prevBlock.hash;

    return new this({
      timestamp,
      prevHash,
      data,
      hash: cryptoHash(timestamp, prevHash, data)
    });
  }

  // get key() {
  //   return JSON.stringify(this.transactions) + this.index + this.prevHash + this.nonce;
  // }

  // addTransaction(transaction) {
  //   this.transactions.push(transaction);
  // }
}

module.exports = Block;
