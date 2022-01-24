const fs = require("fs");
const permutations = require("./permutations");

// Computer created during day 5 and expanded on each other day when needed.
// So far used in days: 2, 5, 7, 9, 11, 13
class IntCodeComputer {
  constructor(opcode, input, preserveOutput = false) {
    this.opcode = opcode;
    this.input = input;
    this.pointer = 0;
    this.relativeBase = 0;
    this.output = null;
    this.active = false;
    this.inPause = false;
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

  getOpcode() {
    return this.opcode;
  }

  addInput(value) {
    this.input.push(value);
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
