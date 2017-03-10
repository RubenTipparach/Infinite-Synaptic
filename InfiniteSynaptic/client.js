
// just call this to test out on the front end.
function run(){

    var creatures = [new Creature(),new Creature(),new Creature()];

    creatures.forEach(function(creature)
    {
        // move
        var input = [];
        for (var i in creatures)
        {
          input.push(creatures[i].location.x);
          input.push(creatures[i].location.y);
          input.push(creatures[i].velocity.x);
          input.push(creatures[i].velocity.y);
        }
        var output = creature.network.activate(input);
        creature.moveTo(output);

        // learn
        var learningRate = .3;
        // missing a few functions :(
        var target = [
          targetX(creature),
          targetY(creature),
          targetAngle(creature)];
        creature.network.propagate(learningRate, target);
    });
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
