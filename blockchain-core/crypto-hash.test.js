const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  test = 'c39e1b3c5245d4b38a7c5735a7a53fba2eedb18cf1829575a40cf34a834391e3'

  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('timeSpace'))
      .toEqual('c39e1b3c5245d4b38a7c5735a7a53fba2eedb18cf1829575a40cf34a834391e3');
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('cat', 'dog', 'fish'))
      .toEqual(cryptoHash('dog', 'fish', 'cat'));
  })
});