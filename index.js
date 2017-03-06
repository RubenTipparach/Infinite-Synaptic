var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var clientServer = require("socket.io-client");



/****************************************************************************/
/* This section is just for logging fun nonsense .. *<:)                    */
/****************************************************************************/
var colors = require('colors'); //https://www.npmjs.com/package/colors
var winston = require('winston');https://www.npmjs.com/package/winston

// console.log('hello'.green); // outputs green text
// console.log('i like cake and pies'.underline.red) // outputs red underlined text
// console.log('inverse the color'.inverse); // inverses the color
// console.log('OMG Rainbows!'.rainbow); // rainbow
// TEXT COLORS
// black
// red
// green
// yellow
// blue
// magenta
// cyan
// white
// gray
// grey
// BACKGROUND COLORS
// bgBlack
// bgRed
// bgGreen
// bgYellow
// bgBlue
// bgMagenta
// bgCyan
// bgWhite
var customTheme = {
  levels: {
      silly: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      info: 4,
      data: 5,
      help: 6,
      warn: 7,
      debug: 8,
      error: 9
  },
  colors: {
      silly: 'rainbow',
      input: 'grey',
      verbose: 'cyan',
      prompt: 'grey',
      info: 'green',
      data: 'grey',
      help: 'cyan',
      warn: 'yellow',
      debug: 'cyan',
      error: 'red'
  }
};

// console.log('Testing error level'.underline.red);
// console.log('Testing help level'.help);
// console.log('Testing warning level'.warn);
// console.log('Testing debug level'.debug);
// console.log('Testing info level'.info);

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

synLogger.log('info', 'Hello distributed log files!');
synLogger.info('Hello again distributed logs');

synLogger.warn('Initializing program...');
synLogger.error('Error program...');
synLogger.debug('Now my debug messages are written to console!');
synLogger.info('messages and stuff');

/****************************************************************************/


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
//
// myTrainer.XOR(); // { error: 0.004998819355993572, iterations: 21871, time: 356 }
//
// console.log(myPerceptron.activate([0,0])[0].toFixed(3)); // 0.0268581547421616
// console.log(myPerceptron.activate([1,0])[0].toFixed(3)); // 0.9829673642853368
// console.log(myPerceptron.activate([0,1])[0].toFixed(3)); // 0.9831714267395621
// console.log(myPerceptron.activate([1,1])[0].toFixed(3)); // 0.02128894618097928
//
//


var synaptic = require('synaptic');
this.network = new synaptic.Architect.Perceptron(40, 25, 3);




server.listen(3000);
