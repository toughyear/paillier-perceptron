var bigInt = require("big-integer");

//importing the model we encoded
const perceptron = require("./perceptron");
const { keyGen, encrypt, decrypt } = require("./encryption");
// initializing the data points to train on
let x = [
  [1, 1, 1],
  [0, 0, 0],
  [1, 0, 1],
];
let y = [1, 0, 1];

let p = new perceptron(x, y, (epochs = 10), (learn_rate = 0.1));

p.fit();

// weights of P now are adjusted to the model

//Let's encrypt those weights before sending them to the third party server for operations

// creat an array for storing encrypted weights
let encrypted_w = [];
// store encrypted bias
let encrypted_b;

async function test() {
  //generate keypair
  const { publicKey, privateKey } = await keyGen();

  // now let's encrypt our weights
  p.weights.forEach((w, index) => {
    console.log(Math.floor(w * 10000000000));

    // floor value of weights after multiplying by 10^10
    encrypt(Math.floor(w * 10000000000), publicKey).then((e) =>
      encrypted_w.push(e)
    );
  });

  encrypted_b = await encrypt(Math.floor(p.bias * 10000000000), publicKey);

  return {
    publicKey,
    privateKey,
  };
}

//after running test() we have everything encrypted for our perceptron
//which we can now send to client

// create an array to store weighted sum given back by the client
let encrypyed_sum = [];

async function client(publicKey) {
  //input by the client
}

test()
  .then((PublicKey, PrivateKey) => {
    let x = [
      [1, 1, 1],
      [0, 0, 0],
      [1, 0, 1],
    ];

    for (let i = 0; i < x.length; i++) {
      let enc_sum = 0;
      for (let j = 0; j < x[0].length; j++) {
        console.log("take a note" + encrypted_w[j]);
        enc_sum += bigInt(
          Math.pow(bigInt(encrypted_w[j]).toJSNumber(), x[i][j])
        );
      }
      enc_sum *= rootNth(encrypted_b);
      encrypyed_sum.push(enc_sum);
    }

    p.enc_test(encrypyed_sum, PrivateKey);
  })
  .catch((e) => console.log(e));

function rootNth(value, k = 10000000000n) {
  if (value < 0n) {
    throw "negative number is not supported";
  }

  let o = 0;
  let x = value;
  let limit = 100;

  while (x ** k !== k && x !== o && --limit) {
    o = x;
    x = ((k - 1n) * x + value / x ** (k - 1n)) / k;
  }

  return x;
}

// console.log(rootNth(100000000000n));
// //
