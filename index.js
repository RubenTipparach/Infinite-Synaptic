var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var fs = require('fs');

var clientServer = require("socket.io-client");

var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

// Basic XOR network.
function Perceptron(input, hidden, output)
{
    // create the layers
    var inputLayer = new Layer(input);
    var hiddenLayer = new Layer(hidden);
    var outputLayer = new Layer(output);

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;

var myPerceptron = new Perceptron(2,3,1);
var myTrainer = new Trainer(myPerceptron);

myTrainer.XOR(); // { error: 0.004998819355993572, iterations: 21871, time: 356 }

console.log(myPerceptron.activate([0,0])[0].toFixed(3)); // 0.0268581547421616
console.log(myPerceptron.activate([1,0])[0].toFixed(3)); // 0.9829673642853368
console.log(myPerceptron.activate([0,1])[0].toFixed(3)); // 0.9831714267395621
console.log(myPerceptron.activate([1,1])[0].toFixed(3)); // 0.02128894618097928


server.listen(3000);
