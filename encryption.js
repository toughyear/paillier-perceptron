//importing paillier library
const paillierBigint = require("paillier-bigint");
const bigintConversion = require("bigint-conversion");

async function keyGen() {
  const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(10);

  console.log("key pairs have been generated.");
  console.log("public key of bitlength:" + publicKey.bitLength);
  console.log("private key:" + privateKey.bitLength);

  return { publicKey, privateKey };
}

async function encrypt(m1, publicKey) {
  // encryption/decryption
  const c1 = publicKey.encrypt(m1);
  console.log("encrypted value:" + c1); // encryption for m1

  return c1;
}

async function decrypt(m1, privateKey) {
  // encryption/decryption
  const c1 = privateKey.decrypt(m1);
  console.log("decrypted value:" + c1); // decryption for m1

  return c1;
}

module.exports = { decrypt, encrypt, keyGen };
