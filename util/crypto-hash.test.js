const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('timeSpace'))
      .toEqual('5c810819dabd8672e74989a2bf9b835a5d741dfe167b680116504cef5fa2574f');
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('cat', 'dog', 'fish'))
      .toEqual(cryptoHash('dog', 'fish', 'cat'));
  });

  it('produces a unique hash when properties have changed on an input', () => {
    const timeSpace = {};
    const originalHash = cryptoHash(timeSpace);
    timeSpace['i'] = 'i';
    expect(cryptoHash(timeSpace)).not.toEqual(originalHash);
  })
});