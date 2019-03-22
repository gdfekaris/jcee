const sha256 = require('js-sha256');
const Block = require('./block');

class Blockchain {
  constructor(genBlock) {
    this.blocks = [];
    this.addBlock(genBlock);
  }

  addBlock(block) {
    if(this.blocks.length == 0) {
      block.prevHash = '0000000000000000';
      block.hash = this.genHash(block);
    }

    this.blocks.push(block);
  }

  getNextBlock(transactions) {
    let block = new Block();
    let prevBlock = this.getPrevBlock();

    transactions.forEach(function(transaction){
      block.addTransaction(transaction);
    })

    block.index = this.blocks.length;
    block.prevHash = prevBlock.hash;
    block.hash = this.genHash(block);

    return block;
  }

  getPrevBlock() {
    return this.blocks[this.blocks.length -1];
  }

  genHash(block) {
    let hash = sha256(block.key);

    while(!hash.startsWith('000')) {
      block.nonce += 1;
      hash = sha256(block.key);
      console.log(hash);
    }

    return hash;
  }
}

module.exports = Blockchain;