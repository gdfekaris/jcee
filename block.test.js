const Block = require('./block');
const { GENESIS_BLOCK } = require('./config');

describe('Block', () => {
  const timestamp = '1/1/1';
  const prevHash = '00000000000';
  const hash = '11111111111';
  const data = ['In the start ', 'there was genBlock'];
  const block = new Block({ timestamp, prevHash, hash, data });

  it('has a timestamp, prevHash, hash, and data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.prevHash).toEqual(prevHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
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
    const data = 'mined data';
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
    })
  });

});