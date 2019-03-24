const { GENESIS_BLOCK, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
  constructor({ timestamp, prevHash, hash, nonce, difficulty, data }) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_BLOCK);
  }

  static mineBlock({ prevBlock, data }) {
    let hash, timestamp;
    const prevHash = prevBlock.hash;
    const { difficulty } = prevBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
    } while ( hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({ timestamp, prevHash, difficulty, nonce, data, hash });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;


    const difference = timestamp - originalBlock.timestamp;

    if (difference > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }

}

module.exports = Block;
