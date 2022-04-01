const fs = require("fs");

//Day 1
const day1_numbers = fs.readFileSync('./2020/day1.txt', 'utf-8').split('\n').map(Number);

function findNumberInSumOfTwo(numbers, target) {
  let foundNumber;
  numbers.forEach(num => {
    if (!foundNumber && numbers.includes(target - num)) {
      foundNumber = num;
    }
  });
  if (target === 2020) console.log(foundNumber * (target - foundNumber));
  return !!foundNumber;
}

function findNumberInSumOfThree(numbers, target) {
  let num1, num2, num3;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i === j) break;
      if (numbers.includes(target - numbers[i] - numbers[j])) {
        num1 = numbers[i];
        num2 = numbers[j];
        num3 = target - numbers[i] - numbers[j];
      }
    }
    if (num1) break;
  }
  console.log(num1 * num2 * num3);
}

//Day 2
const day2_passwords = fs.readFileSync('./2020/day2.txt', 'utf-8').split('\n');

function countValidPasswords(passwords) {
  const NUMS_REGEX = /[0-9]+/g;
  const PASSWORD_REGEX = /[a-z]+/g;
  let valid = 0;
  passwords.forEach(pass => {
    const countPolicy = pass.match(NUMS_REGEX).map(Number);
    const [letterPolicy, password] = pass.match(PASSWORD_REGEX);
    const passWithReqLetter = password.split('').filter(l => l === letterPolicy).length;
    if (passWithReqLetter >= countPolicy[0] && passWithReqLetter <= countPolicy[1]) valid++;
  })

  console.log(valid);
}

function countValidPasswordsNewPolicy(passwords) {
  const NUMS_REGEX = /[0-9]+/g;
  const PASSWORD_REGEX = /[a-z]+/g;
  let valid = 0;
  passwords.forEach(pass => {
    const positionPolicy = pass.match(NUMS_REGEX).map(Number);
    const [letterPolicy, password] = pass.match(PASSWORD_REGEX);
    if (password[positionPolicy[0] - 1] === letterPolicy && password[positionPolicy[1] - 1] !== letterPolicy ||
      password[positionPolicy[0] - 1] !== letterPolicy && password[positionPolicy[1] - 1] === letterPolicy) {
        valid ++;
      }
  })

  console.log(valid);
}

//Day 3
const day3_trees_grid = fs.readFileSync('./2020/day3.txt', 'utf-8').split('\n').map(row => row.split(''));

function countEncounteredTrees(tree_grid, slopes) {
  let multipliedTrees = 1;

  slopes.forEach(slope => {
    let bumpedTrees = 0;
    const currentPosition = [0,0];
    while (currentPosition[1] < tree_grid.length) {
      if (tree_grid[currentPosition[1]][currentPosition[0] % tree_grid[0].length] === '#') {
        bumpedTrees++;
      }
      currentPosition[0] += slope[0];
      currentPosition[1] += slope[1];
    }
    multipliedTrees *= bumpedTrees;
  })
  console.log(multipliedTrees);
}

//Day 4
const day4_documents = fs.readFileSync('./2020/day4.txt', 'utf-8').split('\n\n');

function countValidDocs(documents) {
  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  const validDocs = []

  documents.forEach(doc => {
    if (requiredFields.every(field => doc.includes(field+':'))) validDocs.push(doc);
  });
  console.log(validDocs.length);
  return validDocs;
}

function makeDocValidation(documents) {
  let passedValidation = 0;

  documents.forEach(doc => {
    const BYR = Number(doc.substring(doc.indexOf('byr:') + 4, doc.indexOf('byr:') + 8));
    if (BYR < 1920 || BYR > 2002) return;

    const IYR = Number(doc.substring(doc.indexOf('iyr:') + 4, doc.indexOf('iyr:') + 8));
    if (IYR < 2010 || IYR > 2020) return;

    const EYR = Number(doc.substring(doc.indexOf('eyr:') + 4, doc.indexOf('eyr:') + 8));
    if (EYR < 2020 || EYR > 2030) return;

    const HGT_REGEX = /[0-9]+cm|[0-9]+in/;
    let HGT = doc.substring(doc.indexOf('hgt:') + 4, doc.indexOf('hgt:') + 9).trim().match(HGT_REGEX);
    if (!HGT) return;
    HGT = HGT[0];
    if ((HGT.includes('cm') && (isNaN(Number(HGT.substring(0,3))) || Number(HGT.substring(0,3)) < 150 || Number(HGT.substring(0,3)) > 193)) ||
    (HGT.includes('in') && (isNaN(Number(HGT.substring(0,2))) || Number(HGT.substring(0,2)) < 59 || Number(HGT.substring(0,2)) > 76))) return;

    const HCL_REGEX = /#+[0-9a-f]+/;
    const HCL = doc.substring(doc.indexOf('hcl:') + 4, doc.indexOf('hcl:') + 11);
    if (!HCL.match(HCL_REGEX) || HCL !== HCL.match(HCL_REGEX)[0]) return;

    const possibleECL = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
    const ECL = doc.substring(doc.indexOf('ecl:') + 4, doc.indexOf('ecl:') + 8);
    if (!possibleECL.includes(ECL.trim())) return

    const PID_REGEX = /[0-9]+/;
    const PID = doc.substring(doc.indexOf('pid:') + 4, doc.indexOf('pid:') + 14);
    if (!PID.match(NUMBER_REGEX) || PID.match(PID_REGEX)[0].length !== 9) return;

    passedValidation++
  });

  console.log(passedValidation);
}

//Day 5
const day5_seats = fs.readFileSync('./2020/day5.txt', 'utf-8').split('\n');

function findSeatID(seats) {
  const seatsID = [];
  seats.forEach(seat => {
    let rows = [0, 127];
    let columns = [0, 7]
    for (let i = 0; i <= 6; i++) {
      if (seat[i] === "F") {
        rows[1] = Math.trunc((rows[1] - (rows[1] - rows[0]) / 2));
      } else {
        rows[0] = rows[0] + Math.ceil((rows[1] - rows[0]) / 2);
      }
    }
    for (let i = 7; i <= 9; i++) {
      if (seat[i] === "L") {
        columns[1] = Math.trunc((columns[1] - (columns[1] - columns[0]) / 2));
      } else {
        columns[0] = columns[0] + Math.ceil((columns[1] - columns[0]) / 2);
      }
    }

    const ID = rows[0] * 8 + columns[0];
    seatsID.push(ID);
  })

  console.log(Math.max(...seatsID));
  //Part 2
  const sortedSeats = seatsID.sort((a, b) => a - b);
  for (let i = 0; i < seatsID.length - 1; i++) {
    if (sortedSeats[i] !== sortedSeats[i+1] - 1) {
      console.log(sortedSeats[i] + 1);
      break;
    }
  }
}

//Day 6
const day6_answers = fs.readFileSync('./2020/day6.txt', 'utf-8').split('\n\n').map(group => group.split('\n'));

function unionSets(setA, setB) {
  let _union = new Set(setA)
  for (let elem of setB) {
      _union.add(elem)
  }
  return _union
}

function getAnswersWhereAnyoneSaidYes(answers) {
  let count = 0;
  answers.forEach(an => {
    let setOfAnswers = new Set();
    an.forEach(a => setOfAnswers = unionSets(setOfAnswers, new Set(a)))
    count += setOfAnswers.size
  })

  console.log(count);
}

function getAnswersWhereEveryoneSaidYes(answers) {
  let count = 0;
  answers.forEach(an => {
    let chosenAnswers = an[0].split('');
    for (let i = 1; i < an.length; i++) {
      chosenAnswers = chosenAnswers.filter(a => an[i].includes(a));
    }
    count += chosenAnswers.length;
  })

  console.log(count);
}

//Day 7
const day7_bags = fs.readFileSync('./2020/day7.txt', 'utf-8').split('\n');
const Graph = require('node-dijkstra');

function checkBagsInsides(bags) {
  const route = new Graph();
  const knownBags = [];
  bags.forEach(bag => {
    const instruction = bag.replace(/ bags/g, '').replace(/ bag/g, '').replace('.', '');
    const parent = instruction.substring(0, instruction.indexOf('contain') - 1);
    let children = instruction.substring(instruction.indexOf('contain') + 8).split(', ');
    knownBags.push(parent);

    if (instruction.includes('no other')) {
      children = [{color: parent, count: 1}];
    } else {
      children = children.map(bag => ({color: bag.substring(bag.indexOf(' ') + 1), count: bag.substring(0, bag.indexOf(' '))}));
    }

    const x = new Map();
    children.forEach(child => {
      x.set(child.color, Number(child.count));
    })
    route.addNode(parent, x);
  });

  let foundRoutes = 0;
  knownBags.forEach(bag => {
    if (route.path(bag, 'shiny gold')) foundRoutes++;
  })
  console.log(foundRoutes);
}

function countNeededBags(bags) {
  const knownBags = [];
  bags.forEach(bag => {
    const instruction = bag.replace(/ bags/g, '').replace(/ bag/g, '').replace('.', '');
    const parent = instruction.substring(0, instruction.indexOf('contain') - 1);
    let children = instruction.substring(instruction.indexOf('contain') + 8).split(', ');

    if (instruction.includes('no other')) {
      knownBags.push({ color: parent, children: null, value: 0 });
    } else {
      children = children.map(bag => ({color: bag.substring(bag.indexOf(' ') + 1), count: Number(bag.substring(0, bag.indexOf(' ')))}));
      knownBags.push({ color: parent, children });
  }
  });

  let bagToSearch = knownBags.find(bag => bag.color === 'shiny gold');
  while (!bagToSearch.value) {
    knownBags.forEach(bag => {
      if (bag.value === undefined && bag.children && bag.children.every(childBag => knownBags.find(bag => bag.color === childBag.color).value !== undefined)) {
        let childrenValue = 0;
        bag.children.forEach(childBag => {
          const childVal = knownBags.find(bag => bag.color === childBag.color).value;
          childrenValue += childVal * childBag.count + childBag.count;
        });
        bag.value = childrenValue;
      }
    })
    bagToSearch = knownBags.find(bag => bag.color === 'shiny gold');
  }

  console.log(bagToSearch.value)
}

//Day 8
const day8_instructions = fs.readFileSync('./2020/day8.txt', 'utf-8').split('\n');

function findInfiniteLoop(instructions, logAnswer = false) {
  let accumulator = 0;
  let i = 0;
  const recordedValues = [];
  let noInfinite = false;

  while (!recordedValues.includes(i)) {
    if (i >= instructions.length) {
      noInfinite = true;
      break;
    }
    recordedValues.push(i);
    const command = instructions[i].split(' ');
    if (command[0] === 'nop') i++;
    else if (command[0] === 'acc') {
      i++;
      accumulator += Number(command[1]);
    } else {
      i += Number(command[1]);
    }
  }
  if (logAnswer) console.log(accumulator);
  return { accumulator, noInfinite }
}

function fixInfiniteLoop(instructions) {
  let acc;
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].includes('nop') || instructions[i].includes('jmp')) {
      const { accumulator, noInfinite } = findInfiniteLoop(instructions.map((inst, id) =>
        id === i ? inst.includes('nop') ? inst.replace('nop', 'jmp') : inst.replace('jmp', 'nop') : inst));
      if (noInfinite) {
        acc = accumulator;
        break;
      }
    }
  }
  console.log(acc);
}

//Day 9
const day9_numbers = fs.readFileSync('./2020/day9.txt', 'utf-8').split('\n').map(Number);

function findWeakSpot(nums) {
  const preamble = nums.slice(0, 25);
  for (let i = 25; i < nums.length; i++) {
    const isValid = findNumberInSumOfTwo(preamble, nums[i]);
    if (!isValid) {
      console.log(nums[i]);
      return nums[i];
    } else {
      preamble.shift();
      preamble.push(nums[i])
    }
  }
}

function sumArray(array) {
  return array.reduce((a,b) => a + b);
}

function getEncrtyptionWeakness(nums, target) {
  let weaknessSet = []
  let contiguousSet = [];
  for (let i = 0; i < nums.length; i++) {
    contiguousSet = [nums[i]];
    let toAdd = 1;
    while (sumArray(contiguousSet) < target) {
      contiguousSet.push(nums[i + toAdd]);
      toAdd++;
    }
    if (sumArray(contiguousSet) === target) {
      weaknessSet = contiguousSet;
      break;
    }
  }
  console.log(Math.min(...weaknessSet) + Math.max(...weaknessSet))
}

//Day 10
const day10_adapters = fs.readFileSync('./2020/day10.txt', 'utf-8').split('\n').map(Number);

function countJoltDifferences(adapters) {
  let oneJoltDiff = 0;
  let threeJoltDiff = 0;
  const sortedAdapters = adapters.sort((a, b) => a - b);
  sortedAdapters.unshift(0);
  sortedAdapters.push(sortedAdapters[sortedAdapters.length - 1] + 3);

  for (let i = 1; i < sortedAdapters.length; i++) {
    const diff = sortedAdapters[i] - sortedAdapters[i - 1];
    diff === 1 ? oneJoltDiff++ : threeJoltDiff++;
  }

  console.log(oneJoltDiff * threeJoltDiff);
}

function countAllCombinations(adapters) {
  const sets = [];
  let currentSet = 0;
  const sortedAdapters = adapters.sort((a, b) => a - b);
  sortedAdapters.unshift(0);
  sortedAdapters.push(sortedAdapters[sortedAdapters.length - 1] + 3);
  for (let i = 1; i < sortedAdapters.length - 1; i++) {
    if (sortedAdapters[i - 1] + 1 === sortedAdapters[i] && sortedAdapters[i] === sortedAdapters[i + 1] - 1) {
      currentSet++;
    } else {
      if (currentSet !== 0) {
        sets.push(currentSet);
        currentSet = 0;
      }
    }
  }
  const combinations = sets.map(num => (
    num === 1 ? 2 : num === 2 ? 4 : 7
  )) //sets are only 1,2,3 and their possible combinations are respectively 2,4,7


  console.log(combinations.reduce((a,b) => a * b))
}

//Day 11
const day11_seats = fs.readFileSync('./2020/day11.txt', 'utf-8').split('\n').map(row => row.split(''));

function countOccupiedSeats(seats) {
  let currentSeats = [...seats];
  const newSeats = seats.map(row => row.map(s => s === 'L' ? '#' : s));
  while (JSON.stringify(currentSeats) !== JSON.stringify(newSeats)) {
    currentSeats = newSeats.map(r => [...r]);

    for (let i = 0; i < seats.length; i++) {
      for (let j = 0; j < seats[0].length; j++) {
        if (currentSeats[i][j] !== '.') {
          let occupiedNeighbours = 0;
          if (currentSeats[i-1] && currentSeats[i-1][j-1] === '#') occupiedNeighbours++;
          if (currentSeats[i-1] && currentSeats[i-1][j] === '#') occupiedNeighbours++;
          if (currentSeats[i-1] && currentSeats[i-1][j+1] === '#') occupiedNeighbours++;
          if (currentSeats[i][j-1] === '#') occupiedNeighbours++;
          if (currentSeats[i][j+1] === '#') occupiedNeighbours++;
          if (currentSeats[i+1] && currentSeats[i+1][j-1] === '#') occupiedNeighbours++;
          if (currentSeats[i+1] && currentSeats[i+1][j] === '#') occupiedNeighbours++;
          if (currentSeats[i+1] && currentSeats[i+1][j+1] === '#') occupiedNeighbours++;

          if (currentSeats[i][j] === '#' && occupiedNeighbours >= 4) newSeats[i][j] = 'L';
          else if (currentSeats[i][j] === 'L' && occupiedNeighbours === 0) newSeats[i][j] = '#';
        }
      }
    }
  }
  let totalOccupied = 0;
  for (let i = 0; i < seats.length; i++) {
    for (let j = 0; j < seats[0].length; j++) {
      if (currentSeats[i][j] === '#') totalOccupied++;
    }
  }
  console.log(totalOccupied);
}

function countOccupiedSeatsWithNewRules(seats) {
  let currentSeats = [...seats];
  const newSeats = seats.map(row => row.map(s => s === 'L' ? '#' : s));
  while (JSON.stringify(currentSeats) !== JSON.stringify(newSeats)) {
    currentSeats = newSeats.map(r => [...r]);

    for (let i = 0; i < seats.length; i++) {
      for (let j = 0; j < seats[0].length; j++) {
        if (currentSeats[i][j] !== '.') {
          let occupiedNeighbours = 0;
          let lookAt = 1;
          while (currentSeats[i-lookAt] && currentSeats[i-lookAt][j-lookAt] === '.') lookAt++;
          if (currentSeats[i-lookAt] && currentSeats[i-lookAt][j-lookAt] === '#') occupiedNeighbours++;

          lookAt = 1;
          while (currentSeats[i-lookAt] && currentSeats[i-lookAt][j] === '.') lookAt++;
          if (currentSeats[i-lookAt] && currentSeats[i-lookAt][j] === '#') occupiedNeighbours++;

          lookAt = 1;
          while (currentSeats[i-lookAt] && currentSeats[i-lookAt][j+lookAt] === '.') lookAt++;
          if (currentSeats[i-lookAt] && currentSeats[i-lookAt][j+lookAt] === '#') occupiedNeighbours++;

          lookAt = 1;
          while (currentSeats[i][j-lookAt] && currentSeats[i][j-lookAt] === '.') lookAt++;
          if (currentSeats[i][j-lookAt] === '#') occupiedNeighbours++;

          lookAt = 1;
          while (currentSeats[i][j+lookAt] && currentSeats[i][j+lookAt] === '.') lookAt++;
          if (currentSeats[i][j+lookAt] === '#') occupiedNeighbours++;

          lookAt = 1;
          while (currentSeats[i+lookAt] && currentSeats[i+lookAt][j-lookAt] === '.') lookAt++;
          if (currentSeats[i+lookAt] && currentSeats[i+lookAt][j-lookAt] === '#') occupiedNeighbours++;

          lookAt = 1;
          while (currentSeats[i+lookAt] && currentSeats[i+lookAt][j] === '.') lookAt++;
          if (currentSeats[i+lookAt] && currentSeats[i+lookAt][j] === '#') occupiedNeighbours++;

          lookAt = 1;
          while (currentSeats[i+lookAt] && currentSeats[i+lookAt][j+lookAt] === '.') lookAt++;
          if (currentSeats[i+lookAt] && currentSeats[i+lookAt][j+lookAt] === '#') occupiedNeighbours++;

          if (currentSeats[i][j] === '#' && occupiedNeighbours >= 5) newSeats[i][j] = 'L';
          else if (currentSeats[i][j] === 'L' && occupiedNeighbours === 0) newSeats[i][j] = '#';
        }
      }
    }
  }
  let totalOccupied = 0;
  for (let i = 0; i < seats.length; i++) {
    for (let j = 0; j < seats[0].length; j++) {
      if (currentSeats[i][j] === '#') totalOccupied++;
    }
  }
  console.log(totalOccupied);
}

//Day 12
const day12_navs = fs.readFileSync('./2020/day12.txt', 'utf-8').split('\n');

function travelWithShip(navs) {
  const dirs = ["N", "E", "S", "W", "N", "E", "S"];
  let currentDir = "E";
  const currentPosition = [0, 0];
  navs.forEach(nav => {
    const dir = nav.substring(0, 1);
    const value = Number(nav.substring(1));
    if (dir === "R") {
      currentDir = dirs[dirs.indexOf(currentDir) + (value / 90)];
    } else if (dir === "L") {
      currentDir = dirs[dirs.lastIndexOf(currentDir) - (value / 90)];
    } else if (dir === "F") {
      if (currentDir === "N") {
        currentPosition[1] -= value;
      } else if (currentDir === "E") {
        currentPosition[0] += value;
      } else if (currentDir === "S") {
        currentPosition[1] += value;
      } else {
        currentPosition[0] -= value;
      }
    } else if (dir === "N") {
      currentPosition[1] -= value;
    } else if (dir === "E") {
      currentPosition[0] += value;
    } else if (dir === "S") {
      currentPosition[1] += value;
    } else if (dir === "W") {
      currentPosition[0] -= value;
    }
  });

  console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
}

function travelWithShipUsingWayPoint(navs) {
  let currentWayPoint = [10, -1];
  const currentPosition = [0, 0];
  navs.forEach(nav => {
    const dir = nav.substring(0, 1);
    const value = Number(nav.substring(1));

    if (dir === "R") {
      if (value === 90) {
        const temp = currentWayPoint[0];
        currentWayPoint[0] = currentWayPoint[1] * -1;
        currentWayPoint[1] = temp;
      } else if (value === 180) {
        currentWayPoint[0] = currentWayPoint[0] * -1
        currentWayPoint[1] = currentWayPoint[1] * -1
      } else {
        const temp = currentWayPoint[0];
        currentWayPoint[0] = currentWayPoint[1];
        currentWayPoint[1] = temp * -1;
      }
    } else if (dir === "L") {
      if (value === 90) {
        const temp = currentWayPoint[0];
        currentWayPoint[0] = currentWayPoint[1];
        currentWayPoint[1] = temp * -1;
      } else if (value === 180) {
        currentWayPoint[0] = currentWayPoint[0] * -1
        currentWayPoint[1] = currentWayPoint[1] * -1
      } else {
        const temp = currentWayPoint[0];
        currentWayPoint[0] = currentWayPoint[1] * -1;
        currentWayPoint[1] = temp;
      }
    } else if (dir === "F") {
      currentPosition[0] += value * currentWayPoint[0];
      currentPosition[1] += value * currentWayPoint[1];
    } else if (dir === "N") {
      currentWayPoint[1] -= value;
    } else if (dir === "E") {
      currentWayPoint[0] += value;
    } else if (dir === "S") {
      currentWayPoint[1] += value;
    } else if (dir === "W") {
      currentWayPoint[0] -= value;
    }
  });

  console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
}

//Day 13
let [day13_timestamp, day13_buses] = fs.readFileSync('./2020/day13.txt', 'utf-8').split('\n');
day13_timestamp = Number(day13_timestamp);
day13_buses = day13_buses.split(',');

function findEarliestBus(timestamp, buses) {
  const arriveIn = [];
  buses.forEach(bus => {
    if (bus === 'x') return;
    arriveIn.push({id: Number(bus), arrive: Number(bus) - (timestamp % Number(bus))});
  })
  const earliestBus = arriveIn.find(bus => bus.arrive === Math.min(...arriveIn.map(b => b.arrive)));
  console.log(earliestBus.id * earliestBus.arrive)
}

function findTimestampForBusContest(buses) {
  //using Chinese remainder theorem: https://brilliant.org/wiki/chinese-remainder-theorem/
  const busRequirements = buses.map((bus, id) => {
    if (bus !== 'x') return {
      mod: Number(bus),
      rest: Number(bus) - (id % Number(bus))
    }
  }).filter(b => b !== undefined).map(b => ({
    ...b,
    rest: b.mod === b.rest ? 0 : b.rest
  })).sort((a, b) => b.mod - a.mod);

  let currentFormula = busRequirements.shift();

  while (busRequirements.length > 0) {
    const toCompare = busRequirements.shift();
    let x;
    for (let i = 0; i < toCompare.mod; i++) {
      if ((currentFormula.mod * i + currentFormula.rest) % toCompare.mod === toCompare.rest) {
        x = i;
        break;
      }
    }
    currentFormula = {
      mod: currentFormula.mod * toCompare.mod,
      rest: currentFormula.mod * x + currentFormula.rest
    }
  }

  console.log(currentFormula.rest)
}

//Day 14
const day14_program = fs.readFileSync('./2020/day14.txt', 'utf-8').split('\n');

function checkFerryMemory(program) {
  const NUMS_REGEX = /[0-9]+/g;
  let mask;
  const memory = {};
  program.forEach(command => {
    if (command.includes('mask')) {
      mask = command.substring(7).split('');
    } else {
      const values = command.match(NUMS_REGEX);
      const num = Number(values[1]).toString(2).padStart(36, '0');
      let valueToWrite = [];
      for (let i = 0; i < 36; i++) {
        if (mask[i] === 'X') {
          valueToWrite.push(num[i]);
        } else {
          valueToWrite.push(mask[i]);
        }
      }
      memory[values[0]] = parseInt(valueToWrite.join(''), 2)
    }
  });
  console.log(Object.values(memory).reduce((a, b) => a + b));
}

function checkFerryMemoryWithChipv2(program) {
  const NUMS_REGEX = /[0-9]+/g;
  let mask;
  const memory = {};
  program.forEach(command => {
    if (command.includes('mask')) {
      mask = command.substring(7).split('');
    } else {
      const values = command.match(NUMS_REGEX);
      const num = Number(values[0]).toString(2).padStart(36, '0');
      let valueToWrite = [];
      for (let i = 0; i < 36; i++) {
        if (mask[i] === '0') {
          valueToWrite.push(num[i]);
        } else if (mask[i] === '1') {
          valueToWrite.push('1');
        } else {
          valueToWrite.push('X');
        }
      }
      const combinations = 2 ** valueToWrite.filter(n => n === 'X').length;
      const memories = [];
      for (let i = 0; i < combinations; i++) {
        let bitsToReplace = (combinations - 1).toString(2).length;
        let valueToReplace = i.toString(2).padStart(bitsToReplace, '0').split('');
        const newVal = valueToWrite.map(v => v === 'X' ? valueToReplace.shift() : v);
        memories.push(parseInt(newVal.join(''), 2));
      }

      memories.forEach(mem => {
        memory[mem] = Number(values[1]);
      })
    }
  });
  console.log(Object.values(memory).reduce((a, b) => a + b));
}

//Day 15
const day15_numbers = fs.readFileSync('./2020/day15.txt', 'utf-8').split(',');

function playMemoryGame(starting_nums, end_turn) {
  const rememberedNumbers = {};
  starting_nums.forEach((num, id) => {
    rememberedNumbers[num] = [id + 1];
  })
  let lastNum = 0;

  for (let i = starting_nums.length + 1; i < end_turn; i++) {
    if (!rememberedNumbers[lastNum]) {
      rememberedNumbers[lastNum] = [i];
      lastNum = 0;
    } else if (rememberedNumbers[lastNum].length === 1) {
      rememberedNumbers[lastNum].push(i);
      lastNum = rememberedNumbers[lastNum][1] - rememberedNumbers[lastNum][0]
    } else {
      rememberedNumbers[lastNum] = [rememberedNumbers[lastNum][1], i];
      lastNum = rememberedNumbers[lastNum][1] - rememberedNumbers[lastNum][0]
    }
    if (i % 1000000 === 0) console.log(`Processing... ${Math.trunc((i/end_turn) * 100)}%`);
  }

  console.log(lastNum);
}

//Day 16
let [day16_ticketRules, day16_yourTicket, day16_nearbyTickets] = fs.readFileSync('./2020/day16.txt', 'utf-8').split('\n\n');
day16_ticketRules = day16_ticketRules.split('\n');
day16_yourTicket = day16_yourTicket.split('\n')[1].split(',').map(Number);
day16_nearbyTickets = day16_nearbyTickets.split('\n');
day16_nearbyTickets.shift();
day16_nearbyTickets = day16_nearbyTickets.map(t => t.split(',').map(Number))

function findInvalidTickets(rules, tickets) {
  const NUMS_REGEX = /[0-9]+/g;
  const ticketRules = [];
  rules.forEach(rule => {
    const values = rule.match(NUMS_REGEX).map(Number);
    ticketRules.push((v) => (v >= values[0] && v <= values[1]) || (v >= values[2] && v <= values[3]));
  });
  let errorRate = 0;
  const validTickets = [];

  tickets.forEach(ticket => {
    let invalidTicket = false;
    ticket.forEach(num => {
      if (!ticketRules.some(r => r(num) === true)) {
        errorRate += num;
        invalidTicket = true;
      }
    })
    if (!invalidTicket) {
      validTickets.push(ticket);
    }
  });

  console.log(errorRate);
  return validTickets;
}

function getDepartureInfo(rules, tickets, yourTicket) {
  const NUMS_REGEX = /[0-9]+/g;
  const ticketRules = [];
  rules.forEach(rule => {
    const values = rule.match(NUMS_REGEX).map(Number);
    ticketRules.push((v) => (v >= values[0] && v <= values[1]) || (v >= values[2] && v <= values[3]));
  });
  const rulesAsText = rules.map(r => r.substring(0, r.indexOf(':')));

  let yourTicketInfo = {};
  while (Object.values(yourTicketInfo).length < rules.length) {
    // const matching = Array(tickets[0].length).fill([0, 0]);
    // this above didn't work for some reason, had to hardcode it
    const matching = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
    for (let i = 0; i < tickets[0].length; i++) {
      for (let r = 0; r < ticketRules.length; r++) {
        if (tickets.every(t => ticketRules[r](t[i]))) {
          matching[i][0] += 1;
          matching[i][1] = r;
        }
      }
    }
    matching.forEach((matches, id) => {
      if (matches[0] === 1) {
        yourTicketInfo[rulesAsText[matches[1]]] = yourTicket[id];
        ticketRules.splice(matches[1], 1);
        rulesAsText.splice(matches[1], 1);
      }
    });
  }

  console.log(yourTicketInfo);
  const departureData = Object.entries(yourTicketInfo).filter(info => info[0].includes('departure')).map(info => info[1]);
  console.log(departureData.reduce((a, b) => a * b));
}

//Day 17
const day17_grid = fs.readFileSync('./2020/day17.txt', 'utf-8').split('\n').map(row => row.split(''));

function countCubesIn3DPocketDimension(grid) {
  let grid3D = Array(13).fill('.').map(() => Array(grid.length + 14).fill('.').map(() => Array(grid[0].length + 14).fill('.')));
  //Insert 2D grid in the middle of 3D grid
  for (let i = 7; i < grid.length + 7; i++) {
    for (let j = 7; j < grid[0].length + 7; j++) {
      grid3D[6][i][j] = grid[i-7][j-7];
    }
  }
  const grid3DTemp = JSON.parse(JSON.stringify(grid3D));

  for (let cycle = 1; cycle <= 6; cycle++) {
    for (let z = 1; z < grid3D.length - 1; z++) {
      for (let i = 1; i < grid3D[0].length - 1; i++) {
        for (let j = 1; j < grid3D[0][0].length - 1; j++) {
          let activeCount = 0;
          //Checking all 26 neighbours :/ Probably there's a better way to do it but I have no idea how
          if (grid3D[z-1][i-1][j-1] === '#') activeCount++;
          if (grid3D[z-1][i-1][j] === '#') activeCount++;
          if (grid3D[z-1][i-1][j+1] === '#') activeCount++;
          if (grid3D[z-1][i][j-1] === '#') activeCount++;
          if (grid3D[z-1][i][j] === '#') activeCount++;
          if (grid3D[z-1][i][j+1] === '#') activeCount++;
          if (grid3D[z-1][i+1][j-1] === '#') activeCount++;
          if (grid3D[z-1][i+1][j] === '#') activeCount++;
          if (grid3D[z-1][i+1][j+1] === '#') activeCount++;
          if (grid3D[z][i-1][j-1] === '#') activeCount++;
          if (grid3D[z][i-1][j] === '#') activeCount++;
          if (grid3D[z][i-1][j+1] === '#') activeCount++;
          if (grid3D[z][i][j-1] === '#') activeCount++;
          if (grid3D[z][i][j+1] === '#') activeCount++;
          if (grid3D[z][i+1][j-1] === '#') activeCount++;
          if (grid3D[z][i+1][j] === '#') activeCount++;
          if (grid3D[z][i+1][j+1] === '#') activeCount++;
          if (grid3D[z+1][i-1][j-1] === '#') activeCount++;
          if (grid3D[z+1][i-1][j] === '#') activeCount++;
          if (grid3D[z+1][i-1][j+1] === '#') activeCount++;
          if (grid3D[z+1][i][j-1] === '#') activeCount++;
          if (grid3D[z+1][i][j] === '#') activeCount++;
          if (grid3D[z+1][i][j+1] === '#') activeCount++;
          if (grid3D[z+1][i+1][j-1] === '#') activeCount++;
          if (grid3D[z+1][i+1][j] === '#') activeCount++;
          if (grid3D[z+1][i+1][j+1] === '#') activeCount++;

          if ((grid3D[z][i][j] === '#' && activeCount === 2) || activeCount === 3) {
            grid3DTemp[z][i][j] = '#';
          } else {
            grid3DTemp[z][i][j] = '.';
          }
        }
      }
    }
    grid3D = JSON.parse(JSON.stringify(grid3DTemp));
  }

  console.log(JSON.stringify(grid3D).split('').filter(x => x === '#').length);
}

function countCubesIn4DPocketDimension(grid) {
  let grid4D = Array(15).fill('.').map(() =>Array(17).fill('.').map(() => Array(grid.length + 14).fill('.').map(() => Array(grid[0].length + 14).fill('.'))));
  //Insert 2D grid in the middle of 4D grid
  for (let i = 7; i < grid.length + 7; i++) {
    for (let j = 7; j < grid[0].length + 7; j++) {
      grid4D[7][8][i][j] = grid[i-7][j-7];
    }
  }
  const grid4DTemp = JSON.parse(JSON.stringify(grid4D));

  for (let cycle = 1; cycle <= 6; cycle++) {
    for (let w = 1; w < grid4D.length - 1; w++) {
      for (let z = 1; z < grid4D[0].length - 1; z++) {
        for (let i = 1; i < grid4D[0][0].length - 1; i++) {
          for (let j = 1; j < grid4D[0][0][0].length - 1; j++) {
            let activeCount = 0;
            //Now with 80 neighbours ;_;
            if (grid4D[w-1][z-1][i-1][j-1] === '#') activeCount++;
            if (grid4D[w-1][z-1][i-1][j] === '#') activeCount++;
            if (grid4D[w-1][z-1][i-1][j+1] === '#') activeCount++;
            if (grid4D[w-1][z-1][i][j-1] === '#') activeCount++;
            if (grid4D[w-1][z-1][i][j] === '#') activeCount++;
            if (grid4D[w-1][z-1][i][j+1] === '#') activeCount++;
            if (grid4D[w-1][z-1][i+1][j-1] === '#') activeCount++;
            if (grid4D[w-1][z-1][i+1][j] === '#') activeCount++;
            if (grid4D[w-1][z-1][i+1][j+1] === '#') activeCount++;
            if (grid4D[w-1][z][i-1][j-1] === '#') activeCount++;
            if (grid4D[w-1][z][i-1][j] === '#') activeCount++;
            if (grid4D[w-1][z][i-1][j+1] === '#') activeCount++;
            if (grid4D[w-1][z][i][j-1] === '#') activeCount++;
            if (grid4D[w-1][z][i][j] === '#') activeCount++;
            if (grid4D[w-1][z][i][j+1] === '#') activeCount++;
            if (grid4D[w-1][z][i+1][j-1] === '#') activeCount++;
            if (grid4D[w-1][z][i+1][j] === '#') activeCount++;
            if (grid4D[w-1][z][i+1][j+1] === '#') activeCount++;
            if (grid4D[w-1][z+1][i-1][j-1] === '#') activeCount++;
            if (grid4D[w-1][z+1][i-1][j] === '#') activeCount++;
            if (grid4D[w-1][z+1][i-1][j+1] === '#') activeCount++;
            if (grid4D[w-1][z+1][i][j-1] === '#') activeCount++;
            if (grid4D[w-1][z+1][i][j] === '#') activeCount++;
            if (grid4D[w-1][z+1][i][j+1] === '#') activeCount++;
            if (grid4D[w-1][z+1][i+1][j-1] === '#') activeCount++;
            if (grid4D[w-1][z+1][i+1][j] === '#') activeCount++;
            if (grid4D[w-1][z+1][i+1][j+1] === '#') activeCount++;

            if (grid4D[w][z-1][i-1][j-1] === '#') activeCount++;
            if (grid4D[w][z-1][i-1][j] === '#') activeCount++;
            if (grid4D[w][z-1][i-1][j+1] === '#') activeCount++;
            if (grid4D[w][z-1][i][j-1] === '#') activeCount++;
            if (grid4D[w][z-1][i][j] === '#') activeCount++;
            if (grid4D[w][z-1][i][j+1] === '#') activeCount++;
            if (grid4D[w][z-1][i+1][j-1] === '#') activeCount++;
            if (grid4D[w][z-1][i+1][j] === '#') activeCount++;
            if (grid4D[w][z-1][i+1][j+1] === '#') activeCount++;
            if (grid4D[w][z][i-1][j-1] === '#') activeCount++;
            if (grid4D[w][z][i-1][j] === '#') activeCount++;
            if (grid4D[w][z][i-1][j+1] === '#') activeCount++;
            if (grid4D[w][z][i][j-1] === '#') activeCount++;
            if (grid4D[w][z][i][j+1] === '#') activeCount++;
            if (grid4D[w][z][i+1][j-1] === '#') activeCount++;
            if (grid4D[w][z][i+1][j] === '#') activeCount++;
            if (grid4D[w][z][i+1][j+1] === '#') activeCount++;
            if (grid4D[w][z+1][i-1][j-1] === '#') activeCount++;
            if (grid4D[w][z+1][i-1][j] === '#') activeCount++;
            if (grid4D[w][z+1][i-1][j+1] === '#') activeCount++;
            if (grid4D[w][z+1][i][j-1] === '#') activeCount++;
            if (grid4D[w][z+1][i][j] === '#') activeCount++;
            if (grid4D[w][z+1][i][j+1] === '#') activeCount++;
            if (grid4D[w][z+1][i+1][j-1] === '#') activeCount++;
            if (grid4D[w][z+1][i+1][j] === '#') activeCount++;
            if (grid4D[w][z+1][i+1][j+1] === '#') activeCount++;

            if (grid4D[w+1][z-1][i-1][j-1] === '#') activeCount++;
            if (grid4D[w+1][z-1][i-1][j] === '#') activeCount++;
            if (grid4D[w+1][z-1][i-1][j+1] === '#') activeCount++;
            if (grid4D[w+1][z-1][i][j-1] === '#') activeCount++;
            if (grid4D[w+1][z-1][i][j] === '#') activeCount++;
            if (grid4D[w+1][z-1][i][j+1] === '#') activeCount++;
            if (grid4D[w+1][z-1][i+1][j-1] === '#') activeCount++;
            if (grid4D[w+1][z-1][i+1][j] === '#') activeCount++;
            if (grid4D[w+1][z-1][i+1][j+1] === '#') activeCount++;
            if (grid4D[w+1][z][i-1][j-1] === '#') activeCount++;
            if (grid4D[w+1][z][i-1][j] === '#') activeCount++;
            if (grid4D[w+1][z][i-1][j+1] === '#') activeCount++;
            if (grid4D[w+1][z][i][j-1] === '#') activeCount++;
            if (grid4D[w+1][z][i][j] === '#') activeCount++;
            if (grid4D[w+1][z][i][j+1] === '#') activeCount++;
            if (grid4D[w+1][z][i+1][j-1] === '#') activeCount++;
            if (grid4D[w+1][z][i+1][j] === '#') activeCount++;
            if (grid4D[w+1][z][i+1][j+1] === '#') activeCount++;
            if (grid4D[w+1][z+1][i-1][j-1] === '#') activeCount++;
            if (grid4D[w+1][z+1][i-1][j] === '#') activeCount++;
            if (grid4D[w+1][z+1][i-1][j+1] === '#') activeCount++;
            if (grid4D[w+1][z+1][i][j-1] === '#') activeCount++;
            if (grid4D[w+1][z+1][i][j] === '#') activeCount++;
            if (grid4D[w+1][z+1][i][j+1] === '#') activeCount++;
            if (grid4D[w+1][z+1][i+1][j-1] === '#') activeCount++;
            if (grid4D[w+1][z+1][i+1][j] === '#') activeCount++;
            if (grid4D[w+1][z+1][i+1][j+1] === '#') activeCount++;

            if ((grid4D[w][z][i][j] === '#' && activeCount === 2) || activeCount === 3) {
              grid4DTemp[w][z][i][j] = '#';
            } else {
              grid4DTemp[w][z][i][j] = '.';
            }
          }
        }
      }
    }
    grid4D = JSON.parse(JSON.stringify(grid4DTemp));
  }

  console.log(JSON.stringify(grid4D).split('').filter(x => x === '#').length);
}

//Day 18
const day18_expressions = fs.readFileSync('./2020/day18.txt', 'utf-8').split('\n');

function evaluateExpressions(expressions) {
  const NUMS_REGEX = /[0-9]/g;
  const SIGNS_REGEX = /\*|\+|\(|\)/g;
  let sum = 0;
  expressions.forEach(ex => {
    let nums = ex.match(NUMS_REGEX).map(Number);
    let signs = ex.match(SIGNS_REGEX);
    while (signs.length > 0 || nums.length > 1) {
      if ((signs[0] === '+' || signs[0] === '*') && (!signs[1] || signs[1] !== '(')) {
        const res = eval(`${nums[0]} ${signs[0]} ${nums[1]}`);
        nums.shift();
        nums[0] = res;
        signs.shift();
      } else if (signs[0] === '(' || signs[1] === '(') {
        let openIndex, closeIndex;
        for (let i = 0; i < signs.length; i++) {
          if (signs[i] === '(') openIndex = i;
          if (signs[i] === ')') {
            closeIndex = i;
            break;
          }
        }
        let numId = 0
        for (let i = 0; i <= openIndex; i++) {
          if (signs[i] === '+' || signs[i] === '*') numId++;
        }
        const res = eval(`${nums[numId]} ${signs[openIndex + 1]} ${nums[numId+1]}`);
        nums.splice(numId, 2, res) //replace two nums with result
        if (closeIndex - openIndex === 2) {
          signs.splice(openIndex, 3);
        } else {
          signs.splice(openIndex + 1, 1);
        }
      }
    }
    sum += nums[0];
  });
  console.log(sum);
}

function evaluateAdvancedExpressions(expressions) {
  const NUMS_REGEX = /[0-9]/g;
  const SIGNS_REGEX = /\*|\+|\(|\)/g;
  let sum = 0;
  expressions.forEach(ex => {
    let nums = ex.match(NUMS_REGEX).map(Number);
    let signs = ex.match(SIGNS_REGEX);
    while (signs.length > 0 || nums.length > 2) {
      if ((signs[0] === '*') && (!signs[1] || (signs[1] !== '(' && signs[1] !== '+'))) {
        const res = eval(`${nums[0]} ${signs[0]} ${nums[1]}`);
        nums.shift();
        nums[0] = res;
        signs.shift();
      } else if ((signs[0] === '+') && (!signs[1] || signs[1] !== '(')) {
        const res = eval(`${nums[0]} ${signs[0]} ${nums[1]}`);
        nums.shift();
        nums[0] = res;
        signs.shift();
      } else if ((signs[1] === '+') && (!signs[2] || signs[2] !== '(') && signs[0] !== '(') {
        const res = eval(`${nums[1]} ${signs[1]} ${nums[2]}`);
        nums.splice(1, 2, res);
        signs.splice(1, 1);
      } else if (signs[0] === '(' || signs[1] === '(' || signs[2] === '(') {

        let openIndex, closeIndex;
        for (let i = 0; i < signs.length; i++) {
          if (signs[i] === '(') openIndex = i;
          if (signs[i] === ')') {
            closeIndex = i;
            break;
          }
        }
        const exInsideParenthesis = signs.slice(openIndex, closeIndex + 1);
        let numId = 0
        let signId = openIndex + 1;
        if (exInsideParenthesis.includes('+')) {
          for (let i = 0; i <= signs.length; i++) {
            if (signs[i] === '+' && i > openIndex) {
              signId = i;
              break;
            };
            if (signs[i] === '+' || signs[i] === '*') numId++;
          }
        } else {
          for (let i = 0; i <= openIndex; i++) {
            if (signs[i] === '+' || signs[i] === '*') numId++;
          }
        }
        const res = eval(`${nums[numId]} ${signs[signId]} ${nums[numId+1]}`);
        nums.splice(numId, 2, res);
        if (closeIndex - openIndex === 2) {
          signs.splice(openIndex, 3);
        } else {
          signs.splice(signId, 1);
        }
      }
    }
    sum += nums[0];
  });
  console.log(sum);
}

//Day 19




// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1:');
// findNumberInSumOfTwo(day1_numbers, 2020);
// console.log('Day 1, part 2:');
// findNumberInSumOfThree(day1_numbers, 2020);

// console.log('Day 2, part 1:');
// countValidPasswords(day2_passwords);
// console.log('Day 2, part 2:');
// countValidPasswordsNewPolicy(day2_passwords);

// console.log('Day 3, part 1:');
// countEncounteredTrees(day3_trees_grid, [[3,1]]);
// console.log('Day 3, part 2:');
// countEncounteredTrees(day3_trees_grid, [[1,1], [3,1], [5,1], [7,1], [1,2]]);

// console.log('Day 4, part 1:');
// const validDocs = countValidDocs(day4_documents);
// console.log('Day 4, part 2:');
// makeDocValidation(validDocs);

// console.log('Day 5, part 1 & 2:');
// findSeatID(day5_seats);

// console.log('Day 6, part 1:');
// getAnswersWhereAnyoneSaidYes(day6_answers);
// console.log('Day 6, part 2:');
// getAnswersWhereEveryoneSaidYes(day6_answers);

// console.log('Day 7, part 1:');
// checkBagsInsides(day7_bags)
// console.log('Day 7, part 2:');
// countNeededBags(day7_bags);

// console.log('Day 8, part 1:');
// findInfiniteLoop(day8_instructions, true);
// console.log('Day 8, part 2:');
// fixInfiniteLoop(day8_instructions);

// console.log('Day 9, part 1:');
// const weakSpot = findWeakSpot(day9_numbers);
// console.log('Day 9, part 2:');
// getEncrtyptionWeakness(day9_numbers, weakSpot);

// console.log('Day 10, part 1:');
// countJoltDifferences(day10_adapters)
// console.log('Day 10, part 2:');
// countAllCombinations(day10_adapters)

// console.log('Day 11, part 1:');
// countOccupiedSeats(day11_seats);
// console.log('Day 11, part 2:');
// countOccupiedSeatsWithNewRules(day11_seats);

// console.log('Day 12, part 1:');
// travelWithShip(day12_navs);
// console.log('Day 12, part 2:');
// travelWithShipUsingWayPoint(day12_navs)

// console.log('Day 13, part 1:');
// findEarliestBus(day13_timestamp, day13_buses);
// console.log('Day 13, part 2:');
// findTimestampForBusContest(day13_buses);

// console.log('Day 14, part 1:');
// checkFerryMemory(day14_program);
// console.log('Day 14, part 2:');
// checkFerryMemoryWithChipv2(day14_program);

// console.log('Day 15, part 1:');
// playMemoryGame(day15_numbers, 2020);
// console.log('Day 15, part 2 (this will take a while):');
// playMemoryGame(day15_numbers, 30000000);

// console.log('Day 16, part 1:');
// const validTickets = findInvalidTickets(day16_ticketRules, day16_nearbyTickets);
// console.log('Day 16, part 2:');
// getDepartureInfo(day16_ticketRules, validTickets, day16_yourTicket);

// console.log('Day 17, part 1:');
// countCubesIn3DPocketDimension(day17_grid);
// console.log('Day 17, part 2:');
// countCubesIn4DPocketDimension(day17_grid);

// console.log('Day 18, part 1:');
// evaluateExpressions(day18_expressions);
// console.log('Day 18, part 2:');
// evaluateAdvancedExpressions(day18_expressions);
