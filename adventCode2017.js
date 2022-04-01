const fs = require("fs");

//Day 1
const day1_numbers = fs.readFileSync('./2017/day1.txt', 'utf-8').split('').map(Number);

function solveCaptcha(numbers) {
  let sum = 0;
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === numbers[i - 1]) sum += numbers[i];
  }
  if (numbers[0] === numbers[numbers.length-1]) sum += numbers[0];
  console.log(sum);
}

function solveHarderCaptcha(numbers) {
  let sum = 0;
  const moveBy = numbers.length / 2;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === numbers[(i + moveBy) % numbers.length]) sum += numbers[i];
  }
  console.log(sum);
}

//Day 2
const day2_numbers = fs.readFileSync('./2017/day2.txt', 'utf-8').split('\n').map(row => row.split('\t'));

function calculateChecksumByDiff(rows) {
  let sum = 0;
  rows.forEach(row => {
    const max = Math.max(...row.map(n => Number(n)))
    const min = Math.min(...row.map(n => Number(n)))
    sum += (max - min)
  })
  console.log(sum);
}

function calculateChecksumByDivision(rows) {
  let sum = 0;
  rows.forEach(row => {
    let num1, num2;
    for (let i = 0; i < row.length; i++) {
      for (let j = 0; j < row.length; j++) {
        if (i !== j && Number(row[i]) % Number(row[j]) === 0) {
          num1 = Number(row[i]);
          num2 = Number(row[j]);
        }
      }
      if (num1 && num2) break;
    }
    sum += (num1 / num2);
  });
  console.log(sum);
}

//Day 3
const day3_target = Number(fs.readFileSync('./2017/day3.txt', 'utf-8'));
//Part first was calculated in head xD not sure how to code it

//Part two:
function createSpiralAndGetTarget(target) {
  const screen = Array(528).fill(0).map(() => Array(528).fill(0));
  const dirs = ['N', 'E', 'S', 'W', 'N'];
  let nextToAssign = 1;
  let moveBy = 1;
  let movedBy = 0;
  let increaceMove = false;
  let direction = "E";
  let column = 268;
  let row = 267;
  screen[row][column] = nextToAssign;

  while (nextToAssign < target) {
    if (direction === "N") row--;
    if (direction === "E") column++;
    if (direction === "S") row++;
    if (direction === "W") column--;

    movedBy++;
    nextToAssign = screen[row][column - 1] + screen[row][column + 1] + screen[row - 1][column - 1] + screen[row + 1][column - 1] + screen[row + 1][column + 1] + screen[row - 1][column + 1] + screen[row - 1][column] + screen[row + 1][column];
    screen[row][column] = nextToAssign;
    if (movedBy === moveBy) {
      movedBy = 0;
      direction = dirs[dirs.lastIndexOf(direction) - 1];
      if (increaceMove) moveBy++;
      increaceMove = !increaceMove
    }
  }
  console.log(nextToAssign);
}

//Day 4
const day4_words = fs.readFileSync('./2017/day4.txt', 'utf-8').split('\n');

function validatePassphrasesByRepeat(passwords) {
  let pass = [];
  passwords.forEach(password => {
    const words = password.split(' ');
    hasDuplicates = words.some((word, index) =>
      words.indexOf(word) !== index
    );
    if (!hasDuplicates) pass.push(password);
  });
  console.log(pass.length);
  return pass;
}

function findAnagrams(passwords) {
  const pass = [];
  passwords.forEach(password => {
    const words = password.split(' ');
    for (word of words) {
      const isAnagram = words.some(word2 => {
        return word !== word2 && JSON.stringify(word.split('').sort()) === JSON.stringify(word2.split('').sort())
      })
      if (isAnagram) {
        pass.push(password);
        break;
      }
    };
  });
  console.log(passwords.length - pass.length);
}

//Day 5
const day5_jumps = fs.readFileSync('./2017/day5.txt', 'utf-8').split('\n').map(Number);

function countJumps(offsets) {
  let step = 0;
  let position = 0;
  let trampolines = [...offsets];
  while (position > 0 || position < offsets.length) {
    const jumpTo = position + trampolines[position];
    trampolines[position]++;
    position = jumpTo;
    step++;
  }
  console.log(step - 1);
}

function countJumps2(offsets) {
  let step = 0;
  let position = 0;
  let trampolines = [...offsets];
  while (position > 0 || position < offsets.length) {
    const jumpTo = position + trampolines[position];
    trampolines[position] >= 3 ? trampolines[position]-- : trampolines[position]++;
    position = jumpTo;
    step++;
  }
  console.log(step - 1);
}

//Day 6
const day6_banks = fs.readFileSync('./2017/day6.txt', 'utf-8').split('\t').map(Number);

function redistributeMemory(banks) {
  const knownConfigs = [JSON.stringify(banks)];
  const blocks = banks;
  while (knownConfigs.length < 20000) {
    const biggestBank = Math.max(...blocks);
    const startAt = blocks.indexOf(biggestBank);
    blocks[startAt] = 0;
    for (let i = 1; i <= biggestBank; i++) {
      blocks[(startAt + i) % blocks.length]++;
    }
    knownConfigs.push(JSON.stringify(blocks))
  }
  return knownConfigs;
}

function findDuplicate(array) {
  let duplicate;
  const atPos = [];
  for (let i = 0; i < array.length; i++) {
    if (array.indexOf(array[i]) !== i) {
      if (!duplicate) {
        duplicate = array[i];
        atPos.push(i);
      } else if (duplicate === array[i]) {
        atPos.push(i);
      }
    }
  }

  console.log(atPos[0]);
  console.log(atPos[0] - array.indexOf(duplicate));
}

//Day 7
const day7_programs = fs.readFileSync('./2017/day7.txt', 'utf-8').split('\n');

function findBottomProgram(programs) {
  const holdingProgs = programs.filter(prog => prog.includes('->'));
  const progsNames = programs.map(prog => prog.substring(0, prog.indexOf('(') - 1));
  const holdedProgs = [];
  holdingProgs.forEach(prog => {
    const holding = prog.substring(prog.indexOf('>') + 2).split(', ');
    holdedProgs.push(...holding);
  })

  console.log(progsNames.find(prog => !holdedProgs.includes(prog)));
}

function getFullWeight(w) {
  return w.reduce((a, b) => a + b);
}

function findUnbalance(programs) {
  const progsWithWeight = {};
  const NAMES_REGEX = /[a-z]+/g;
  const WEIGHT_REGEX = /[0-9]+/g;

  const holdingProgs = programs.filter(prog => prog.includes('->'));
  const topProgs = programs.filter(prog => !prog.includes('->'));
  let foundUnbalance = false;

  topProgs.forEach(prog => {
    const name = prog.match(NAMES_REGEX)[0];
    const weight = prog.match(WEIGHT_REGEX)[0];
    progsWithWeight[name] = [Number(weight)];
  })

  while (!foundUnbalance) {
    holdingProgs.forEach(prog => {
      const holding = prog.match(NAMES_REGEX)
      const name = holding.shift();
      const weight = prog.match(WEIGHT_REGEX)[0];
      if (holding.every(name => progsWithWeight[name])) {
        const childrenWeight = [];
        holding.forEach(name => childrenWeight.push(getFullWeight(progsWithWeight[name])))
        if (!childrenWeight.every(v => v === childrenWeight[0])) {
          foundUnbalance = true;
          console.log('Unbalance found. Find index of wrong weight from this array:');
          console.log(childrenWeight)
          console.log('Now pick a values from this index and fix first value to match weight of others. That\'ll be the answer')
          holding.forEach(name => console.log(progsWithWeight[name]));
        }
        progsWithWeight[name] = [Number(weight), getFullWeight(childrenWeight)];
      }
    })
  }

  return progsWithWeight;
}

//Day 8
const day8_instructions = fs.readFileSync('./2017/day8.txt', 'utf-8').split('\n');

function updateRegister(instructions) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const CONDITION_REGEX = /-?[0-9a-z]+/g;
  const registers = {};
  const highestValues = [];

  instructions.forEach(inst => {
    const target = inst.substring(0, inst.indexOf(' '));
    const command = inst.includes('inc') ? '+' : '-';
    const by = Number(inst.match(NUMBER_REGEX)[0]);

    const conditionStr = inst.substring(inst.indexOf('if') + 3);
    const conditionTarget = conditionStr.substring(0, conditionStr.indexOf(' '));
    const conditionBy = Number(inst.match(NUMBER_REGEX)[1]);
    const conditionOperator = conditionStr.replace(CONDITION_REGEX, '').replace(CONDITION_REGEX, ''); //replaceAll doesn't work for some reason

    if (!registers[target]) registers[target] = 0;
    if (!registers[conditionTarget]) registers[conditionTarget] = 0;

    if (eval(`${registers[conditionTarget]} ${conditionOperator} ${conditionBy}`)) {
      registers[target] = eval(`${registers[target]} ${command} ${by}`)
    }
    highestValues.push(Math.max(...Object.values(registers)));
  })

  console.log(Math.max(...Object.values(registers)));
  console.log(Math.max(...highestValues));
}

//Day 9
const day9_stream = fs.readFileSync('./2017/day9.txt', 'utf-8');

function removeNegations(text) {
  let txt = text;
  while (txt.includes('!')) {
    txt = txt.replace(`!${txt[txt.indexOf('!') + 1]}`, '')
  }
  return txt;
}

function removeGarbage(text) {
  let txt = text;
  let removed = 0;
  while (txt.includes('<')) {
    const toRemove = txt.substring(txt.indexOf('<'), txt.indexOf('>') + 1);
    removed += toRemove.length - 2;
    txt = txt.replace(toRemove, '');
  }
  console.log("Part 2: " + removed)
  return txt.replace(/,/g, '');
}

function getGroupsScoreFromStream(stream) {
  let str = stream;
  str = removeNegations(str);
  str = removeGarbage(str);
  let score = 0;

  while (str.length > 0) {
    score += str.indexOf('{}') + 1;
    str = str.replace('{}', '');
  }

  console.log("Part 1: " + score);
}

//Day 10
const day10_lengths = fs.readFileSync('./2017/day10.txt', 'utf-8');

function tieKnot(lengths, pos = 0, skip = 0, array = [], consolePart1 = false) {
  fullLength = 256
  let line = array.length > 0 ? array : Array(fullLength);
  if (array.length === 0) {
    for (let i = 0; i < fullLength; i++) line[i] = i;
  }
  let currentPosition = pos;
  let skipSize = skip;

  lengths.forEach(l => {
    const takeToEnd = fullLength - currentPosition > l ? l : fullLength - currentPosition;
    const takeFromStart = fullLength - currentPosition > l ? 0 : (l + currentPosition) % fullLength;
    const firstPart = line.slice(currentPosition, takeToEnd + currentPosition);
    const secondPart = line.slice(0, takeFromStart);

    const newPart = [...firstPart, ...secondPart].reverse();
    const newFirst = newPart.slice(0, takeToEnd);
    const newSecond = newPart.slice(takeToEnd);

    line.splice(currentPosition, takeToEnd, ...newFirst);
    line.splice(0, takeFromStart, ...newSecond);

    currentPosition = (currentPosition + l + skipSize) % fullLength;
    skipSize++;
  })

  if (consolePart1) console.log(line[0] * line[1]);
  return {line, currentPosition, skipSize};
}

function generateKnotHash(text, toConsole = false) {
  const lengths = text.map(l => l.charCodeAt());
  lengths.push(17, 31, 73, 47, 23);
  const rounds = 64;
  let currentPosition = 0;
  let skipSize = 0;
  let sparseHash = Array(256);
  for (let i = 0; i < 256; i++) sparseHash[i] = i;

  for (let i = 1; i <= rounds; i++) {
    response = tieKnot(lengths, currentPosition, skipSize, sparseHash)
    sparseHash = response.line;
    currentPosition = response.currentPosition;
    skipSize = response.skipSize;
  }

  const denseHash = [];
  while (sparseHash.length > 0) {
    const sixteen = sparseHash.splice(0, 16);
    let output = sixteen[0];
    for (let i = 1; i < 16; i++) {
      output = output ^ sixteen[i];
    }
    denseHash.push(output);
  }

  let finalHash = '';
  for (let i = 0; i < denseHash.length; i++) {
    finalHash += (+`${denseHash[i]}`).toString(16).padStart(2, '0')
  }

  if (toConsole) console.log(finalHash);
  return finalHash;
}

//Day 11
const day11_navs = fs.readFileSync('./2017/day11.txt', 'utf-8').split(',');

const navOnHex = {
  n: (a, b) => [a, b - 2],
  s: (a, b) => [a, b + 2],
  ne: (a, b) => [a + 2, b - 1],
  se: (a, b) => [a + 2, b + 1],
  nw: (a, b) => [a - 2, b - 1],
  sw: (a, b) => [a - 2, b + 1],
};

function goBackToZeroOnHex(position) {
  let steps = 0
  let currentPosition = [...position];
  while (currentPosition.join(',') !== '0,0') {
    if (currentPosition[0] > 0) {
      if (currentPosition[1] > 0) {
        currentPosition = navOnHex.nw(...currentPosition);
      } else {
        currentPosition = navOnHex.sw(...currentPosition);
      }
    } else if (currentPosition[0] < 0) {
      if (currentPosition[1] > 0) {
        currentPosition = navOnHex.ne(...currentPosition);
      } else {
        currentPosition = navOnHex.se(...currentPosition);
      }
    } else {
      if (currentPosition[1] > 0) {
        currentPosition = navOnHex.n(...currentPosition);
      } else {
        currentPosition = navOnHex.s(...currentPosition);
      }
    }
    steps++;
  }
  return steps;
}

function countStepsFromLastPositionOnHex(navs) {
  let currentPosition = [0, 0];
  navs.forEach(nav => {
    currentPosition = navOnHex[nav](...currentPosition);
  });

  const steps = goBackToZeroOnHex(currentPosition);
  console.log(steps);
}

function countStepsFromFurthestPositionOnHex(navs) {
  let positions = [[0, 0]];
  navs.forEach(nav => {
    positions.push(navOnHex[nav](...positions[positions.length - 1]));
  });

  const steps = []
  for (let i = 1; i <= positions.length; i++) {
    steps.push(goBackToZeroOnHex(positions[positions.length - i]));
  }
  console.log(Math.max(...steps));
}

//Day 12
const day12_connections = fs.readFileSync('./2017/day12.txt', 'utf-8').split('\n');
const Graph = require('node-dijkstra');

function countConnectionsToZero(connections) {
  const route = new Graph();
  let routesWithoutGroup = [];
  connections.forEach(con => {
    const from = con.substring(0, con.indexOf('<') - 1);
    const to = con.substring(con.indexOf('>') + 2).split(', ');
    const x = new Map();
    to.forEach(dest => {
      x.set(dest, 1);
    })
    route.addNode(from, x);
    routesWithoutGroup.push(from);
  });

  //Part 1
  let count = 1; // 0 is always connected to 0
  connections.forEach(con => {
    const from = con.substring(0, con.indexOf('<') - 1);
    const path = route.path(from, '0');
    if (!!path) {
      count++;
      routesWithoutGroup = routesWithoutGroup.filter(r => r !== from);
    }
  });
  console.log(count);

  //Part 2
  let groups = 1; // first group was in part 1
  routesWithoutGroup.shift() //removing 0
  while (routesWithoutGroup.length > 0) {
    const connectingWith = routesWithoutGroup[0];
    routesWithoutGroup.shift();
    routesWithoutGroup.forEach(ro => {
      const path = route.path(ro, connectingWith);
      if (!!path) {
        routesWithoutGroup = routesWithoutGroup.filter(r => r !== ro);
      }
    });
    groups++;
  }
  console.log(groups);
}

//Day 13
const day13_layers = fs.readFileSync('./2017/day13.txt', 'utf-8').split('\n').map(layer => {
  const [depth, range] = layer.split(': ').map(Number);
  return { depth, range, repeatAt: (range - 1) * 2 };
});

function checkSeverity(layers) {
  let firewall = layers.map(layer => ({
    ...layer,
    position: 1,
    direction: 'D',
  }));
  const stepsToMake = firewall[firewall.length - 1].depth;
  const caughtAt = [];

  for (let i = 0; i <= stepsToMake; i++) {
    const currentLayer = firewall.find(l => l.depth === i);
    if (currentLayer && currentLayer.position === 1) {
      caughtAt.push(i);
    }
    firewall = firewall.map(layer => {
      const newPosition = layer.direction === 'D' ? layer.position + 1 : layer.position - 1;
      let newDirection = layer.direction;
      if (newPosition === 1) newDirection = 'D' ;
      if (newPosition === layer.range) newDirection = 'U';
      return {
        ...layer,
        position: newPosition,
        direction: newDirection,
      }
    });
  }

  let severity = 0;
  caughtAt.forEach(depth => {
    severity += depth * firewall.find(l => l.depth === depth).range
  });

  console.log(severity);
}

//Reworked function for part 2
function checkIfCaught(layers, delay) {
  const stepsToMake = layers[layers.length - 1].depth;
  let caught = false;
  for (let i = 0; i <= stepsToMake; i++) {
    const currentLayer = layers.find(l => l.depth === i);
    if (currentLayer && (i + delay) % currentLayer.repeatAt === 0) {
      caught = true;
      break;
    }
  }
  return caught;
}

function findSafeSecondToPassFirewall(layers) {
  let second = 0;
  let found = false;
  while (!found) {
    second++;
    found = !checkIfCaught(layers, second);
  }
  console.log(second)
}

//Day 14
const day14_key = fs.readFileSync('./2017/day14.txt', 'utf-8');

function countUsedSquaresOnHashedDisk(key) {
  const disk = Array(128).fill('.').map(() => Array(128).fill('.'));
  for (let i = 0; i < 128; i++) {
    const rowKey = key + '-' + i;
    const knotHash = generateKnotHash(rowKey.split(''));
    let binaryHash = '';
    for (let x = 0; x < 32; x++) {
      binaryHash += parseInt(knotHash.substring(x,x+1), 16).toString(2).padStart(4, '0');
    }
    for (let x = 0; x < 128; x++) {
      disk[i][x] = binaryHash[x] === '1' ? '#' : '.';
    }
  }
  console.log(JSON.stringify(disk).split('').filter(x => x === '#').length);
  return disk;
}

function countRegionsOnHashedDisk(disk) {
  let regions = 0;
  while (JSON.stringify(disk).includes('#')) {
    const regionCoords = [];
    for (let i = 0; i < 128; i++) {
      for (let j = 0; j < 128; j++) {
        if (disk[i][j] === '#') {
          regionCoords.push([i, j]);
          disk[i][j] = 'X' //mark as already counted
          break;
        }
      }
      if (regionCoords.length > 0) break;
    }

    let newPoints = 1;
    while (newPoints > 0) {
      for (let i = regionCoords.length - newPoints; i < regionCoords.length; i++) {
        newPoints = 0;
        const row = regionCoords[i][0];
        const col = regionCoords[i][1];
        //check up
        if (disk[row-1] && disk[row-1][col] === '#') {
          regionCoords.push([row-1, col]);
          disk[row-1][col] = 'X';
          newPoints++;
        }
        //check down
        if (disk[row+1] && disk[row+1][col] === '#') {
          regionCoords.push([row+1, col]);
          disk[row+1][col] = 'X';
          newPoints++;
        }
        //check left
        if (disk[row][col-1] && disk[row][col-1] === '#') {
          regionCoords.push([row, col-1]);
          disk[row][col-1] = 'X';
          newPoints++;
        }
        //check right
        if (disk[row][col+1] && disk[row][col+1] === '#') {
          regionCoords.push([row, col+1]);
          disk[row][col+1] = 'X';
          newPoints++;
        }
      }
    }
    regions++;
  }
  console.log(regions);
}

//Day 15
const day15_start_values = fs.readFileSync('./2017/day15.txt', 'utf-8').match(/[0-9]+/g).map(Number);

function compareGenerators(start_values) {
  const genValues = [...start_values];
  let judgeList = 0;
  for (let i = 1; i <= 40000000; i++) {
    genValues[0] = (genValues[0] * 16807) % 2147483647
    genValues[1] = (genValues[1] * 48271) % 2147483647
    const firstBinary = genValues[0].toString(2).padStart(16, '0');
    const secondBinary = genValues[1].toString(2).padStart(16, '0');;
    if (firstBinary.substring(firstBinary.length - 16) === secondBinary.substring(secondBinary.length - 16)) {
      judgeList++;
    }
  }
  console.log(judgeList);
}

function findMultiplication(start, by, multiply) {
  let curr;
  for (let i = 0; curr % by !== 0; i++) {
    if (i === 0) curr = start;
    curr = (curr * multiply) % 2147483647
  }
  return curr
}

function compareGeneratorsWithStricterRules(start_values) {
  const genValues = [...start_values];
  let judgeList = 0;
  for (let i = 1; i <= 5000000; i++) {
    genValues[0] = findMultiplication(genValues[0], 4, 16807);
    genValues[1] = findMultiplication(genValues[1], 8, 48271);
    const firstBinary = genValues[0].toString(2).padStart(16, '0');
    const secondBinary = genValues[1].toString(2).padStart(16, '0');;
    if (firstBinary.substring(firstBinary.length - 16) === secondBinary.substring(secondBinary.length - 16)) {
      judgeList++;
    }
  }
  console.log(judgeList);
}

//Day 16
const day16_sequence = fs.readFileSync('./2017/day16.txt', 'utf-8').split(',');
const dancers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

function makeThemDance(sequence, start_positions) {
  const dancers = [...start_positions];
  const NUMBER_REGEX = /[0-9]+/g;
  sequence.forEach(move => {
    if (move.startsWith('s')) {
      const [steps] = move.match(NUMBER_REGEX).map(Number);
      const toAddAtStart = dancers.splice(dancers.length - steps);
      dancers.unshift(...toAddAtStart);
    } else if (move.startsWith('x')) {
      const positions = move.match(NUMBER_REGEX).map(Number);
      const temp = dancers[positions[0]];
      dancers[positions[0]] = dancers[positions[1]];
      dancers[positions[1]] = temp;
    } else {
      const positions = [dancers.indexOf(move[1]), dancers.indexOf(move[3])];
      const temp = dancers[positions[0]];
      dancers[positions[0]] = dancers[positions[1]];
      dancers[positions[1]] = temp;
    }
  })
  return dancers.join('');
}

function danceBilionTimes(sequence, start_positions) {
  let dancers = [...start_positions];
  const repeatingPattern = [start_positions.join('')];
  let foundPattern = false;
  for (let i = 1; i <= 200; i++) {
    dancers = makeThemDance(sequence, dancers);
    if (dancers === start_positions.join('')) {
      foundPattern = true;
      break;
    } else {
      repeatingPattern.push(dancers);
    }
  }
  if (!foundPattern) {
    console.log('Pattern not found, try again with bigger sample')
    return;
  }

  console.log(repeatingPattern[1000000000 % repeatingPattern.length])
}

//Day 17
const day17_step = Number(fs.readFileSync('./2017/day17.txt', 'utf-8'));

function imitateSpinlock(step) {
  const state = [0, 1];
  let currentPosition = 1;
  for (let i = 2; i <= 2017; i++) {
    const newPos = (currentPosition + step + 1) % state.length;
    state.splice(newPos, 0, i);
    currentPosition = state.indexOf(i);
  }
  console.log(state[currentPosition + 1]);
}

function imitateSpinlock2(step) {
  let currentPosition = 1;
  let zeroPos = 0;
  let lastAfterZero = 1;
  for (let i = 2; i <= 50000000; i++) {
    const newPos = (currentPosition + step + 1) % i;
    currentPosition = newPos;
    if (newPos === zeroPos + 1) lastAfterZero = i;
    if (newPos <= zeroPos) zeroPos++;
  }
  console.log(lastAfterZero);
}

//Day 18
const day18_instructions = fs.readFileSync('./2017/day18.txt', 'utf-8').split('\n');

function operateRegisters(instructions) {
  const registers = {};
  let lastPlayed;
  let wasRecovered = false;
  let position = 0;
  while (!wasRecovered) {
    const inst = instructions[position].split(' ');
    if (inst[0] === 'jgz') {
      if (registers[inst[1]] && registers[inst[1]] > 0) {
        const value = isNaN(inst[2]) ? registers[inst[2]] : Number(inst[2]);
        position += value;
      } else {
        position++;
      }
    } else {
      const value = isNaN(inst[2]) ? registers[inst[2]] : Number(inst[2]);
      if (inst[0] === 'snd') {
        lastPlayed = registers[inst[1]];
      } else if (inst[0] === 'set') {
        registers[inst[1]] = value;
      } else if (inst[0] === 'add') {
        registers[inst[1]] += value;
      } else if (inst[0] === 'mul') {
        registers[inst[1]] *= value;
      } else if (inst[0] === 'mod') {
        registers[inst[1]] = registers[inst[1]] % value;
      } else if (inst[0] === 'rcv') {
        if (value !== 0) {
          console.log(lastPlayed);
          wasRecovered = true;
        }
      }
      position++;
    }
  }
}

class RegisterProgram {
  constructor(id, instructions) {
    this.instructions = instructions;
    this.registers = { p: id };
    this.position = 0;
    this.msgSendCount = 0;
    this.output = [];
    this.active = true;
    this.waitingFor = null;
  }

  isActive() {
    return this.active
  }
  isWaiting() {
    return !!this.waitingFor;
  }
  sendValue() {
    return this.output.length > 0 ? this.output.shift() : null;
  }
  receiveValue(value) {
    this.registers[this.waitingFor] = value;
    this.waitingFor = null;
    this.position++;
  }
  getSendCount() {
    return this.msgSendCount;
  }
  snd(x) {
    const value = isNaN(x) ? this.registers[x] : Number(x);
    this.output.push(value);
    this.msgSendCount++;
    this.position++;
  }
  rcv(x) {
    this.waitingFor = x;
  }
  set(x, y) {
    this.registers[x] = y;
    this.position++;
  }
  add(x, y) {
    this.registers[x] += y;
    this.position++;
  }
  mul(x, y) {
    this.registers[x] *= y;
    this.position++;
  }
  mod(x, y) {
    this.registers[x] = this.registers[x] % y;
    this.position++;
  }
  jgz(x, y) {
    const value = isNaN(x) ? this.registers[x] : Number(x);
    if (value > 0) {
      this.position += y;
    } else {
      this.position++;
    }
  }

  runProgram() {
    while(this.active && !this.waitingFor) {
      if (this.position >= this.instructions.length) {
        this.active = false;
      } else {
        const inst = this.instructions[this.position].split(' ');
        const value = isNaN(inst[2]) ? this.registers[inst[2]] : Number(inst[2]);
        this[inst[0]](inst[1], value);
      }
    }
  }
}

function operateDuelRegisters(instructions) {
  const program0 = new RegisterProgram(0, instructions);
  const program1 = new RegisterProgram(1, instructions);
  while ((program0.isActive() || program1.isActive()) && (!program0.isWaiting() || !program1.isWaiting())) {
    program0.runProgram();
    program1.runProgram();
    if (program0.isWaiting()) {
      const value = program1.sendValue();
      if (value !== null) program0.receiveValue(value);
    }
    if (program1.isWaiting()) {
      const value = program0.sendValue();
      if (value !== null) program1.receiveValue(value);
    }
  }
  console.log(program1.getSendCount());
}

//Day 19
const day19_diagram = fs.readFileSync('./2017/day19.txt', 'utf-8').split('\n').map(row => row.split(''));

function simulateRoutingPath(diagram) {
  const packet = { position: [diagram[0].indexOf('|'), 0], direction: 'D' }
  const lettersCollected = [];
  let steps = 0;
  let routeEnded = false;
  while(!routeEnded) {
    let nextSign, nextPosition;
    if (packet.direction === 'U') {
      nextPosition = [packet.position[0], packet.position[1] - 1]
      nextSign = diagram[nextPosition[1]][nextPosition[0]];
    }
    if (packet.direction === 'D') {
      nextPosition = [packet.position[0], packet.position[1] + 1]
      nextSign = diagram[nextPosition[1]][nextPosition[0]];
    }
    if (packet.direction === 'L') {
      nextPosition = [packet.position[0] - 1, packet.position[1]]
      nextSign = diagram[nextPosition[1]][nextPosition[0]];
    }
    if (packet.direction === 'R') {
      nextPosition = [packet.position[0] + 1, packet.position[1]]
      nextSign = diagram[nextPosition[1]][nextPosition[0]];
    }

    if (nextSign && nextSign !== '+' && nextSign !== ' ') {
      packet.position = [...nextPosition];
      if (nextSign !== '|' && nextSign !== '-') {
        lettersCollected.push(nextSign);
      }
    } else if (nextSign === '+') {
      packet.position = [...nextPosition];
      if (packet.direction === 'U' || packet.direction === 'D') {
        if (diagram[nextPosition[1]][nextPosition[0] - 1] !== ' ') {
          packet.direction = 'L';
        } else if (diagram[nextPosition[1]][nextPosition[0] + 1] !== ' ') {
          packet.direction = 'R';
        } else {
          console.log('packet stuck');
          console.log(packet);
          break;
        }
      } else {
        if (diagram[nextPosition[1] + 1] && diagram[nextPosition[1] + 1][nextPosition[0]] !== ' ') {
          packet.direction = 'D';
        } else if (diagram[nextPosition[1] - 1] && diagram[nextPosition[1] - 1][nextPosition[0]] !== ' ') {
          packet.direction = 'U';
        } else {
          console.log('packet stuck');
          console.log(packet);
          break;
        }
      }
    } else {
      routeEnded = true;
    }
    steps++;
  }

  console.log(lettersCollected.join(''));
  console.log(steps);
}

//Day 20
const day20_particles = fs.readFileSync('./2017/day20.txt', 'utf-8').split('\n');

function moveParticles(particles, collide = false) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  let particlesData = particles.map(particle => {
    const values = particle.split(', ');
    const p = values[0].match(NUMBER_REGEX).map(Number);
    const v = values[1].match(NUMBER_REGEX).map(Number);
    const a = values[2].match(NUMBER_REGEX).map(Number);
    return {
      position: p,
      velocity: v,
      acceleration: a
    }
  });

  for (let i = 0; i < 1000; i++) {
    const positions = [];
    const repeats = [];
    particlesData.forEach(particle => {
      particle.velocity[0] += particle.acceleration[0];
      particle.velocity[1] += particle.acceleration[1];
      particle.velocity[2] += particle.acceleration[2];
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      particle.position[2] += particle.velocity[2];
      if (collide) {
        const position = particle.position.join('x');
        if (positions.includes(position) && !repeats.includes(position)) {
          repeats.push(position);
        }
        positions.push(position);
      }
    });
    if (collide) {
      repeats.forEach(r => {
        particlesData = particlesData.filter(p => p.position.join('x') !== r)
      });
    }
  }

  if (!collide) {
    const distances = [];
    particlesData.forEach(particle => {
      distances.push(Math.abs(particle.position[0]) + Math.abs(particle.position[1]) + Math.abs(particle.position[2]));
    });
    console.log(distances.indexOf(Math.min(...distances)));
  } else {
    console.log(particlesData.length);
  }
}

//Day 21




// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1:')
// solveCaptcha(day1_numbers);
// console.log('Day 1, part 2:')
// solveHarderCaptcha(day1_numbers);

// console.log('Day 2, part 1:')
// calculateChecksumByDiff(day2_numbers)
// console.log('Day 2, part 2:')
// calculateChecksumByDivision(day2_numbers)

// console.log('Day 3, part 1:');
// console.log(419);
// console.log('Day 3, part 2:');
// createSpiralAndGetTarget(day3_target);

// console.log('Day 4, part 1:');
// const filteredInPart1 = validatePassphrasesByRepeat(day4_words)
// console.log('Day 4, part 2:');
// findAnagrams(filteredInPart1)

// console.log('Day 5, part 1:');
// countJumps(day5_jumps)
// console.log('Day 5, part 2:');
// countJumps2(day5_jumps)

// console.log('Day 6, part 1 & 2:');
// const arrayOfConfigs = redistributeMemory(day6_banks);
// findDuplicate(arrayOfConfigs);

// console.log('Day 7, part 1:');
// findBottomProgram(day7_programs);
// console.log('Day 7, part 2:');
// findUnbalance(day7_programs);

// console.log('Day 8, part 1 & 2:');
// updateRegister(day8_instructions);

// console.log('Day 9:')
// getGroupsScoreFromStream(day9_stream);

// console.log('Day 10, part 1:');
// tieKnot(day10_lengths.split(',').map(Number), 0, 0, [], true);
// console.log('Day 10, part 2:');
// generateKnotHash(day10_lengths.split(''), true);

// console.log('Day 11, part 1:');
// countStepsFromLastPositionOnHex(day11_navs);
// console.log('Day 11, part 2:');
// countStepsFromFurthestPositionOnHex(day11_navs);

// console.log('Day 12, part 1 & 2:');
// countConnectionsToZero(day12_connections);

// console.log('Day 13, part 1:');
// checkSeverity(day13_layers);
// console.log('Day 13, part 2:');
// findSafeSecondToPassFirewall(day13_layers)

// console.log('Day 14, part 1:');
// const disk = countUsedSquaresOnHashedDisk(day14_key);
// console.log('Day 14, part 2:');
// countRegionsOnHashedDisk(disk);

// console.log('Day 15, part 1 (this will take a while):');
// compareGenerators(day15_start_values);
// console.log('Day 15, part 2 (this will take a while too):');
// compareGeneratorsWithStricterRules(day15_start_values);

// console.log('Day 16, part 1:');
// console.log(makeThemDance(day16_sequence, dancers));
// console.log('Day 16, part 2:');
// danceBilionTimes(day16_sequence, dancers);

// console.log('Day 17, part 1:');
// imitateSpinlock(day17_step);
// console.log('Day 17, part 2:');
// imitateSpinlock2(day17_step);

// console.log('Day 18, part 1:');
// operateRegisters(day18_instructions);
// console.log('Day 18, part 2:');
// operateDuelRegisters(day18_instructions);

// console.log('Day 19, part 1 & 2:');
// simulateRoutingPath(day19_diagram);

// console.log('Day 20, part 1:');
// moveParticles(day20_particles);
// console.log('Day 20, part 2:');
// moveParticles(day20_particles, true);
