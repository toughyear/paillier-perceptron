const { keyGen, encrypt, decrypt } = require("./encryption");

//implementation of a perceptron

module.exports = class Perceptron {
  //constructor for the class of Perceptron
  constructor(x_train, y_train, epochs = 100, learning_rate = 0.1) {
    // this.accuracy will be used to calculate the accuracy %, number of correct predictions
    this.accuracy = 0;
    this.enc_accuracy = 0;
    // samples will be the total number of samples the perceptron has ran over
    this.samples = 0;
    this.enc_samples = 0;
    // x_train are the values on which the perceptron needs to train (2d array)
    this.x_train = x_train;
    // y_train is the target values (should be predicting this) (2d array)
    this.y_train = y_train;
    //number of epoch define the number of times the Perceptron go over all the samples again and again
    this.epochs = epochs;
    // learning rate nudges the change in weight to match the expected value in y_train
    this.learning_rate = learning_rate;
    // bias will be added to the wieghted sum
    this.bias = 0;
    this.enc_bias = 0;

    // create an array of size x_train to store the weights
    this.weights = new Array(x_train[0].length);

    // initialize the array with random weights
    for (let n = 0; n < x_train[0].length; n++) {
      this.weights[n] = this.random();
    }
  }

  // returns percentage accuracy of the perceptron
  current_accuracy() {
    return this.accuracy / this.samples;
  }

  // generate random float between -1 and 1 (for generating weights)
  random() {
    return Math.random() * 2 - 1;
  }

  // activation function (simple activation function)
  activation(n) {
    return n < 0 ? 0 : 1;
  }

  // predictions made by perceptron for a set of value for x_train
  predict(input) {
    //bias will be added to the weighted sum
    let total = this.bias;
    //add to total the weighted sum
    this.weights.forEach((w, index) => {
      total += input[index] * w;
    }); // multiply each weight by each input vector value
    return this.activation(total);
  }

  // training perceptron on the given data
  fit() {
    // for each epoch
    for (let e = 0; e < this.epochs; e++) {
      // for each training sample
      for (let i = 0; i < this.x_train.length; i++) {
        // get prediction for the x_train (2d array) values
        let prediction = this.predict(this.x_train[i]);
        console.log(
          "Actual value: " +
            this.y_train[i] +
            "    Predicted Value: " +
            prediction
        );

        // update accuracy measures
        this.y_train[i] === prediction
          ? (this.accuracy += 1)
          : (this.accuracy -= 1);
        this.samples++;

        // calculate the loss for model (difference between actual and predicted value)
        let loss = this.y_train[i] - prediction;

        // update the weights to reduce the loss (shift towards  the loss, keeping the sign of loss)
        // the update in any wieghtis proportional to learning rate as well as the loss
        for (let w = 0; w < this.weights.length; w++) {
          this.weights[w] += loss * this.x_train[i][w] * this.learning_rate;
        }

        // update the bias to help reduce the loss
        this.bias += loss * this.learning_rate;
      }

      // accuracy post epoch
      console.log(this.current_accuracy());
    }
  }

  // testing on encrypted data
  enc_test(enc_sum, privateKey) {
    // for each epoch
    for (let e = 0; e < this.epochs; e++) {
      // for each training sample
      for (let i = 0; i < enc_sum.length; i++) {
        // get prediction for the x_train (2d array) values
        let prediction = this.activation(decrypt(enc_sum[i], privateKey));
        console.log(
          "Actual value: " +
            this.y_train[i] +
            "    Predicted Value: " +
            prediction
        );

        // update accuracy measures
        this.y_train[i] === prediction
          ? (this.enc_accuracy += 1)
          : (this.enc_accuracy -= 1);
        this.enc_samples++;

        // calculate the loss for model (difference between actual and predicted value)
        let loss = this.y_train[i] - prediction;

        // update the weights to reduce the loss (shift towards  the loss, keeping the sign of loss)
        // the update in any wieghtis proportional to learning rate as well as the loss
        for (let w = 0; w < this.weights.length; w++) {
          this.weights[w] += loss * this.x_train[i][w] * this.learning_rate;
        }

        // update the bias to help reduce the loss
        this.enc_bias += loss * this.learning_rate;
      }

      // accuracy post epoch
      console.log(this.current_accuracy());
    }
  }
};
