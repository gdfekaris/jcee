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
const REWARD_INPUT = { address: '*authorized-reward*' };
const MINING_REWARD = 50;
const REWARD_CARD = 'cheezburger_cat';

const STARTER_DECK = [
  'ceiling_cat',
  'basement_cat',
  'monorail_cat',
  'serious_cat',
  'laughing_cat',
  'mr_cuddles'
];

module.exports = {
  GENESIS_BLOCK,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
  STARTER_DECK,
  REWARD_CARD
};