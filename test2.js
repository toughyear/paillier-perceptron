//testing the algo with encryption as first step and decryption as the last step
var bigInt = require("big-integer");
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

async function encryptPerceptron() {
  //generate keypair
  const { publicKey, privateKey } = await keyGen();

  // now let's encrypt our weights
   p.weights.forEach((w, index) => {
   // console.log(Math.floor(w * 10000000000));

    // floor value of weights after multiplying by 10^10
    
  encrypt(Math.floor(w * 10000000000), publicKey).then(value => encrypted_w.push(value));

    
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

async function client(publicKey, PrivateKey) {
  //input by the client
  let x = [
    [1, 1, 1],
    [0, 0, 0],
    [1, 0, 1],
  ];



  
  for (let i = 0; i < x.length; i++) {
    let enc_sum = bigInt(encrypted_b);;
    
 for (let j = 0; j < x[0].length; j++) {
      enc_sum +=   bigInt(encrypted_b)  ;
    }
    encrypyed_sum.push(enc_sum);
  }

//now we have encrypted sum for all

//let decrypyed_sum =  encrypyed_sum.map(e => decrypt(e, PrivateKey).then(value => {return value}) )

console.log(encrypyed_sum)

}



encryptPerceptron().then(
    (publicKey, privateKey)=> {
        client(publicKey,privateKey);
    }
   
)