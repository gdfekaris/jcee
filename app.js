const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

let transaction = new Transaction('Second', 'Block', 2);

let genBlock = new Block();
let blockchain = new Blockchain(genBlock);

let block = blockchain.getNextBlock([transaction]);
blockchain.addBlock(block);

console.log(blockchain);