const hexToBinary = require('hex-to-binary');
const { GENESIS_BLOCK, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');

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
    const prevHash = prevBlock.hash;
    let hash, timestamp;
    let { difficulty } = prevBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({ originalBlock: prevBlock, timestamp });
      hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
    } while ( hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({ timestamp, prevHash, difficulty, nonce, data, hash });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;

    const difference = timestamp - originalBlock.timestamp;

    if (difference > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }

}

module.exports = Block;
