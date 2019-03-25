const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_BLOCK = {
  timestamp: 1,
  prevHash: 'unknown',
  hash: 'genesis',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: []
};

const STARTING_BALANCE = 1000;

module.exports = { GENESIS_BLOCK, MINE_RATE, STARTING_BALANCE };