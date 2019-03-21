const sha256 = require('js-sha256');

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

  genHash(block) {

    let hash = sha256(block.key);
    //let hash = sha256('[]');
    return hash;

  }
}

module.exports = Blockchain;