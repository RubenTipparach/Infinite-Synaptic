let colors = require('colors');
let strformat = require('strformat');
let synaptic = require('synaptic');
let Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

let csvModule = require("read-csv-json"); // using this to gather data from Dr. Ludwig's sample sets

let nm = require("../neuron-math.js");
let synLogger = require('../logger.js');

/*
 * summary:
 *  This module learns the iris data set, and classifies it.
 *  TODO: This thing needs Cross Validation, Training and Testing set split, still has a long ass way to go!
 */
module.exports = () => {
    synLogger.info('Training Iris dataset network...'.rainbow);

    /* IRIS DATA SET //Relative to the main class. */
    let _filePath = './data/iris.csv';
    let fieldsName = ["sepal_l", "sepal_w", "petal_l", "petal_w", "species"];

    var csvRead = new csvModule(_filePath, fieldsName);

    csvRead.getCSVJson().then((result) => {
        try {
            result.splice(0, 1);

            for (let item in result) {

                item.sepal_l = parseFloat(item.sepal_l);
                item.sepal_w = parseFloat(item.sepal_l);
                item.petal_l = parseFloat(item.petal_l);
                item.petal_w = parseFloat(item.petal_w);
            }

            //console.log('result: ', JSON.stringify(result));
            var trainingSet = [];

            let flowerMean = {
                sepal_l: nm.getMean("sepal_l", result),
                sepal_w: nm.getMean("sepal_w", result),
                petal_l: nm.getMean("petal_l", result),
                petal_w: nm.getMean("petal_w", result),
            };

            // lol
            let flowerStd = {
                sepal_l: nm.getStd("sepal_l", result),
                sepal_w: nm.getStd("sepal_w", result),
                petal_l: nm.getStd("petal_l", result),
                petal_w: nm.getStd("petal_w", result),
            };

            for (let i = 0; i < result.length; i++) {
                let item = result[i];

                let encodeOutput = {
                    "Iris-setosa": [1, 0, 0],
                    "Iris-versicolor": [0, 1, 0],
                    "Iris-virginica": [0, 0, 1]
                }

                // TODO: Normalize inputs.
                let traininItem = {
                    input: [
                        nm.getZScore(item.sepal_l, flowerMean.sepal_l, flowerStd.sepal_l),
                        nm.getZScore(item.sepal_w, flowerMean.sepal_w, flowerStd.sepal_w),
                        nm.getZScore(item.petal_l, flowerMean.petal_l, flowerStd.petal_l),
                        nm.getZScore(item.petal_w, flowerMean.petal_w, flowerStd.petal_w)
                    ],
                    output: encodeOutput[item.species]
                };

                trainingSet.push(traininItem);
                //console.log('result: ', JSON.stringify(result[i]));
            }
        } catch (e) {
            synLogger.error(e);
        }

        //console.log('result: ', trainingSet);
        run(trainingSet);
    },
        (err) => {
            console.log('err: ', err)
        });
}

/*
 * summary:
 *  runs the training set.
 * parameters:
 *  trainingSet - the formatted, and normalized training set.
 */
function run(trainingSet) {

    let perceptronTwo = new Architect.Perceptron(4, 20, 3);
    let trainerTwo = new Trainer(perceptronTwo);

    trainerTwo.train(trainingSet, {
        rate: .2,
        iterations: 10000,
        error: .005,
    });

    //validate results; TODO: As above, data set is not normalized, therefore it is still dumb.
    trainingSet.forEach((item) => {
        synLogger.debug(perceptronTwo.activate(item.input));
    });
}