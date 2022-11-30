const fs = require("fs");
const permutations = require("./permutations");

// Computer created during day 5 and expanded on each other day when needed.
// So far used in days: 2, 5, 7, 9, 11, 13, 15, 17, 19
class IntCodeComputer {
  constructor(
    opcode, // number[]
    input, // number[]
    preserveOutput = false, // boolean; determines if output should be replaced or preserved in array
    advancedOptions = null // Used only for cloning function
  ) {
    this.opcode = opcode;
    this.input = input;
    this.pointer = advancedOptions ? advancedOptions.pointer : 0;
    this.relativeBase = advancedOptions ? advancedOptions.relativeBase : 0;
    this.output = advancedOptions ? advancedOptions.output : null;
    this.active = advancedOptions ? advancedOptions.active : false;
    this.inPause = advancedOptions ? advancedOptions.inPause : false;
    this.preserveOutput = preserveOutput;
  }

  getOutput() {
    if (this.preserveOutput) {
      const toReturn = [...this.output];
      this.output = null;
      return toReturn;
    }
    return this.output;
  }

  getASCIIOutput(asString = false) {
    const output = this.getOutput().map(code => String.fromCharCode(code));
    if (asString) {
      return output.join('');
    } else {
      return output;
    }
  }

  getOpcode() {
    return this.opcode;
  }

  addInput(value) {
    if (Array.isArray(value)) {
      this.input.push(...value)
    } else {
      this.input.push(value);
    }
  }

  addASCIIInput(string) {
    this.addInput(string.split('').map(char => char.charCodeAt()));
    this.addInput(10);
  }

  isInPause() {
    return this.inPause;
  }

  op1(a, b, mode) {
    if (mode === 2) {
      this.opcode[this.opcode[this.pointer + 3] + this.relativeBase] = a + b;
    } else {
      this.opcode[this.opcode[this.pointer + 3]] = a + b;
    }
    this.pointer += 4;
  }

  op2(a, b, mode) {
    if (mode === 2) {
      this.opcode[this.opcode[this.pointer + 3] + this.relativeBase] = a * b;
    } else {
      this.opcode[this.opcode[this.pointer + 3]] = a * b;
    }
    this.pointer += 4;
  }

  op3(mode) {
    if (this.input.length > 0) {
      if (mode === 2) {
        this.opcode[this.opcode[this.pointer + 1] + this.relativeBase] = this.input[0];
      } else {
        this.opcode[this.opcode[this.pointer + 1]] = this.input[0];
      }
      this.input.shift();
      this.pointer += 2;
    } else {
      this.inPause = true;
    }
  }

  op4(a) {
    if (this.preserveOutput) {
      this.output ? this.output.push(a) : this.output = [a];
    } else {
      this.output = a;
    }
    this.pointer += 2;
  }

  op5(a, b) {
    this.pointer = a !== 0 ? b : this.pointer + 3;
  }

  op6(a, b) {
    this.pointer = a === 0 ? b : this.pointer + 3;
  }

  op7(a, b, mode) {
    if (mode === 2) {
      this.opcode[this.opcode[this.pointer + 3] + this.relativeBase] = a < b ? 1 : 0;
    } else {
      this.opcode[this.opcode[this.pointer + 3]] = a < b ? 1 : 0;
    }
    this.pointer += 4;
  }

  op8(a, b, mode) {
    if (mode === 2) {
      this.opcode[this.opcode[this.pointer + 3] + this.relativeBase] = a === b ? 1 : 0;
    } else {
      this.opcode[this.opcode[this.pointer + 3]] = a === b ? 1 : 0;
    }
    this.pointer += 4;
  }

  op9(a) {
    this.relativeBase += a;
    this.pointer += 2;
  }

  op99() {
    this.active = false;
  }

  runComputer() {
    this.active = true;
    this.inPause = false;
    while(this.active && !this.inPause) {
      const instructionCode = this.opcode[this.pointer].toString().padStart(5, '0');
      const firstParamMode = Number(instructionCode[2]);
      const secondParamMode = Number(instructionCode[1]);
      const thirdParamMode = Number(instructionCode[0]);
      const operation = Number(instructionCode.substring(3));
      if (operation === 3 || operation === 99) {
        this[`op${operation}`](firstParamMode);
      } else if (operation === 4 || operation === 9) {
        const a = firstParamMode === 0 ? this.opcode[this.opcode[this.pointer+1]] :
          firstParamMode === 2 ? this.opcode[this.opcode[this.pointer+1]+this.relativeBase] :
          this.opcode[this.pointer+1];

        this[`op${operation}`](a);
      } else {
        const a = firstParamMode === 0 ? this.opcode[this.opcode[this.pointer+1]] :
          firstParamMode === 2 ? this.opcode[this.opcode[this.pointer+1]+this.relativeBase] :
          this.opcode[this.pointer+1];
        const b = secondParamMode === 0 ? this.opcode[this.opcode[this.pointer+2]] :
          secondParamMode === 2 ? this.opcode[this.opcode[this.pointer+2]+this.relativeBase] :
          this.opcode[this.pointer+2];

        this[`op${operation}`](a, b, thirdParamMode);
      }
    }
  }

  cloneComputer() {
    return new IntCodeComputer(
      [...this.opcode],
      [...this.input],
      this.preserveOutput,
      {
        pointer: this.pointer,
        relativeBase: this.relativeBase,
        output: this.output,
        active: this.active,
        inPause: this.inPause
      }
    );
  }
}

//Day 1
const day1_masses = fs.readFileSync('./2019/day1.txt', 'utf-8').split('\n').map(Number);

function calculateFuel(masses) {
  let count = 0;
  masses.forEach(mass => {
    count += Math.floor(mass / 3) - 2;
  })
  console.log(count);
}

function calculateWholeFuel(masses) {
  let totalCount = 0;
  masses.forEach(mass => {
    let count = Math.floor(mass / 3) - 2;
    let currentMass = count;
    while (currentMass > 0) {
      const newMass = Math.floor(currentMass / 3) - 2;
      if (newMass > 0) {
        count += newMass;
        currentMass = newMass;
      } else {
        currentMass = 0;
      }
    }
    totalCount += count;
  })
  console.log(totalCount);
}

//Day 2
const day2_opcodes = fs.readFileSync('./2019/day2.txt', 'utf-8').split(',').map(Number);

function runIntcode(opcodes) {
  const codes = [...opcodes];
  codes[1] = 12;
  codes[2] = 2;
  const computer = new IntCodeComputer(codes, null);
  computer.runComputer();
  console.log(computer.getOpcode()[0]);
}

function findNounAndVerbInIntcode(opcodes) {
  let noun, verb;
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const codes = [...opcodes];
      codes[1] = x;
      codes[2] = y;
      const computer = new IntCodeComputer(codes, null);
      computer.runComputer();

      if (computer.getOpcode()[0] === 19690720) {
        noun = x;
        verb = y;
        break;
      }
    }
    if (noun && verb) break;
  }

  console.log(100 * noun + verb);
}

//Day 3
const day3_wires = fs.readFileSync('./2019/day3.txt', 'utf-8').split('\n').map(wire => wire.split(','));

function findCrossedPoints(wires) {
  const wire1 = [];
  const wire2 = [];
  let currentPosition;
  wires.forEach((wire, id) => {
    currentPosition = [0,0];
    wire.forEach(path => {
      const direction = path.substring(0,1);
      const distance = Number(path.substring(1));
      for (let i = 0; i < distance; i++) {
        if (direction === 'U') currentPosition[1]--;
        if (direction === 'D') currentPosition[1]++;
        if (direction === 'L') currentPosition[0]--;
        if (direction === 'R') currentPosition[0]++;
        if (id === 0) wire1.push(currentPosition.join('x'));
        else wire2.push(currentPosition.join('x'));
      }
    })
  });
  const crossedPoints = wire1.filter(coord => wire2.includes(coord));
  const distances = crossedPoints.map(point => {
    const [x, y] = point.split('x').map(Number);
    return Math.abs(x) + Math.abs(y);
  })
  console.log(Math.min(...distances));
  //Part 2:
  const wiresLength = crossedPoints.map(point => wire1.indexOf(point) + wire2.indexOf(point) + 2);
  console.log(Math.min(...wiresLength));
}

//Day 4
const day4_passRange = fs.readFileSync('./2019/day4.txt', 'utf-8').split('-').map(Number);

function countMatchingPasswords(range) {
  const matching = [];
  for (let i = range[0]; i <= range[1]; i++) {
    const digits = i.toString().split('');
    if (digits.some((d, id) => d === digits[id+1]) &&
        digits.every((d, id) => id + 1 === digits.length ? true : d <= digits[id+1])) {
      matching.push(i);
    }
  }
  console.log(matching.length);
}

function countMatchingStricterPasswords(range) {
  const matching = [];
  for (let i = range[0]; i <= range[1]; i++) {
    const digits = i.toString().split('');
    if (digits.some((d, id) => d === digits[id+1] && digits.filter(dig => dig === d).length === 2) &&
        digits.every((d, id) => id + 1 === digits.length ? true : d <= digits[id+1])) {
      matching.push(i);
    }
  }
  console.log(matching.length);
}

//Day 5
const day5_opcodes = fs.readFileSync('./2019/day5.txt', 'utf-8').split(',').map(Number);

function runAirConditionerByIntCode(opcodes, input) {
  const computer = new IntCodeComputer([...opcodes], [input]);
  computer.runComputer();
  console.log(computer.getOutput());
}

//Day 6
const day6_orbits = fs.readFileSync('./2019/day6.txt', 'utf-8').split('\n');
const Graph = require('node-dijkstra');

function prepareRoutesBetweenPlanets(orbits) {
  const route = new Graph();
  let orbitsLeft = [...orbits];
  const knownPlanets = [];
  while (orbitsLeft.length > 0) {
    const from = orbitsLeft[0].split(')')[0];
    const matchingOrbitsThatStart = orbits.filter(o => o.startsWith(from)).map(o => o.split(')'));
    const matchingOrbitsThatEnd = orbits.filter(o => o.endsWith(from)).map(o => o.split(')'));
    orbitsLeft = orbitsLeft.filter(o => !o.startsWith(from));
    const x = new Map();
    matchingOrbitsThatStart.forEach(orbit => {
      x.set(orbit[1], 1);
      knownPlanets.push(orbit[1]);
    })
    matchingOrbitsThatEnd.forEach(orbit => {
      x.set(orbit[0], 1);
    })
    route.addNode(from, x);
  }
  const YOUorbit = orbits.filter(o => o.endsWith('YOU'))[0].split(')')
  route.addNode('YOU', { [YOUorbit[0]]: 1 });
  const SANorbit = orbits.filter(o => o.endsWith('SAN'))[0].split(')')
  route.addNode('SAN', { [SANorbit[0]]: 1 });
  return { route, knownPlanets };
}

function countOrbits(orbits) {
  const { route, knownPlanets } = prepareRoutesBetweenPlanets(orbits);
  let orbitsCount = 0;
  knownPlanets.forEach(pl => {
    orbitsCount += route.path("COM", pl, { cost: true }).cost
  });
  console.log(orbitsCount)
}

function findDistanceToSanta(orbits) {
  const { route } = prepareRoutesBetweenPlanets(orbits);
  console.log(route.path("YOU", "SAN", { cost: true }).cost - 2);
}

//Day 7
const day7_opcodes = fs.readFileSync('./2019/day7.txt', 'utf-8').split(',').map(Number);

function configureAmplifiers(opcode) {
  const combinations = permutations([0, 1, 2, 3, 4]);
  const thrusters = [];

  combinations.forEach(c => {
    let lastOutput = 0;
    for (let i = 0; i < c.length; i++) {
      const computer = new IntCodeComputer([...opcode], [c[i], lastOutput]);
      computer.runComputer();
      lastOutput = computer.getOutput();
    }
    thrusters.push(lastOutput);
  });
  console.log(Math.max(...thrusters));
}

function configureAmplifiersUsingLoop(opcode) {
  const combinations = permutations([5, 6, 7, 8, 9]);
  const thrusters = [];
  combinations.forEach(c => {
    let lastOutput = 0;
    const computers = [
      new IntCodeComputer([...opcode], [c[0]]),
      new IntCodeComputer([...opcode], [c[1]]),
      new IntCodeComputer([...opcode], [c[2]]),
      new IntCodeComputer([...opcode], [c[3]]),
      new IntCodeComputer([...opcode], [c[4]])
    ];
    //First iteration
    for (let i = 0; i < c.length; i++) {
      computers[i].addInput(lastOutput);
      computers[i].runComputer();
      lastOutput = computers[i].getOutput();
    }
    //"feedback loop"
    while (computers[4].isInPause()) {
      for (let i = 0; i < c.length; i++) {
        computers[i].addInput(lastOutput);
        computers[i].runComputer();
        lastOutput = computers[i].getOutput();
      }
    }

    thrusters.push(lastOutput);
  });

  console.log(Math.max(...thrusters));
}

//Day 8
const day8_nums = fs.readFileSync('./2019/day8.txt', 'utf-8').split('').map(Number);

function findDarkestLayer(nums) {
  const undecodedNums = [...nums];
  const layers = [];
  const zerosInLayers = [];
  while (undecodedNums.length > 0) {
    const layer = undecodedNums.splice(0, 25 * 6);
    layers.push(layer);
    zerosInLayers.push(layer.filter(n => n === 0).length);
  }
  const darkestId = zerosInLayers.indexOf(Math.min(...zerosInLayers));
  const digit1 = layers[darkestId].filter(n => n === 1).length
  const digit2 = layers[darkestId].filter(n => n === 2).length
  console.log(digit1 * digit2);
  return layers;
}

function decodeImage(layers) {
  const image = Array(6).fill('').map(() => Array(25).fill(''));
  layers.forEach(l => {
    for (let i = 0; i < 25 * 6; i++) {
      if (!image[Math.trunc(i / 25)][i % 25]) {
        if (l[i] === 0) image[Math.trunc(i / 25)][i % 25] = ' ';
        if (l[i] === 1) image[Math.trunc(i / 25)][i % 25] = '█';
      }
    }
  });
  console.log('Adjust your console width to see the message:')
  console.log(JSON.stringify(image))
}

//Day 9
const day9_opcodes = fs.readFileSync('./2019/day9.txt', 'utf-8').split(',').map(Number);

function runBoostCode(opcodes, input) {
  const computer = new IntCodeComputer([...opcodes], [input]);
  computer.runComputer();
  console.log(computer.getOutput());
}

//Day 10
const day10_asteroids = fs.readFileSync('./2019/day10.txt', 'utf-8').split('\n').map(row => row.split(''));

function scanSonarRoute(space, sonars, X, Y, vaporize = false) {
  let sonarX = sonars[0];
  let sonarY = sonars[1];
  const checkedCoords = [];
  let foundOnThisScan = false;
  let coord = null;
  while ((sonarY < space.length - Y && sonarY >= Y * -1) && (sonarX < space[0].length - X && sonarX >= X * -1)) {
    const coords = `${sonarX},${sonarY}`
    if (space[Y + sonarY][X + sonarX] === '#' && !foundOnThisScan) {
      foundOnThisScan = true;
      if (vaporize) {
        coord = `${X + sonarX},${Y + sonarY}`;
        space[Y + sonarY][X + sonarX] = '.';
      }
    }
    checkedCoords.push(coords);
    sonarX += sonars[0];
    sonarY += sonars[1];
  }
  return { checkedCoords, found: foundOnThisScan, coord }
}

function checkRoutesOnQuarter(space, X, Y, j, i, vaporize = false) {
  const triedSonars = [];
  let detectedCount = 0;
  const detectedCoords = [];
  let sonarX = X;
  let sonarY = Y;
  while (sonarY < space.length - i && sonarY >= i * -1 ) {
    while (sonarX < space[0].length - j && sonarX >= j * -1) {
      if (!triedSonars.includes(`${sonarX},${sonarY}`)) {
        results = scanSonarRoute(space, [sonarX, sonarY], j, i, vaporize);
        triedSonars.push(...results.checkedCoords);
        if (results.found) detectedCount++;
        if (results.coord) detectedCoords.push(results.coord);
      }
      X > 0 ? sonarX++ : sonarX--;
    }
    sonarX = X;
    Y > 0 ? sonarY++ : sonarY--;
  }
  return { count: detectedCount, coords: detectedCoords };
}

function findBestSpotForSonar(asteroids) {
  const space = JSON.parse(JSON.stringify(asteroids));
  const possibleSpots = [];
  const asteroidCoords = [];
  for (let i = 0; i < space.length; i++) {
    for (let j = 0; j < space[0].length; j++) {
      if (space[i][j] === '#') {
        asteroidCoords.push([j,i]);
        let detectedAsteroids = 0;
        let results;

        //up
        results = scanSonarRoute(space, [0, -1], j, i);
        if (results.found) detectedAsteroids++;

        //right
        results = scanSonarRoute(space, [1, 0], j, i);
        if (results.found) detectedAsteroids++;

        //down
        results = scanSonarRoute(space, [0, 1], j, i);
        if (results.found) detectedAsteroids++;

        //left
        results = scanSonarRoute(space, [-1, 0], j, i);
        if (results.found) detectedAsteroids++;

        const upRightFound = checkRoutesOnQuarter(space, 1, -1, j, i);
        detectedAsteroids += upRightFound.count;

        const downRightFound = checkRoutesOnQuarter(space, 1, 1, j, i);
        detectedAsteroids += downRightFound.count;

        const downLeftFound = checkRoutesOnQuarter(space, -1, 1, j, i);
        detectedAsteroids += downLeftFound.count;

        const upLeftFound = checkRoutesOnQuarter(space, -1, -1, j, i);
        detectedAsteroids += upLeftFound.count;

        possibleSpots.push(detectedAsteroids);
      }
    }
  }
  const maxDetected = Math.max(...possibleSpots);
  console.log(maxDetected);
  return asteroidCoords[possibleSpots.indexOf(maxDetected)];
}

function vaporizeAsteroids(asteroids, laserPosition) {
  const space = JSON.parse(JSON.stringify(asteroids));
  space[laserPosition[1]][laserPosition[0]] = 'X';
  const vaporizedAsteroids = [];
  //this might be very specific to my input as the 200th asteroid is vaporized on up-left quarter.
  //it may happen that it won't work for other inputs
  let afterLeft;
  while (vaporizedAsteroids.length < 200) {
    //up
    results = scanSonarRoute(space, [0, -1], laserPosition[0], laserPosition[1], true);
    if (results.coord) vaporizedAsteroids.push(results.coord);

    const upRightFound = checkRoutesOnQuarter(space, 1, -1, laserPosition[0], laserPosition[1], true);
    vaporizedAsteroids.push(...upRightFound.coords);

    //right
    results = scanSonarRoute(space, [1, 0], laserPosition[0], laserPosition[1], true);
    if (results.coord) vaporizedAsteroids.push(results.coord);

    const downRightFound = checkRoutesOnQuarter(space, 1, 1, laserPosition[0], laserPosition[1], true);
    vaporizedAsteroids.push(...downRightFound.coords);

    //down
    results = scanSonarRoute(space, [0, 1], laserPosition[0], laserPosition[1], true);
    if (results.coord) vaporizedAsteroids.push(results.coord);

    const downLeftFound = checkRoutesOnQuarter(space, -1, 1, laserPosition[0], laserPosition[1], true);
    vaporizedAsteroids.push(...downLeftFound.coords);

    //left
    results = scanSonarRoute(space, [-1, 0], laserPosition[0], laserPosition[1], true);
    if (results.coord) vaporizedAsteroids.push(results.coord);

    afterLeft = vaporizedAsteroids.length;

    const upLeftFound = checkRoutesOnQuarter(space, -1, -1, laserPosition[0], laserPosition[1], true);
    vaporizedAsteroids.push(...upLeftFound.coords);
  }

  let asteroidsToCheck = vaporizedAsteroids.splice(afterLeft);
  asteroidsToCheck = asteroidsToCheck.map(coords => {
    const [x,y] = coords.split(',').map(Number);
    const radians = Math.atan2((y - laserPosition[1]) * -1, x - laserPosition[0]);
    return { position: x * 100 + y, radians };
  }).sort((a,b) => b.radians - a.radians);
  vaporizedAsteroids.push(...asteroidsToCheck);

  console.log(vaporizedAsteroids[199].position);
}

//Day 11
const day11_opcodes = fs.readFileSync('./2019/day11.txt', 'utf-8').split(',').map(Number);

function createDrawingRobot(opcodes, startOnWhite = false) {
  const directions = ['U', 'R', 'D', 'L', 'U'];
  const robotPosition = [0, 0];
  let robotDirection = 'U';
  const visitedPanels = [];
  let paintedPanels = [];
  if (startOnWhite) paintedPanels.push('0x0');
  const startValue = startOnWhite ? 1 : 0;
  const robotBrain = new IntCodeComputer(opcodes, [startValue], true);
  robotBrain.runComputer();
  let instructions = robotBrain.getOutput();

  const moveRobot = () => {
    if (!visitedPanels.includes(robotPosition.join('x')))
      visitedPanels.push(robotPosition.join('x'));
    if (instructions[0] === 1) {
      paintedPanels.push(robotPosition.join('x'));
    } else {
      paintedPanels = paintedPanels.filter(p => p !== robotPosition.join('x'));
    }
    if (instructions[1] === 0) {
      robotDirection = directions[directions.lastIndexOf(robotDirection) - 1];
    } else {
      robotDirection = directions[directions.indexOf(robotDirection) + 1];
    }
    if (robotDirection === 'U') robotPosition[1]--;
    if (robotDirection === 'R') robotPosition[0]++;
    if (robotDirection === 'D') robotPosition[1]++;
    if (robotDirection === 'L') robotPosition[0]--;
  }
  moveRobot();


  while(robotBrain.isInPause()) {
    const toAdd = paintedPanels.includes(robotPosition.join('x')) ? 1 : 0;
    robotBrain.addInput(toAdd);
    robotBrain.runComputer();
    instructions = robotBrain.getOutput();
    moveRobot();
  }

  if (startOnWhite) {
    return paintedPanels;
  } else {
    console.log(visitedPanels.length);
  }
}

function drawRegistrationIdentifier(panels) {
  const x = panels.map(p => p.split('x').map(Number)[0]);
  const y = panels.map(p => p.split('x').map(Number)[1]);
  const xBoundaries = [Math.min(...x), Math.max(...x)];
  const yBoundaries = [Math.min(...y), Math.max(...y)];
  const xSize = Math.abs(xBoundaries[0]) + xBoundaries[1] + 1;
  const ySize = Math.abs(yBoundaries[0]) + yBoundaries[1] + 1;
  const identifier = Array(ySize).fill(' ').map(() => Array(xSize).fill(' '));

  panels.forEach(p => {
    const coords = p.split('x').map(Number);
    identifier[coords[1] - yBoundaries[0]][coords[0] - xBoundaries[0]] = '█';
  })
  console.log('Adjust your console width to see the message:')
  console.log(JSON.stringify(identifier));
}

//Day 12
const day12_moons = fs.readFileSync('./2019/day12.txt', 'utf-8').split('\n');

function calculateMoonsEnergy(moonsRaw) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const moons = moonsRaw.map((m, id) => {
    const pos = m.match(NUMBER_REGEX).map(Number);
    return { id, pos, vel: [0, 0, 0] }
  })

  for (let i = 0; i < 1000; i++) {
    moons.forEach(moon => {
      let values = [0, 0, 0];
      moons.filter(m => m.id !== moon.id).forEach(m => {
        moon.pos[0] < m.pos[0] ? values[0]++ : moon.pos[0] > m.pos[0] && values[0]--;
        moon.pos[1] < m.pos[1] ? values[1]++ : moon.pos[1] > m.pos[1] && values[1]--;
        moon.pos[2] < m.pos[2] ? values[2]++ : moon.pos[2] > m.pos[2] && values[2]--;
      })
      moon.vel[0] += values[0];
      moon.vel[1] += values[1];
      moon.vel[2] += values[2];
    });

    moons.forEach(moon => {
      moon.pos[0] += moon.vel[0];
      moon.pos[1] += moon.vel[1];
      moon.pos[2] += moon.vel[2];
    })
  }

  let totalEnergy = 0;
  moons.forEach(m => {
    totalEnergy += m.pos.reduce((a, b) => Math.abs(a) + Math.abs(b), 0) * m.vel.reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
  })
  console.log(totalEnergy);
}

// Function taken from https://www.30secondsofcode.org/js/s/lcm
const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

function findRepeatInMoonsMovement(moonsRaw) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const moonsX = moonsRaw.map((m, id) => {
    const pos = m.match(NUMBER_REGEX).map(Number);
    return { id, pos: pos[0], vel: 0 }
  });
  const moonsY = moonsRaw.map((m, id) => {
    const pos = m.match(NUMBER_REGEX).map(Number);
    return { id, pos: pos[1], vel: 0 }
  });
  const moonsZ = moonsRaw.map((m, id) => {
    const pos = m.match(NUMBER_REGEX).map(Number);
    return { id, pos: pos[2], vel: 0 }
  });

  const initX = JSON.stringify(moonsX);
  const initY = JSON.stringify(moonsY);
  const initZ = JSON.stringify(moonsZ);
  let repeatX, repeatY, repeatZ;

  for (let i = 1; !repeatX; i++) {
    moonsX.forEach(moon => {
      let value = 0;
      moonsX.filter(m => m.id !== moon.id).forEach(m => {
        moon.pos < m.pos ? value++ : moon.pos > m.pos && value--;
      })
      moon.vel += value;
    });
    moonsX.forEach(moon => {
      moon.pos += moon.vel;
    })
    if (initX === JSON.stringify(moonsX)) repeatX = i;
  }

  for (let i = 1; !repeatY; i++) {
    moonsY.forEach(moon => {
      let value = 0;
      moonsY.filter(m => m.id !== moon.id).forEach(m => {
        moon.pos < m.pos ? value++ : moon.pos > m.pos && value--;
      })
      moon.vel += value;
    });
    moonsY.forEach(moon => {
      moon.pos += moon.vel;
    })
    if (initY === JSON.stringify(moonsY)) repeatY = i;
  }

  for (let i = 1; !repeatZ; i++) {
    moonsZ.forEach(moon => {
      let value = 0;
      moonsZ.filter(m => m.id !== moon.id).forEach(m => {
        moon.pos < m.pos ? value++ : moon.pos > m.pos && value--;
      })
      moon.vel += value;
    });
    moonsZ.forEach(moon => {
      moon.pos += moon.vel;
    })
    if (initZ === JSON.stringify(moonsZ)) repeatZ = i;
  }
  console.log(lcm(repeatX, repeatY, repeatZ));
}

//Day 13
const day13_opcodes = fs.readFileSync('./2019/day13.txt', 'utf-8').split(',').map(Number);

function countBlocksInArkanoid(opcodes) {
  const computer = new IntCodeComputer(opcodes, [], true);
  computer.runComputer();
  const data = computer.getOutput();
  const blocks = data.filter((n, id) => (id + 1) % 3 === 0 && n === 2);
  console.log(blocks.length);

  //Visualisation (not needed but fun to do)
  const game = Array(22).fill('').map(() => Array(37).fill(''));
  visualiseGame(data, game);
}

// Taken from https://stackoverflow.com/a/47480429
const delay = ms => new Promise(res => setTimeout(res, ms));

async function playArkanoid(opcodes) {
  opcodes[0] = 2;
  const computer = new IntCodeComputer(opcodes, [], true);
  computer.runComputer();
  let data = computer.getOutput();
  const game = Array(22).fill('').map(() => Array(37).fill(''));
  let gameState = visualiseGame(data, game);

  while (computer.isInPause()) {
    const nextMove = gameState.ballX > gameState.paddleX ? 1 : gameState.ballX < gameState.paddleX ? -1 : 0;
    computer.addInput(nextMove);
    computer.runComputer();
    data = computer.getOutput();
    gameState = visualiseGame(data, game, gameState);
    await delay(2); //Increase this value if you want to slow down the visualisation of the game
  }
}

function visualiseGame(data, game, state) {
  let currentScore = 0;
  let ballX, paddleX;
  if (state) {
    ballX = state.ballX
    paddleX = state.paddleX
    currentScore = state.currentScore
  }
  for (let i = 0; i < data.length - 2; i += 3) {
    if (data[i] === -1) {
      currentScore = data[i+2];
    } else {
      let symbol;
      switch (data[i+2]) {
        case 0:
          symbol = ' ';
          break;
        case 1:
          symbol = '█'; //wall
          break;
        case 2:
          symbol = '#'; //block
          break;
        case 3:
          symbol = '_'; //paddle
          paddleX = data[i];
          break;
        case 4:
          symbol = 'O'; //ball
          ballX = data[i];
          break;
        default:
          break;
      }
      game[data[i+1]][data[i]] = symbol;
    }
  }
  console.log('Score: '+currentScore);
  console.log(JSON.stringify(game).replaceAll('\"', '').replaceAll(',', ''));
  return { ballX, paddleX, currentScore };
}

//Day 14
const day14_reactions = fs.readFileSync('./2019/day14.txt', 'utf-8').split('\n');

function getFuelFormula(reactions, toProduce = 1) {
  const CHEMICAL_REGEX = /[0-9]+\s+[A-Z]+/g;
  const formulas = reactions.map(r => {
    const i = r.match(CHEMICAL_REGEX).map(x => x.split(' '));
    const p = i.pop();
    return {
      product: {
        count: Number(p[0]),
        name: p[1],
      },
      ingredients: i.map(ing => ({count: Number(ing[0]), name: ing[1]}))
    }
  })
  let mainIngredients = formulas.find(f => f.product.name === 'FUEL').ingredients.map(i => ({...i, count: i.count * toProduce}));
  let remains = [];
  let requiredORE = 0

  while (mainIngredients.length > 0) {
    const toCraft = mainIngredients.shift();
    const inRemains = remains.find(r => r.name === toCraft.name);
    if (inRemains) {
      const needed = toCraft.count;
      toCraft.count -= inRemains.count;
      if (toCraft.count < 0) {
        toCraft.count = 0;
        inRemains.count -= needed;
      } else {
        remains = remains.filter(r => r.name !== toCraft.name);
      }
    }

    const formula = formulas.find(f => f.product.name === toCraft.name);
    const neededCrafts = Math.ceil(toCraft.count / formula.product.count);
    mainIngredients.unshift(...formula.ingredients.map(i => ({...i, count: i.count * neededCrafts })));
    if (neededCrafts !== toCraft.count / formula.product.count) {
      remains.push({
        count: formula.product.count - (toCraft.count % formula.product.count),
        name: toCraft.name
      });
    }
    if (mainIngredients[0].name === 'ORE') {
      const ore = mainIngredients.shift();
      requiredORE += ore.count;
    }
  }

  if (toProduce === 1) {
    console.log(requiredORE);
  }
  return requiredORE;
}

function produceFuel(reactions) {
  const availableORE = 1000000000000;
  let usedORE = 0
  let producedFuel = Math.ceil(availableORE / getFuelFormula(reactions));
  // ^ we will produce at least this amount, so it's safe to start from here ^
  while (usedORE < availableORE) {
    usedORE = getFuelFormula(reactions, producedFuel);
    if (usedORE < availableORE) {
      if (availableORE - usedORE > 1000000000) {
        //we can safely speed up
        producedFuel += 10000;
      } else {
        producedFuel++;
      }
    }
  }
  console.log(producedFuel - 1); //idk why answer is always 1 less
}

//Day 15
const day15_opcodes = fs.readFileSync('./2019/day15.txt', 'utf-8').split(',').map(Number);

function navigateDriod(opcodes) {
  const computer = new IntCodeComputer(opcodes, []);
  const visitedLocations = ['0x0'];
  const possibleDestinations = [1, 2, 3, 4];
  let shortestPath;
  let positionOfOxygen;

  const dfs = (comp, currentMove = '', currentPosition = '0x0', moves = 0) => {
    if (currentMove) moves++;

    let newPosition = currentPosition.split('x').map(Number);
    if (currentMove === 1) newPosition[1]--;
    if (currentMove === 2) newPosition[1]++;
    if (currentMove === 3) newPosition[0]--;
    if (currentMove === 4) newPosition[0]++;
    newPosition = newPosition.join('x');

    comp.addInput(currentMove);
    comp.runComputer();
    const output = comp.getOutput();

    if (output === 0 || visitedLocations.includes(newPosition)) {
      return;
    }
    else if (output === 2) {
      if (!shortestPath || shortestPath > moves) {
        shortestPath = moves;
      }
      positionOfOxygen = newPosition;
      return;
    };
    visitedLocations.push(newPosition);

    let destinations;
    // Avoid going up-down or left-right endlessly
    if (currentMove === 1) destinations = [1,3,4];
    if (currentMove === 2) destinations = [2,3,4];
    if (currentMove === 3) destinations = [1,2,3];
    if (currentMove === 4) destinations = [1,2,4];

    destinations.forEach(dest => {
      dfs(comp.cloneComputer(), dest, newPosition, moves);
    })
  }

  possibleDestinations.forEach(dest => {
    dfs(computer.cloneComputer(), dest);
  })

  console.log(shortestPath)
  return { visitedLocations, positionOfOxygen };
}

function drawShip(shipAreaData) {
  // Just a helper function for debugging
  const oxygenPosition = shipAreaData.positionOfOxygen.split('x').map(Number);;
  let locationsToFill = shipAreaData.visitedLocations;
  let minX, minY, maxX, maxY;
  locationsToFill.forEach(l => {
    const [x,y] = l.split('x').map(Number);
    if (!minX || minX > x) minX = x;
    if (!minY || minY > y) minY = y;
    if (!maxX || maxX < x) maxX = x;
    if (!maxY || maxY < y) maxY = y;
  })

  const ship = Array(maxY - minY +1).fill(' ').map(() => Array(maxX - minX + 1).fill(' '));

  locationsToFill.forEach(loc => {
    const [x,y] = loc.split('x').map(Number);
    ship[y-minY][x-minX] = '#'
  })
  ship[oxygenPosition[1]-minY][oxygenPosition[0]-minX] = 'O';

  console.log(JSON.stringify(ship));
}

function fillShipWithOxygen(shipAreaData) {
  const oxygenPosition = shipAreaData.positionOfOxygen;
  let locationsToFill = [...shipAreaData.visitedLocations, shipAreaData.positionOfOxygen];

  const route = new Graph();
  locationsToFill.forEach(loc => {
    const from = loc.split('x').map(Number);
    const to = new Map();
    if (locationsToFill.includes(`${from[0]-1}x${from[1]}`)) to.set(`${from[0]-1}x${from[1]}`, 1);
    if (locationsToFill.includes(`${from[0]+1}x${from[1]}`)) to.set(`${from[0]+1}x${from[1]}`, 1);
    if (locationsToFill.includes(`${from[0]}x${from[1]-1}`)) to.set(`${from[0]}x${from[1]-1}`, 1);
    if (locationsToFill.includes(`${from[0]}x${from[1]+1}`)) to.set(`${from[0]}x${from[1]+1}`, 1);

    route.addNode(loc, to);
  });

  const paths = [];
  locationsToFill.forEach(loc => {
    const path = route.path(oxygenPosition, loc, { cost: true }).cost;
    if (path) {
      paths.push(path);
    }
  })
  console.log(Math.max(...paths));
}

// Day 16
const day16_numbers = fs.readFileSync('./2019/day16.txt', 'utf-8');

function cleanFFTSignal(input) {
  let currentInput = input;

  for (let phase = 1; phase <= 100; phase++) {
    let newInput = '';
    for (let x = 1; x <= currentInput.length; x++) {
      let output = 0;
      let position = -1; //cause the first one is always skipped
      let add = true;
      while (position < currentInput.length) {
        position += x;
        for (let num = 0; num < x; num++) {
          const digit = currentInput[position + num];
          if (!digit) break;
          if (add) output += Number(digit);
          else output -= Number(digit);
        }
        add = !add;
        position += x;
      }
      const trimmedOutput = Math.abs(output) % 10;
      newInput += trimmedOutput.toString();
    }
    currentInput = newInput;
  }
  console.log(currentInput.substring(0,8));
}

/*
Part 2 took me A LOT of time to figure out, and after many tries and reworks, the functions were still too slow to get the solution.
I went to reddit for some leads and thanks to the user Arkoniak and his great explanation, I was finally able to solve this:

```
  Let's take final digit and apply phase procedure to it. In case of last digit (no matter the length of the initial string) will always look like 0, 0, ..., 0, 1 (lots of zero and one 1 at the last position). So phase procedure applied to last digit will always give this same digit , no matter the length of input sequence. So, we write down s'[end] = s[end]
  Let's take second from the end. It's filter will look like 0, 0, ...., 0, 1, 1. Now, you know, that new last digit equals last digit from original input, so new value for the second digit from the end will be the following: s'[end - 1] = mod(s[end - 1] + s[end], 10) = mod(s[end-1] + s'[end], 10)
  Next digit will have filter 0, 0, ...., 0, 1, 1, 1, so new value will be s'[end - 2] = mod(s[end - 2] + s[end - 1] + s[end], 10) = mod(s[end - 2] + s'[end - 1], 10)
```
*/

function getOffsetFromFFTSignal(input, options = null) {
  let currentInput = '';
  if (!options) {
    for (let x = 1; x <= 10000; x++) {
      currentInput += input;
    }
    const offset = Number(input.substring(0, 7));
    currentInput = currentInput.substring(offset) // I don't need any digits from the start of the string
  } else {
    currentInput = input; // this will be the input generated before and saved in the file
  }
  const staringPhase = options ? options.phase : 1;

  for (let phase = staringPhase; phase <= 100; phase++) {
    console.log('Starting from phase ' + phase);
    let newInput = currentInput[currentInput.length - 1]; // The last digit is always the same
    // Filling input from the end
    for (let pos = currentInput.length - 2; pos >= 0; pos--) {
      const newDigit = (Number(newInput[0]) + Number(currentInput[pos])) % 10;
      newInput = `${newDigit}${newInput}`;
    }
    currentInput = newInput;
    console.log('Finished phase ' + phase);
    fs.writeFileSync('./2019/day16_input.txt', currentInput);
    fs.writeFileSync('./2019/day16_phase.txt', (phase + 1).toString());
  }

  console.log(currentInput.substring(0,8));
}

// Day 17
const day17_opcodes = fs.readFileSync('./2019/day17.txt', 'utf-8').split(',').map(Number);

function buildCameraView(opcodes) {
  const computer = new IntCodeComputer(opcodes, [], true);
  computer.runComputer();
  const output = computer.getASCIIOutput();
  const cameraView = [];
  let robotPosition = '';

  const row = [];
  for (let i = 0; i < output.length; i++) {
    if (output[i] !== '\n') {
      if (output[i] === '^') robotPosition = `${row.length}x${cameraView.length}`;
      row.push(output[i]);
    }
    else if (row.length > 0) {
      cameraView.push([...row]);
      row.splice(0);
    }
  }
  return { cameraView, robotPosition };
}

function findAlignments(opcodes) {
  const { cameraView } = buildCameraView([...opcodes]);
  let alignmentParameters = 0;

  for (let y = 1; y < cameraView.length - 1; y++) {
    // There won't be any intersections in edge rows & cols so they can be omitted
    for (let x = 1; x < cameraView[0].length - 1; x++) {
      if (cameraView[y][x] === '#') {
        if (cameraView[y][x+1] === '#' && cameraView[y][x-1] === '#' && cameraView[y+1][x] === '#' && cameraView[y-1][x] === '#') {
          alignmentParameters += x * y;
        }
      }
    }
  }
  console.log(alignmentParameters);
}

function getAWayOut(cameraView, startPosition, startDirection) {
  const currentPosition = startPosition.split('x').map(Number);
  let robotDir = startDirection;
  const wayOut = [];
  let canMove = true;
  let shouldTurn = true;

  while (canMove) {
    if (shouldTurn) {
      if (robotDir === 'U') {
        if (currentPosition[0] > 0 && cameraView[currentPosition[1]][currentPosition[0] - 1] === '#') {
          robotDir = 'L';
          wayOut.push('L');
        } else if (currentPosition[0] < cameraView[0].length - 1 && cameraView[currentPosition[1]][currentPosition[0] + 1] === '#') {
          robotDir = 'R';
          wayOut.push('R');
        } else {
          canMove = false;
        }
      } else if (robotDir === 'D') {
        if (currentPosition[0] > 0 && cameraView[currentPosition[1]][currentPosition[0] - 1] === '#') {
          robotDir = 'L';
          wayOut.push('R');
        } else if (currentPosition[0] < cameraView[0].length - 1 && cameraView[currentPosition[1]][currentPosition[0] + 1] === '#') {
          robotDir = 'R';
          wayOut.push('L');
        } else {
          canMove = false;
        }
      } else if (robotDir === 'R') {
        if (currentPosition[1] > 0 && cameraView[currentPosition[1] - 1][currentPosition[0]] === '#') {
          robotDir = 'U';
          wayOut.push('L');
        } else if (currentPosition[1] < cameraView.length - 1 && cameraView[currentPosition[1] + 1][currentPosition[0]] === '#') {
          robotDir = 'D';
          wayOut.push('R');
        } else {
          canMove = false;
        }
      } else {
        if (currentPosition[1] > 0 && cameraView[currentPosition[1] - 1][currentPosition[0]] === '#') {
          robotDir = 'U';
          wayOut.push('R');
        } else if (currentPosition[1] < cameraView.length - 1 && cameraView[currentPosition[1] + 1][currentPosition[0]] === '#') {
          robotDir = 'D';
          wayOut.push('L');
        } else {
          canMove = false;
        }
      }
      shouldTurn = false;
      if (canMove) wayOut.push(0);
    } else {
      if (robotDir === 'U') {
        wayOut[wayOut.length - 1]++;
        currentPosition[1]--;
        if (currentPosition[1] === 0 || cameraView[currentPosition[1] - 1][currentPosition[0]] !== '#') {
          shouldTurn = true;
        }
      } else if (robotDir === 'D') {
        wayOut[wayOut.length - 1]++;
        currentPosition[1]++;
        if (currentPosition[1] === cameraView.length - 1 || cameraView[currentPosition[1] + 1][currentPosition[0]] !== '#') {
          shouldTurn = true;
        }
      } else if (robotDir === 'R') {
        wayOut[wayOut.length - 1]++;
        currentPosition[0]++;
        if (currentPosition[0] === cameraView[0].length - 1 || cameraView[currentPosition[1]][currentPosition[0] + 1] !== '#') {
          shouldTurn = true;
        }
      } else {
        wayOut[wayOut.length - 1]++;
        currentPosition[0]--;
        if (currentPosition[0] === 0 || cameraView[currentPosition[1]][currentPosition[0] - 1] !== '#') {
          shouldTurn = true;
        }
      }
    }
  }
  return wayOut.join(',');
}

function navigateRobotOnScafflod(opcodes) {
  const { cameraView, robotPosition } = buildCameraView([...opcodes]);
  const wayOut = getAWayOut(cameraView, robotPosition, 'U');
  // Result for my opcodes:
  // L,10,R,8,R,6,R,10,L,12,R,8,L,12,L,10,R,8,R,6,R,10,L,12,R,8,L,12,L,10,R,8,R,8,L,10,R,8,R,8,L,12,R,8,L,12,L,10,R,8,R,6,R,10,L,10,R,8,R,8,L,10,R,8,R,6,R,10
  // Was going to write a function to search for the pattern but I saw it almost immediately so I'm going to do it manully to not waste the time to write it xD

  const A = 'L,10,R,8,R,6,R,10';
  const B = 'L,12,R,8,L,12';
  const C = 'L,10,R,8,R,8';
  const compiledWayOut = wayOut.replaceAll(A, 'A').replaceAll(B, 'B').replaceAll(C, 'C');

  opcodes[0] = 2;
  const computer = new IntCodeComputer(opcodes, []);

  computer.addASCIIInput(compiledWayOut);
  computer.addASCIIInput(A);
  computer.addASCIIInput(B);
  computer.addASCIIInput(C);
  computer.addASCIIInput('y');

  computer.runComputer();

  console.log(computer.getOutput())
}

// Day 18
const day18_map = fs.readFileSync('./2019/day18.txt', 'utf-8').split('\n').map(row => row.split(''));

function findReachableKeys(map, obtainedKeys) {
  const lettersLocations = {};
  const route = new Graph();
  let currentPosition;

  const assignRouteCost = (point, coords) => {
    if (point === '.' || point === '@' || !isNaN(point)) return 1; // floor or start
    else {
      // key or door
      const isKey = point === point.toLowerCase();
      if (isKey) {
        lettersLocations[point] = coords;
        return 10 ** 5;
      } else {
        if (!obtainedKeys.includes(point.toLowerCase())) return 10 ** 6; // Can't go through this door
        else return 1; // Can be easily opened
      }
    }
  }

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') continue;
      const from = `${x},${y}`;
      const to = new Map();

      if (map[y][x] === '@') currentPosition = from;
      if (map[y-1] && map[y-1][x] !== '#') to.set(`${x},${y-1}`, assignRouteCost(map[y-1][x], `${x},${y-1}`));
      if (map[y][x-1] && map[y][x-1] !== '#') to.set(`${x-1},${y}`, assignRouteCost(map[y][x-1], `${x-1},${y}`));
      if (map[y][x+1] && map[y][x+1] !== '#') to.set(`${x+1},${y}`, assignRouteCost(map[y][x+1], `${x+1},${y}`));
      if (map[y+1] && map[y+1][x] !== '#') to.set(`${x},${y+1}`, assignRouteCost(map[y+1][x], `${x},${y+1}`));

      route.addNode(from, to);
    }
  }
  const reachableLocations = {};
  const isThereAKey = Object.entries(lettersLocations).length > 0;

  Object.entries(lettersLocations).forEach(([letter, loc]) => {
    const pathToKey = route.path(currentPosition, loc, { cost: true });
    if (pathToKey.path && pathToKey.cost < 2 * (10 ** 5)) reachableLocations[letter] = { distance: pathToKey.cost - 10 ** 5 + 1, position: loc };
  });

  return { currentPosition, reachableLocations, isThereAKey }
}

function collectAllKeys(map, useRobots = false) {
  if (useRobots) {
    // For part 2
    let entranceFound = false;
    for (let y = 0; y < map.length; y++) {
      if (entranceFound) break;
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === '@') {
          map[y-1][x-1] = '1';
          map[y-1][x+1] = '2';
          map[y+1][x-1] = '3';
          map[y+1][x+1] = '4';

          map[y][x] = '#';
          map[y-1][x] = '#';
          map[y+1][x] = '#';
          map[y][x-1] = '#';
          map[y][x+1] = '#';
          entranceFound = true;
          break;
        }
      }
    }
  }

  let fewestSteps;
  let currentStep = 0;
  let thisStepAverageKeys;

  const queue = { 0: [{
    currentMap: map,
    obtainedKeys: [],
  }]}

  const clearQueue = () => {
    queue[currentStep].shift();
    if (queue[currentStep].length === 0) {
      delete queue[currentStep];
      currentStep++;

      if (queue[currentStep]) {
        const sumOfKeys = queue[currentStep].reduce((a, b) => a + b.obtainedKeys.length, 0);
        thisStepAverageKeys = sumOfKeys / queue[currentStep].length;
      } else {
        thisStepAverageKeys = undefined;
      }
    }
  }
  const moveToReachableKeys = (currentMap, obtainedKeys, positionMark = '@') => {
    const data = findReachableKeys(currentMap, obtainedKeys);
    if (!data.isThereAKey) {
      fewestSteps = currentStep;
      return;
    }
    const position = data.currentPosition.split(',').map(Number);

    Object.entries(data.reachableLocations).forEach(([letter, letterData]) => {
      const lPosition = letterData.position.split(',').map(Number);

      const newMap = JSON.parse(JSON.stringify(currentMap)); //deep copy of array of arrays
      newMap[position[1]][position[0]] = '.';
      newMap[lPosition[1]][lPosition[0]] = positionMark;

      const newKeys = [...obtainedKeys, letter];

      const newDataObj = {
        currentMap: newMap,
        obtainedKeys: newKeys,
      }

      const stepsAfterMove = currentStep + letterData.distance;
      if (!queue[stepsAfterMove]) {
        queue[stepsAfterMove] = [newDataObj]
      } else {
        queue[stepsAfterMove].push(newDataObj);
      }
    })
  }
  const savedMaps = new Set();

  // BFS
  while(!fewestSteps) {
    while (!queue[currentStep]) {
      currentStep++;
    }
    const { currentMap, obtainedKeys } = queue[currentStep][0];
    if (savedMaps.has(JSON.stringify([currentMap, [...obtainedKeys].sort()]))) {
      clearQueue(); // There was a faster way here and already is somewhere in queue
      continue;
    }
    savedMaps.add(JSON.stringify([currentMap, [...obtainedKeys].sort()]));

    if (!useRobots && thisStepAverageKeys && thisStepAverageKeys > obtainedKeys.length) {
      // Usually at this point there're more keys, so we can assume that this way is inefficient. Not really safe, but saves A LOT of time in part 1. Does not work well in part 2, so it's omitted there.
      clearQueue();
      continue;
    }

    if (!useRobots) {
      moveToReachableKeys(currentMap, obtainedKeys);
    } else {
      for (let robot = 1; robot <= 4; robot++) {
        const robotMap = JSON.parse(JSON.stringify(currentMap).replace(robot.toString(), '@'));
        moveToReachableKeys(robotMap, obtainedKeys, robot.toString());
      }
    }

    clearQueue();
  }

  console.log(fewestSteps);
}

// Day 19
const day19_opcodes = fs.readFileSync('./2019/day19.txt', 'utf-8').split(',').map(Number);

function scanTractorBeamArea(opcodes) {
  let affectedPoints = 0;

  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      const computer = new IntCodeComputer([...opcodes], [x, y]);
      computer.runComputer();
      if (computer.getOutput() === 1) {
        affectedPoints++;
      }
    }
  }

  console.log(affectedPoints);
}

function fitSantaInBeam(opcodes) {
  let currentXStreak = 0;
  let possiblePoints = []; // will be filled with [x, y] arrays
  let lastPositiveFrom = 0;
  let pointFound = null;
  const santaSize = 100;

  for (let y = 25; y < Infinity; y++) {
    if (pointFound) break;
    currentXStreak = 0;
    for (let x = lastPositiveFrom; x < Infinity; x++) {
      const computer = new IntCodeComputer([...opcodes], [x, y]);
      computer.runComputer();
      const output = computer.getOutput();

      if (output === 1) {
        if (currentXStreak === 0) {
          lastPositiveFrom = x;
          if (possiblePoints[0] && possiblePoints[0][1] + santaSize - 1 === y) {
            pointFound = possiblePoints[0][0] * 10000 + possiblePoints[0][1];
            break;
          }
        }
        currentXStreak++;
      } else {
        if (currentXStreak === 0) {
          while (possiblePoints[0] && possiblePoints[0][0] === x) {
            possiblePoints.shift()
          }
        } else if (currentXStreak >= santaSize) {
          possiblePoints.push([x - santaSize, y]);
          break;
        } else {
          // < santaSize && > 0, so there were ones, but turned into zeros too soon
          break;
        }
      }
    }
  }

  console.log(pointFound);
}

// Day 20
const day20_maze = fs.readFileSync('./2019/day20.txt', 'utf-8').split('\n').map(row => row.split(''));

function findExitInMaze(maze) {
  const exitPoints = [2, 26, 80, 104];
  const portals = {};
  let start, end;

  const addPortal = (portalName, location) => {
    if (!portalName.includes('.') && !portalName.includes('#')) {
      if (portalName === 'AA') {
        start = location;
      } else if (portalName === 'ZZ') {
        end = location;
      } else {
        portals[location] = portalName;
      }
    }
  }

  exitPoints.forEach(y => {
    for (x = 2; x <= 104; x++ ) {
      if (maze[y][x] === '.') {
        let portalName = '';
        if (y === 2 || y === 80) {
          portalName += maze[y-2][x];
          portalName += maze[y-1][x];
        } else {
          portalName += maze[y+1][x];
          portalName += maze[y+2][x];
        }
        addPortal(portalName, `${x},${y}`);
      }
    }
  });
  exitPoints.forEach(x => {
    for (y = 2; y <= 104; y++ ) {
      if (maze[y][x] === '.') {
        let portalName = '';
        if (x === 2 || x === 80) {
          portalName += maze[y][x-2];
          portalName += maze[y][x-1];
        } else {
          portalName += maze[y][x+1];
          portalName += maze[y][x+2];
        }
        addPortal(portalName, `${x},${y}`);
      }
    }
  });

  const route = new Graph();
  const routeDepth0 = new Graph();
  for (y = 2; y <= 104; y++) {
    for (x = 2; x <= 104; x++ ) {
      if (maze[y][x] === '.') {
        const from = `${x},${y}`;
        const to = new Map();
        if (maze[y-1][x] === '.') to.set(`${x},${y-1}`, 1);
        if (maze[y+1][x] === '.') to.set(`${x},${y+1}`, 1);
        if (maze[y][x-1] === '.') to.set(`${x-1},${y}`, 1);
        if (maze[y][x+1] === '.') to.set(`${x+1},${y}`, 1);
        const to0 = new Map(to);
        if (Object.keys(portals).includes(from)) {
          const portalName = portals[from];
          const matchingPortal = Object.entries(portals).find(([loc, pName]) => pName === portalName && loc !== from)
          to.set(matchingPortal[0], 1);
          if (x !== 2 && x !== 104 && y !== 2 && y !== 104) {
            to0.set(matchingPortal[0], 1);
          }
        }
        route.addNode(from, to);
        routeDepth0.addNode(from, to0);
      }
    }
  }

  console.log('Part 1:')
  console.log(route.path(start, end, { cost: true }).cost);

  let currentStep = 0;
  let fewestSteps;
  const queue = { 0: [{
    location: start,
    depth: 0
  }]};
  const savedSettings = new Set();

  const clearQueue = () => {
    queue[currentStep].shift();
    if (queue[currentStep].length === 0) {
      delete queue[currentStep];
      currentStep++;
    }
  }
  const checkDepthOfPath = (path) => {
    let depthChange = 0;
    let depthChangeCount = 0;
    for (x = 1; x < path.length; x++) {
      const thisCoords = path[x].match(/[0-9]+/g).map(Number);
      const prevCoords = path[x-1].match(/[0-9]+/g).map(Number);

      if (Math.abs(thisCoords[0] - prevCoords[0]) > 1 || Math.abs(thisCoords[1] - prevCoords[1]) > 1) {
        // path goes into portal, now check if its outer or inner
        if (path[x-1].includes('26') || path[x-1].includes('80')) {
          depthChange++;
        } else {
          depthChange--;
        }
        depthChangeCount++;
      }
    }
    return { depthChange, depthChangeCount }
  }
  // BFS
  while(!fewestSteps) {
    while (!queue[currentStep]) {
      currentStep++;
    }
    const { location, depth } = queue[currentStep][0];
    if (savedSettings.has(JSON.stringify([location, depth]))) {
      clearQueue(); // There was a faster way here and already is somewhere in queue.
      continue;
    }
    if (depth > 30) {
      clearQueue(); // We can suppose that the right answer won't go that deep. Can be adjusted if needed.
      continue;
    }
    savedSettings.add(JSON.stringify([location, depth]));

    if (depth === 0) {
      const path = routeDepth0.path(location, end, { cost: true });
      if (path.cost > 0) {
        const pathData = checkDepthOfPath(path.path);
        if (pathData.depthChangeCount === 0) {
          fewestSteps = currentStep + path.cost;
          break;
        }
      }
    }

    Object.keys(portals).forEach(portal => {
      let path;
      if (depth === 0) path = routeDepth0.path(location, portal, { cost: true });
      else path = route.path(location, portal, { cost: true });
      if (path.path && path.cost > 1) {
        const pathData = checkDepthOfPath(path.path);
        if (pathData.depthChangeCount <= 1) {
          // The safest way is to move only by one depth on one step
          const stepsAfterMove = currentStep + path.cost;
          if (!queue[stepsAfterMove]) {
            queue[stepsAfterMove] = [{ location: portal, depth: depth + pathData.depthChange }];
          } else {
            queue[stepsAfterMove].push({ location: portal, depth: depth + pathData.depthChange });
          }
        }
      }
    });

    clearQueue();
  }

  console.log('Part 2:');
  console.log(fewestSteps);
}

// Day 21
const day21_opcodes = fs.readFileSync('./2019/day21.txt', 'utf-8').split(',').map(Number);

function navigateWalkingSpringdroid(opcodes) {
  const computer = new IntCodeComputer([...opcodes], [], true);
  computer.runComputer();
  const commands = [
  'NOT A J', // Jump over 1 tile
  'NOT B T', 'AND C T', 'OR T J', // Jump over 2 tiles if 3rd exists
  'NOT C T', 'AND D T', 'OR T J' // Jump over 3 tiles if 4th exists
  ];
  commands.forEach(c => {
    computer.addASCIIInput(c);
  })
  computer.addASCIIInput('WALK');
  computer.runComputer();
  const output = computer.getOutput();
  console.log(output[output.length - 1]);
}

function navigateRunningSpringdroid(opcodes) {
  const computer = new IntCodeComputer([...opcodes], [], true);
  computer.runComputer();
  const commands = [
    'NOT A T', 'AND D T', 'OR T J', // Jump over 1 tile if 4th exists
    'NOT B T', 'AND D T', 'OR T J', // Jump over 2 tiles if 4th exists
    'NOT C T', 'AND D T', 'AND H T', 'OR T J' // Jump over 3 tiles if 4th and 8th exists
  ];
  commands.forEach(c => {
    computer.addASCIIInput(c);
  })
  computer.addASCIIInput('RUN');
  computer.runComputer();
  const output = computer.getOutput();
  console.log(output[output.length - 1]);
}

// Day 22
const day22_shuffles = fs.readFileSync('./2019/day22.txt', 'utf-8').split('\n');

function shuffleCards(shuffles, cardsCount) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  let deck = Array.from(Array(cardsCount).keys());

  shuffles.forEach(shuffle => {
    if (shuffle === 'deal into new stack') {
      deck.reverse();
    } else if (shuffle.startsWith('cut')) {
      const amount = Number(shuffle.match(NUMBER_REGEX)[0]);
      if (amount > 0) {
        const cut = deck.splice(0, amount);
        deck.push(...cut);
      } else {
        const cut = deck.splice(amount);
        deck.unshift(...cut)
      }
    } else {
      const inc = Number(shuffle.match(NUMBER_REGEX)[0]);
      const newDeck = Array(cardsCount);
      let i = 0;
      for (let x = 0; x < cardsCount; x++) {
        newDeck[i] = deck[x];
        i = (i + inc) % cardsCount;
      }
      deck = newDeck;
    }
  })

  console.log(deck.indexOf(2019));
}

// Part 2 ???




// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1:');
// calculateFuel(day1_masses);
// console.log('Day 1, part 2: ');
// calculateWholeFuel(day1_masses);

// console.log('Day 2, part 1:');
// runIntcode(day2_opcodes);
// console.log('Day 2, part 2:');
// findNounAndVerbInIntcode(day2_opcodes);

// console.log('Day 3, part 1 & 2 (it will take a while):');
// findCrossedPoints(day3_wires);

// console.log('Day 4, part 1:');
// countMatchingPasswords(day4_passRange);
// console.log('Day 4, part 2:');
// countMatchingStricterPasswords(day4_passRange);

// console.log('Day 5, part 1:');
// runAirConditionerByIntCode(day5_opcodes, 1)
// console.log('Day 5, part 2:');
// runAirConditionerByIntCode(day5_opcodes, 5)

// console.log('Day 6, part 1:');
// countOrbits(day6_orbits)
// console.log('Day 6, part 2:');
// findDistanceToSanta(day6_orbits)

// console.log('Day 7, part 1:');
// configureAmplifiers(day7_opcodes);
// console.log('Day 7, part 2:');
// configureAmplifiersUsingLoop(day7_opcodes);

// console.log('Day 8, part 1:');
// const layers = findDarkestLayer(day8_nums)
// console.log('Day 8, part 2:');
// decodeImage(layers);

// console.log('Day 9, part 1:');
// runBoostCode(day9_opcodes, 1)
// console.log('Day 9, part 2:');
// runBoostCode(day9_opcodes, 2)

// console.log('Day 10, part 1:');
// const bestSpot = findBestSpotForSonar(day10_asteroids)
// console.log('Day 10, part 2:');
// vaporizeAsteroids(day10_asteroids, bestSpot);

// console.log('Day 11, part 1:');
// createDrawingRobot(day11_opcodes);
// console.log('Day 11, part 2:');
// const toDraw = createDrawingRobot(day11_opcodes, true);
// drawRegistrationIdentifier(toDraw);

// console.log('Day 12, part 1:');
// calculateMoonsEnergy(day12_moons);
// console.log('Day 12, part 2:');
// findRepeatInMoonsMovement(day12_moons);

// console.log('Day 13, part 1 (with visualisation):');
// countBlocksInArkanoid(day13_opcodes);
// /* Before running part two, run only part 1 and adjust the size of your console, to see whole game screen (brackets should be on the left) */
// console.log('Day 13, part 2 (with visualisation):');
// playArkanoid(day13_opcodes);

// console.log('Day 14, part 1 & 2:');
// produceFuel(day14_reactions);

// console.log('Day 15, part 1:');
// const shipAreaData = navigateDriod(day15_opcodes);
// console.log('Day 15, part 2:');
// fillShipWithOxygen(shipAreaData);

// console.log('Day 16, part 1:');
// cleanFFTSignal(day16_numbers);
// console.log('Day 16, part 2 (even after all those speed ups, this will still take 2-3 hours to complete):');
// getOffsetFromFFTSignal(day16_numbers);
// For immediate answer, run the 3 lines below:
/*
const phaseXInput = fs.readFileSync('./2019/day16_input.txt', 'utf-8');
const finishedPhases = Number(fs.readFileSync('./2019/day16_phase.txt', 'utf-8'));
getOffsetFromFFTSignal(phaseXInput, { phase: finishedPhases });
*/

// console.log('Day 17, part 1:');
// findAlignments(day17_opcodes);
// console.log('Day 17, part 2:');
// navigateRobotOnScafflod(day17_opcodes);

// console.log('Day 18, part 1 (this will take 3-5 minutes):');
// collectAllKeys(day18_map);
// console.log('Day 18, part 2 (this will take 4-6 minutes):');
// collectAllKeys(day18_map, true);

// console.log('Day 19, part 1:');
// scanTractorBeamArea(day19_opcodes);
// console.log('Day 19, part 2 (this will take a few seconds):');
// fitSantaInBeam(day19_opcodes);

// console.log('Day 20 (this will take 2-3 minutes):');
// findExitInMaze(day20_maze);

// console.log('Day 21, part 1:');
// navigateWalkingSpringdroid(day21_opcodes);
// console.log('Day 21, part 2:');
// navigateRunningSpringdroid(day21_opcodes);

// console.log('Day 22, part 1:');
// shuffleCards(day22_shuffles, 10007);
