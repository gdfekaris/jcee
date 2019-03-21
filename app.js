const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

//let transaction = new Transaction('?', '?', '?');

let genBlock = new Block();
let blockchain = new Blockchain(genBlock);

console.log(blockchain);
//console.log(`this is the key:\n${genBlock.key}`);