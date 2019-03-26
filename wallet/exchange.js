const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, REWARD_CARD } = require('../config');

class Exchange {
  constructor({ senderWallet, recipient, cards, outputMap, input }) {
    this.id = uuid();
    this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, cards });
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, recipient, cards }) {
    const outputMap = {};

    outputMap[recipient] = cards;
    outputMap[senderWallet.publicKey] = senderWallet.deck.filter(card => !cards.includes(card));

    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      cards: senderWallet.deck,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };
  }

  update({ senderWallet, recipient, cards }) {
    for (let i=0; i<cards.length; i++) {
      if (!this.outputMap[senderWallet.publicKey].includes(cards[i])) {
        throw new Error('Card not in deck');
      }
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = cards;
    } else {
      for (let i=0; i<cards.length; i++) {
        this.outputMap[recipient].push(cards[i]);
      }
    }

    this.outputMap[senderWallet.publicKey] =
      senderWallet.deck.filter(card => !cards.includes(card));

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  static validExchange(exchange) {
    const { input: { address, cards, signature }, outputMap } = exchange;

    //const outputTotal = Object.values(outputMap);

    //console.log('--------->', outputTotal);

    // for (let i=0; i<outputTotal.length; i++) {
    //   if (!outputMap.includes(cards[i])) {
    //     console.error(`Invalid transaction from ${address}`);
    //     return false;
    //   }
    // }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }

  static rewardExchange({ minerWallet }) {
    return new this({
      input: REWARD_INPUT,
      outputMap: { [minerWallet.publicKey]: REWARD_CARD }
    });
  }
}

module.exports = Exchange;