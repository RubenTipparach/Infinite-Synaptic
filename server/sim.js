var synaptic = require('synaptic');

module.exports = function run(){


}

class Creature {
  constructor() {
      this.network = new synaptic.Architect.Perceptron(40, 25, 3);

      this.location = {
          x: 0,
          y: 0
      }

      this.velocity =
      {
          x: 0,
          y: 0
      }
  }

  moveTo(location)
  {
    for (var loc in location)
    {
        console.log('location - ' + loc);
    }
  }
}
