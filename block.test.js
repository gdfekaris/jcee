const Block = require('./block');
const cryptoHash = require('./crypto-hash');
const { GENESIS_BLOCK, MINE_RATE } = require('./config');

describe('Block', () => {
  const timestamp = 2000;
  const prevHash = '00000000000';
  const hash = '11111111111';
  const data = ['In the start ', 'there was genBlock'];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({ timestamp, prevHash, hash, data, nonce, difficulty });

  it('has a timestamp, prevHash, hash, data, nonce, and difficulty property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.prevHash).toEqual(prevHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('returns the genesis block', () => {
      expect(genesisBlock).toEqual(GENESIS_BLOCK);
    })
  });

  describe('mineBlock()', () => {
    const prevBlock = Block.genesis();
    const data = 'mined data2';
    const minedBlock = Block.mineBlock({ prevBlock, data });

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('sets the `prevHash` to be the `hash` of the prevBlock', () => {
      expect(minedBlock.prevHash).toEqual(prevBlock.hash);
    });

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('sets a `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('creates a SHA-256 `hash` based on the proper inputs', () => {
      expect(minedBlock.hash)
        .toEqual(
          cryptoHash(
            minedBlock.timestamp,
            minedBlock.nonce,
            minedBlock.difficulty,
            prevBlock.hash,
            data
          )
        );
    });

    it('sets a `hash` that matches the difficulty criteria', () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty))
        .toEqual('0'.repeat(minedBlock.difficulty));
    });
  });

  describe('adjustDifficulty()', () => {
    it('raises the difficulty for a quickly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
      })).toEqual(block.difficulty + 1);
    });

    it('lowers the difficulty for a slowly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty - 1);
    });
  });

});