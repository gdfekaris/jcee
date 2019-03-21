class Block {
  constructor() {
    this.index = 0;
    this.prevHash = '';
    this.hash = '';
    this.nonce = 0;
    this.transactions = [];
  }

  get key() {
    return JSON.stringify(this.transactions) + this.index + this.prevHash + this.nonce;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }
}

module.exports = Block;
