let colors = require('colors');
let synLogger = require('../logger.js');
let synaptic = require('synaptic');
let Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

/*
 * summary:
 *  This module is using manual inputs to predict output, similar to XOR,
 *  but some other easy example to show people how to use this thing.
 */
module.exports = () => 
{
    synLogger.info('Training Sandbox network...'.rainbow);

    let perceptronOne = new Architect.Perceptron(2, 3, 2);
    let trainerOne = new Trainer(perceptronOne);

    let trainingSetOne =
        [
            {
                input: [0, 0, 1],
                output: [1, 0]
            },
            {
                input: [0, 1, 0],
                output: [0, 1]
            },
            {
                input: [1, 1, 1],
                output: [1, 1]
            },
            {
                input: [0, 0, 0],
                output: [0, 0]
            }
        ];

    let trainingOptions = {
        rate: .1,
        iterations: 20000,
        error: .005,
    };

    trainerOne.train(trainingSetOne);

    synLogger.debug(perceptronOne.activate([0, 0, 1]));
    synLogger.debug(perceptronOne.activate([0, 1, 0]));
    synLogger.debug(perceptronOne.activate([1, 1, 1]));
    synLogger.debug(perceptronOne.activate([0, 0, 1]));
}
