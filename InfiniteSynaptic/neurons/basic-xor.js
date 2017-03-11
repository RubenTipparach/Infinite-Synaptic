let colors = require('colors');
let strformat = require('strformat');

let synaptic = require('synaptic');
let Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

let synLogger = require('../logger.js');

/*
 * summary:
 *  Basic XOR network.
 */
module.exports = () =>
{
    synLogger.info('Training XOR network...'.rainbow);

    // extend the prototype chain
    Perceptron.prototype = new Network();
    Perceptron.prototype.constructor = Perceptron;

    let myPerceptron = new Perceptron(2, 3, 1);
    let myTrainer = new Trainer(myPerceptron);

    myTrainer.XOR(); // { error: 0.004998819355993572, iterations: 21871, time: 356 }

    synLogger.debug(myPerceptron.activate([0, 0])[0].toFixed(3)); // 0.0268581547421616
    synLogger.debug(myPerceptron.activate([1, 0])[0].toFixed(3)); // 0.9829673642853368
    synLogger.debug(myPerceptron.activate([0, 1])[0].toFixed(3)); // 0.9831714267395621
    synLogger.debug(myPerceptron.activate([1, 1])[0].toFixed(3)); // 0.02128894618097928
}

/*
 * summary:
 *  The perceptron prototype method.
 * parameters:
 *  trainingSet - the formatted, and normalized training set.
 */
function Perceptron(input, hidden, output) {
    // create the layers
    let inputLayer = new Layer(input);
    let hiddenLayer = new Layer(hidden);
    let outputLayer = new Layer(output);

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    let layers = [input, hidden, output];

    synLogger.info(strformat(
        ' Has {0} nodes in input layer,'.bold.white.bgRed
        + ' {1} nodes in hidden layer, '.bold.white.bgYellow
        + ' {2} nodes in output layer.'.bold.white.bgGreen, layers));

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}
