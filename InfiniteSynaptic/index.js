'use strict';

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var clientServer = require('socket.io-client');
var synaptic = require('synaptic'); // this line is not needed in the browser
var csvModule = require("read-csv-json"); // using this to gather data from Dr. Ludwig's sample sets
//var numjs = require('numjs');
var math = require('mathjs'); //http://mathjs.org/docs/reference/

/*****************************/
/* Custom modular JS section */
/*****************************/
var sim = require('./sim.js');

/****************************************************************************/
/* This section is just for logging fun nonsense .. *<:)                    */
/****************************************************************************/
var colors = require('colors'); //https://www.npmjs.com/package/colors
var winston = require('winston');https://www.npmjs.com/package/winston
var strformat = require('strformat');

// console.log('hello'.green); // outputs green text
// console.log('i like cake and pies'.underline.red) // outputs red underlined text
// console.log('inverse the color'.inverse); // inverses the color
// console.log('OMG Rainbows!'.rainbow); // rainbow

var customTheme = {
  levels: {
      silly: 0, input: 1, verbose: 2,
      prompt: 3, info: 4, data: 5,
      help: 6, warn: 7, debug: 8,
      error: 9
  },
  colors: {
      silly: 'rainbow', input: 'grey', verbose: 'cyan',
      prompt: 'grey', info: 'green', data: 'grey',
      help: 'cyan', warn: 'yellow', debug: 'cyan',
      error: 'red'
  }
};

colors.setTheme(customTheme.colors);

var synLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({colorize: true})
        //,new (winston.transports.File)({ filename: 'somefile.log' })
    ],
    levels: customTheme.levels
});

winston.addColors(customTheme.colors);

synLogger.level = 'error';

synLogger.info('Initializing...');

process.argv.forEach(function (val, index, array) {
    let text = index + ': ' + val + 's';
    console.log(text.magenta);
});

/****************************************************************************/


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

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;

var myPerceptron = new Perceptron(2,3,1);
var myTrainer = new Trainer(myPerceptron);
//

synLogger.info('Training XOR...');
myTrainer.XOR(); // { error: 0.004998819355993572, iterations: 21871, time: 356 }

synLogger.info(myPerceptron.activate([0,0])[0].toFixed(3)); // 0.0268581547421616
synLogger.info(myPerceptron.activate([1,0])[0].toFixed(3)); // 0.9829673642853368
synLogger.info(myPerceptron.activate([0,1])[0].toFixed(3)); // 0.9831714267395621
synLogger.info(myPerceptron.activate([1,1])[0].toFixed(3)); // 0.02128894618097928

var perceptronOne = new Architect.Perceptron(2, 3, 2);
var trainerOne = new Trainer(perceptronOne);

var trainingSetOne =
[
    {
        input: [0,0,1],
        output: [1,0]
    },
    {
        input:  [0,1,0],
        output: [0,1]
    },
    {
        input:  [1,1,1],
        output: [1,1]
    },
    {
        input:  [0,0,0],
        output: [0,0]
    }
]

var trainingOptions = {
  rate: .1,
  iterations: 20000,
  error: .005,
}

trainerOne.train(trainingSetOne);

synLogger.warn(myPerceptron.activate([0,0,1]));
synLogger.warn(myPerceptron.activate([0,1,0]));
synLogger.warn(myPerceptron.activate([1,1,1]));
synLogger.warn(myPerceptron.activate([0,0,1]));



// TODO: This thing needs Cross Validation, Training and Testing set split, still has a long ass way to go!
/* IRIS DATA SET */
var _filePath = './data/iris.csv';
var fieldsName = ["sepal_l","sepal_w","petal_l","petal_w", "species"];

var csvRead = new csvModule(_filePath, fieldsName);


csvRead.getCSVJson().then((result) => {
        try {
            result.splice(0, 1);

            for (var item in result) {

                item.sepal_l = parseFloat(item.sepal_l);
                item.sepal_w = parseFloat(item.sepal_l);
                item.petal_l = parseFloat(item.petal_l);
                item.petal_w = parseFloat(item.petal_w);
            }

            //console.log('result: ', JSON.stringify(result));
            var trainingSet = [];

            let flowerMean = {
                sepal_l: getMean("sepal_l", result),
                sepal_w: getMean("sepal_w", result),
                petal_l: getMean("petal_l", result),
                petal_w: getMean("petal_w", result),
            };

            // lol
            let flowerStd = {
                sepal_l: getStd("sepal_l", result),
                sepal_w: getStd("sepal_w", result),
                petal_l: getStd("petal_l", result),
                petal_w: getStd("petal_w", result),
            };

            for (var i = 0; i < result.length; i++) {
                var item = result[i];

                var encodeOutput = {
                    "Iris-setosa": [1, 0, 0],
                    "Iris-versicolor": [0, 1, 0],
                    "Iris-virginica": [0, 0, 1]
                }

                // TODO: Normalize inputs.
                var traininItem = {
                    input: [
                        getZScore(item.sepal_l, flowerMean.sepal_l, flowerStd.sepal_l),
                        getZScore(item.sepal_w, flowerMean.sepal_w, flowerStd.sepal_w),
                        getZScore(item.petal_l, flowerMean.petal_l, flowerStd.petal_l),
                        getZScore(item.petal_w, flowerMean.petal_w, flowerStd.petal_w)
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

//normalization!
function getZScore(value,mean,std)
{
    return (value - mean)/std;
}
function getMean(colname, dataset)
{
    var vals = [];

    for(var i = 0; i < dataset.length; i++)
    {
        vals.push(dataset[i][colname]);
    }

    return math.mean(vals);
}
function getStd(colname, dataset)
{
    var vals = [];

    for(var i = 0; i < dataset.length; i++)
    {
        vals.push(dataset[i][colname]);
    }

    return math.std(vals);
}

function run(trainingSet)
{
    var perceptronTwo = new Architect.Perceptron(4, 20,  3);
    var trainerTwo = new Trainer(perceptronTwo);

    trainerTwo.train(trainingSet, {
      rate: .2,
      iterations: 10000,
      error: .005,
    });

    //validate results; TODO: As above, data set is not normalized, therefore it is still dumb.
    trainingSet.forEach((item) =>
    {
        synLogger.debug(perceptronTwo.activate(item.input));
    });
}

server.listen(3000);
