const Transaction = require('./transaction');
const Exchange = require('./exchange');
const { STARTING_BALANCE, STARTER_DECK } = require('../config.js');
const { ec, cryptoHash } = require('../util');

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;
    this.deck = STARTER_DECK;

    this.keyPair = ec.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount }) {

    if (amount > this.balance) {
      throw new Error('Amount exceeds balance');
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }

  createExchange({ recipient, cards }) {
    for (let i=0; i<cards.length; i++) {
      if (this.deck.includes(cards[i]) === false) {
        throw new Error('Card not in deck');
      }

    }

    return new Exchange({ senderWallet: this, recipient, cards });
  }
};

module.exports = Wallet;