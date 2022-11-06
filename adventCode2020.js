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
let [day19_rules, day19_messages] = fs.readFileSync('./2020/day19.txt', 'utf-8').split('\n\n');
day19_rules = day19_rules.split('\n');
day19_messages = day19_messages.split('\n');

function decodeRules(rules, toDecode) {
  const NUMS_REGEX = /[0-9]+/g;
  const allRules = {}
  rules.forEach(r => {
    const ruleID = r.match(NUMS_REGEX)[0];
    const rule = r.substring(r.indexOf(':') + 2);
    allRules[ruleID] = rule.replaceAll('"', '').split(' | ');
  })

  let knownRules = [];

  assignKnownRules = () => {
    Object.entries(allRules).forEach(([id, r]) => {
      if (r.every(part => {
        const partNums = part.match(NUMS_REGEX)
        return !partNums
      })) {
        knownRules.push(id.toString());
      }
    })
  }
  assignKnownRules();

  while (toDecode.every(rule => !knownRules.includes(rule))) {
    Object.values(allRules).forEach((r, id) => {
      if (knownRules.includes(id.toString())) return;

      r.forEach((part, partId) => {
        if (!part.match(NUMS_REGEX)) return;

        let matchingRule;
        consistingRules = part.split(' ');
        consistingRules.forEach(cr => {
          if (knownRules.includes(cr)) matchingRule = cr;
        })
        if (!matchingRule) return;

        const toReplace = allRules[matchingRule];
        const updatedRule = toReplace.map(replaceRule => {
          // Replace only the first occurance of the rule to always get all possible combinations
          const temp = consistingRules.map((cr, crId) => cr === matchingRule && consistingRules.indexOf(matchingRule) === crId ? replaceRule : cr);
          return temp.join(' ');
        });

        r.splice(partId, 1, ...updatedRule);
      })
    });

    knownRules = [];
    assignKnownRules();
  }

  return allRules;
}

function countValidMessages(rules, messages) {
  const allRules = decodeRules(rules, ['0']);

  const rule0 = allRules['0'].map(rule => rule.replaceAll(' ', ''));
  let matchingMessages = 0;
  messages.forEach(m => {
    if (rule0.includes(m)) matchingMessages++;
  })
  console.log(matchingMessages);
}

function countValidMessagesWithLoopedRules(rules, messages) {
  /*
  In part 2, two rules were changed to this:
    8: 42 | 42 8
    11: 42 31 | 42 11 31
  Since rule 0 = 8 11, it means that to find valid messages, I don't need to get rule 0, but rules 42 & 31
  */
  const allRules = decodeRules(rules, ['31', '42']);

  const rule42 = allRules['42'].map(rule => rule.replaceAll(' ', ''));
  const rule31 = allRules['31'].map(rule => rule.replaceAll(' ', ''));

  let matchingMessages = 0;
  const isWordValid = (word) => {
    let remainingLetters = word;
    let valid = true;
    let is31Triggered = false; //Once 31 triggers, 42 will become invalid
    let found42s = 0;
    let found31s = 0; // there must be at least two 42s and one 31, cause the smallest "8 11" produces "42 42 31"
    while (valid && remainingLetters.length > 0) {
      if (!is31Triggered && rule31.some(r => remainingLetters.startsWith(r))) {
        is31Triggered = true;
      }
      if (is31Triggered) {
        if (rule31.some(r => remainingLetters.startsWith(r))) {
          remainingLetters = remainingLetters.substring(rule31[0].length);
          found31s++;
        } else {
          valid = false;
        }
      } else {
        if (rule42.some(r => remainingLetters.startsWith(r))) {
          remainingLetters = remainingLetters.substring(rule42[0].length);
          found42s++;
        } else {
          valid = false;
        }
      }
    }
    if (found42s < 2 || found31s < 1 || found42s <= found31s) {
      valid = false;
    }
    return valid;
  }

  messages.forEach(m => {
    if (isWordValid(m)) {
      matchingMessages++;
    }
  })

  console.log(matchingMessages);
}

// Day 20
const day20_tiles = fs.readFileSync('./2020/day20.txt', 'utf-8').split('\n\n');

function getPossibleEdgesOfTile(tile) {
  // First, prepare all possible states for given tile. Each tile can be flipped/rotated in 8 different ways:
  // original
  const baseTile = tile.split('\n').map(row => row.split(''));
  let tileId = Number(baseTile.shift().join('').match(/[0-9]+/g));
  // flipX
  const flippedTile = baseTile.map(row => [...row].reverse());
  // rotate90Right of org & flipped
  const tile90 = [];
  const flippedTile90 = [];
  for (let y = 0; y < baseTile.length; y++) {
    const row = [];
    const flippedRow = []
    for (let x = 0; x < baseTile[0].length; x++) {
      row.push(baseTile[baseTile.length - x - 1][y]);
      flippedRow.push(flippedTile[baseTile.length - x - 1][y]);
    }
    tile90.push(row);
    flippedTile90.push(flippedRow);
  }
  // rotate180 of org & flipped
  const tile180 = [...flippedTile].reverse();
  const flippedTile180 = [...baseTile].reverse();
  // rotate270Right of org & flipped
  const tile270 = [];
  const flippedTile270 = [];
  for (let y = 0; y < baseTile.length; y++) {
    const row = [];
    const flippedRow = []
    for (let x = 0; x < baseTile[0].length; x++) {
      row.push(baseTile[x][baseTile.length - y - 1]);
      flippedRow.push(flippedTile[x][baseTile.length - y - 1]);
    }
    tile270.push(row);
    flippedTile270.push(flippedRow);
  }

  const tileStates = [baseTile, tile90, tile180, tile270, flippedTile, flippedTile90, flippedTile180, flippedTile270];

  const possibleEdges = [];
  tileStates.forEach(t => {
    const top = t[0];
    const bottom = t[t.length - 1];
    const left = [];
    const right = [];

    for (let y = 0; y < t.length; y++) {
      left.push(t[y][0]);
      right.push(t[y][t[0].length - 1]);
    }
    possibleEdges.push([top, right, bottom, left]);
  })
  return { tileId, tileStates, possibleEdges }
}

function findCornerTilesAndMatches(tiles) {
  const tilesWithEdges = tiles.map(t => getPossibleEdgesOfTile(t));

  const cornerTiles = [];
  // Corner tiles will be the only ones that match only with 2 edges
  tilesWithEdges.forEach(tile => {
    let matchingTiles;
    tile.possibleEdges.forEach((edges) => {
      if (matchingTiles) return;
      const currentMatchingTiles = [];

      tilesWithEdges.forEach(tileToMatch => {
        if (tileToMatch.tileId === tile.tileId) return;

        const bottoms = tileToMatch.possibleEdges.map(e => e[2].join(''));
        if (bottoms.includes(edges[0].join(''))) {
          currentMatchingTiles.push(tileToMatch.tileId)
          return;
        }
        const lefts = tileToMatch.possibleEdges.map(e => e[3].join(''));
        if (lefts.includes(edges[1].join(''))) {
          currentMatchingTiles.push(tileToMatch.tileId)
          return;
        }
        const tops = tileToMatch.possibleEdges.map(e => e[0].join(''));
        if (tops.includes(edges[2].join(''))) {
          currentMatchingTiles.push(tileToMatch.tileId)
          return;
        }
        const rights = tileToMatch.possibleEdges.map(e => e[1].join(''));
        if (rights.includes(edges[3].join(''))) {
          currentMatchingTiles.push(tileToMatch.tileId)
          return;
        }
      });

      if (currentMatchingTiles.length === 2) { // corner
        cornerTiles.push(tile.tileId);
      }
      if (currentMatchingTiles.length > 1) {
        matchingTiles = currentMatchingTiles;
      }
    });
    tile.matchingTiles = matchingTiles;
  });

  console.log(cornerTiles.reduce((a, b) => a * b, 1));

  return { corners: cornerTiles, tiles: tilesWithEdges };
}

function alignTilesAndFindMonsters(tilesData) {
  const { corners, tiles } = tilesData;

  const mapSize = Math.sqrt(tiles.length);
  const possibleMaps = [];

  const dfs = (x, y, currentMap, tilesUsedSoFar) => {
    const tilesLeft = tiles.map(t => t.tileId).filter(t => !tilesUsedSoFar.includes(t));
    const possibleTiles = new Set();
    if (x > 0 && y === 0) {
      const tileOnLeft = tiles.find(t => t.tileId === currentMap[y][x-1]);
      tileOnLeft.matchingTiles.forEach(mt => {
        if (tilesLeft.includes(mt)) possibleTiles.add(mt);
      });
    } else if (x === 0 && y > 0) {
      const tileOnTop = tiles.find(t => t.tileId === currentMap[y-1][x]);
      tileOnTop.matchingTiles.forEach(mt => {
        if (tilesLeft.includes(mt)) possibleTiles.add(mt);
      });
    } else {
      const tileOnLeft = tiles.find(t => t.tileId === currentMap[y][x-1]);
      const tileOnTop = tiles.find(t => t.tileId === currentMap[y-1][x]);
      const commonTiles = tileOnLeft.matchingTiles.filter(t => tileOnTop.matchingTiles.includes(t));
      commonTiles.forEach(mt => {
        if (tilesLeft.includes(mt)) possibleTiles.add(mt);
      });
    }

    if (x === mapSize - 1 && y === mapSize - 1) {
      if (possibleTiles.size !== 1) {
        console.log(possibleTiles.size)
        return;
      }
      const updatedMap = JSON.parse(JSON.stringify(currentMap));
      updatedMap[y][x] = [...possibleTiles][0];
      possibleMaps.push(updatedMap);
      return;
    }

    possibleTiles.forEach(tile => {
      const updatedMap = JSON.parse(JSON.stringify(currentMap));
      updatedMap[y][x] = tile;
      const newX = x === mapSize - 1 ? 0 : x + 1;
      const newY = newX === 0 ? y + 1 : y;
      dfs(newX, newY, updatedMap, [...tilesUsedSoFar, tile]);
    })
  }

  corners.forEach(corner => {
    const map = Array(mapSize).fill('').map(() => Array(mapSize).fill(''));
    map[0][0] = corner;
    dfs(1, 0, map, [corner]);
  })

  // At this point, we have all possible map combinations
  const alignedMapSize = mapSize * 10 - 2 * mapSize;
  let correctMapRougness;
  let monstersFound = 0;
  possibleMaps.forEach(tilesMap => {
    if (monstersFound) return;

    // Find correct state for all tiles
    for (let y = 0; y < tilesMap[0].length; y++) {
      for (let x = 0; x < tilesMap[0].length; x++) {
        const tile = tiles.find(t => t.tileId === tilesMap[y][x]);
        let topNeighbour, rightNeighbour, bottomNeighbour, leftNeighbour;
        if (y > 0) topNeighbour = tiles.find(t => t.tileId === tilesMap[y-1][x]);
        if (x < 2) rightNeighbour = tiles.find(t => t.tileId === tilesMap[y][x+1]);
        if (y < 2) bottomNeighbour = tiles.find(t => t.tileId === tilesMap[y+1][x]);
        if (x > 0) leftNeighbour = tiles.find(t => t.tileId === tilesMap[y][x-1]);
        const fittingStateId = tile.possibleEdges.findIndex(edge => {
          const bottoms = topNeighbour ? topNeighbour.possibleEdges.map(e => e[2].join('')) : null;
          const lefts = rightNeighbour ? rightNeighbour.possibleEdges.map(e => e[3].join('')) : null;
          const tops = bottomNeighbour ? bottomNeighbour.possibleEdges.map(e => e[0].join('')) : null;
          const rights = leftNeighbour ? leftNeighbour.possibleEdges.map(e => e[1].join('')) : null;
          return (!bottoms || bottoms.includes(edge[0].join(''))) &&
            (!lefts || lefts.includes(edge[1].join(''))) &&
            (!tops || tops.includes(edge[2].join(''))) &&
            (!rights || rights.includes(edge[3].join('')));
        })
        tile.fittingState = tile.tileStates[fittingStateId];
      }
    }

    // Change tileIds into actual, matching tiles
    const map = Array(alignedMapSize).fill('').map(() => Array(alignedMapSize).fill(''));
    for (let y = 0; y < alignedMapSize; y++) {
      for (let x = 0; x < alignedMapSize; x++) {
        const tileY = Math.floor(y / 8);
        const tileX = Math.floor(x / 8);
        const tile = tiles.find(t => t.tileId === tilesMap[tileY][tileX]).fittingState;
        map[y][x] = tile[y - tileY * 8 + 1][x - tileX * 8 + 1]; // +1 cause the task says to cut edges
      }
    }

    // Find monsters on the map
    for (let y = 2; y < alignedMapSize; y++) {
      for (let x = 0; x < alignedMapSize - 19; x++) {
        if (map[y-1][x] !== '#') continue;
        if (map[y][x+1] !== '#') continue;
        if (map[y][x+4] !== '#') continue;
        if (map[y-1][x+5] !== '#') continue;
        if (map[y-1][x+6] !== '#') continue;
        if (map[y][x+7] !== '#') continue;
        if (map[y][x+10] !== '#') continue;
        if (map[y-1][x+11] !== '#') continue;
        if (map[y-1][x+12] !== '#') continue;
        if (map[y][x+13] !== '#') continue;
        if (map[y][x+16] !== '#') continue;
        if (map[y-1][x+17] !== '#') continue;
        if (map[y-1][x+18] !== '#') continue;
        if (map[y-2][x+18] !== '#') continue;
        if (map[y-1][x+19] !== '#') continue;
        monstersFound++;
      }
    }
    if (monstersFound > 0) {
      correctMapRougness = JSON.stringify(map).split('').filter(x => x === '#').length;
    }
  });

  console.log(correctMapRougness - 15 * monstersFound);
}

// Day 21
const day21_foods = fs.readFileSync('./2020/day21.txt', 'utf-8').split('\n');

function findDangerousFood(foods) {
  const allergensList = {};
  const allIngredients = new Set();
  const allAllergens = new Set();

  foods.forEach(food => {
    food = food.substring(0, food.length - 1);
    let [ingredients, allergens] = food.split(' (contains ');
    ingredients = ingredients.split(' ');
    allergens = allergens.split(', ');

    ingredients.forEach(i => allIngredients.add(i));
    allergens.forEach(al => {
      allAllergens.add(al);
      if (!allergensList[al]) {
        allergensList[al] = ingredients;
      } else {
        allergensList[al] = allergensList[al].filter(i => ingredients.includes(i))
      }
    })
  });

  const ingWithAllergens = new Set();
  Object.values(allergensList).forEach(ingList => {
    ingList.forEach(i => ingWithAllergens.add(i));
  });
  const ingWithoutAllergens = [...allIngredients].filter(i => !ingWithAllergens.has(i))

  let occurance = 0;
  foods.forEach(food => {
    food = food.split(' ');
    food.forEach(ing => {
      if (ingWithoutAllergens.includes(ing)) occurance++;
    })
  });
  console.log(occurance);

  while (Object.values(allergensList).some(l => l.length > 1)) {
    const excludedIng = [];
    Object.values(allergensList).forEach(list => {
      if (list.length === 1 && !excludedIng.includes(list[0])) {
        const ingToExclude = list[0];
        excludedIng.push(list[0]);
        Object.entries(allergensList).forEach(([allergen, l]) => {
          if (l.length > 1) {
            allergensList[allergen] = l.filter(ing => ing !== ingToExclude);
          }
        });
      }
    })
  }

  let canonicalDangerousIngredientList = '';
  [...allAllergens].sort().forEach(al => {
    canonicalDangerousIngredientList += `${allergensList[al][0]},`
  })
  console.log(canonicalDangerousIngredientList.slice(0, -1))
}

// Day 22
const day22_players = fs.readFileSync('./2020/day22.txt', 'utf-8').split('\n\n');

function playCombatGame(players, recursive = false) {
  const player1 = players[0].split('\n').slice(1).map(Number);
  const player2 = players[1].split('\n').slice(1).map(Number);

  const combat = (deck1, deck2) => {
    let wasRepeat = false
    const historyOfDecks = [];
    while (deck1.length !== 0 && deck2.length !== 0) {
      if (historyOfDecks.includes(JSON.stringify([deck1, deck2]))) {
        wasRepeat = true;
        break;
      }
      historyOfDecks.push(JSON.stringify([deck1, deck2]));
      const card1 = deck1.splice(0, 1)[0];
      const card2 = deck2.splice(0, 1)[0];
      if (recursive && card1 <= deck1.length && card2 <= deck2.length) {
        const { winner } = combat([...deck1].slice(0, card1), [...deck2].slice(0, card2));
        if (winner === 1) {
          deck1.push(card1, card2);
        } else {
          deck2.push(card2, card1);
        }
      } else if (card1 > card2) {
        deck1.push(card1, card2);
      } else {
        deck2.push(card2, card1);
      }
    }
    return { deck1, deck2, winner: deck1.length > 0 || wasRepeat ? 1 : 2 }
  }

  const { deck1, deck2 } = combat(player1, player2);
  const winningPlayer = deck1.length > 0 ? deck1.reverse() : deck2.reverse();

  let score = 0;
  for (let i = 1; i <= winningPlayer.length; i++) {
    score += i * winningPlayer[i - 1];
  }
  console.log(score);
}

// Day 23
const day23_cups = fs.readFileSync('./2020/day23.txt', 'utf-8').split('').map(Number);

function moveCrabCups(cups) {
  let i = 0;
  for (let move = 1; move <= 100; move++) {
    const target = cups[i];
    if (i > 5) {
      const toMoveAtFront = cups.splice(5);
      cups.unshift(...toMoveAtFront);
      i = cups.indexOf(target);
    }

    const pickUp = cups.splice(i + 1, 3);
    let possibleDestination = target - 1;
    while (!cups.includes(possibleDestination)) {
      possibleDestination--;
      if (possibleDestination <= 0) {
        possibleDestination = 9;
      }
    }
    cups.splice((cups.indexOf(possibleDestination) + 1) % 9, 0, ...pickUp);
    i = (cups.indexOf(target) + 1) % 9;
  }

  const result = [];
  while (result.length < 8) {
    const x = cups.indexOf(1);
    const toCut = cups.splice((x + 1) % cups.length, 1);
    result.push(toCut);
  }
  console.log(result.join(''));
}

function moveMassiveAmountOfCrabCups(cups, position = 0, startingMove = 1) {
  if (cups.length === 9) {
    for (let x = 10; x <= 1000000; x++) {
      cups.push(x);
    }
  }
  let i = position;
  for (let move = startingMove; move <= 10000000; move++) {
    if (move % 10000 === 0) {
      fs.writeFileSync('./2020/day23_cups.txt', JSON.stringify(cups));
      fs.writeFileSync('./2020/day23_data.txt', JSON.stringify({ move, i }));
      // console.log(`Processing... ${move / 100000}%`);
    }
    const target = cups[i];
    if (i > 999995) {
      const toMoveAtFront = cups.splice(999995);
      cups.unshift(...toMoveAtFront);
      i = cups.indexOf(target);
    }

    const pickUp = cups.splice(i + 1, 3);
    let possibleDestination = target - 1;
    while (!cups.includes(possibleDestination)) {
      possibleDestination--;
      if (possibleDestination <= 0) {
        possibleDestination = 1000000;
      }
    }
    cups.splice((cups.indexOf(possibleDestination) + 1) % 1000000, 0, ...pickUp);
    i = (cups.indexOf(target) + 1) % 1000000;
  }

  const cup1 = cups.indexOf(1);
  const nextCup = cups[cup1 + 1];
  const nextNextCup = cups[cup1 + 2];

  console.log(nextCup * nextNextCup);
}

// Day 24
const day24_navs = fs.readFileSync('./2020/day24.txt', 'utf-8').split('\n');

const navOnHex = {
  e: (a, b) => [a + 2, b],
  w: (a, b) => [a - 2, b],
  ne: (a, b) => [a + 1, b - 2],
  se: (a, b) => [a + 1, b + 2],
  nw: (a, b) => [a - 1, b - 2],
  sw: (a, b) => [a - 1, b + 2],
};

function turnHexTiles(navs) {
  let blackTiles = new Set()

  // Day 0
  navs.forEach(nav => {
    let position = [0, 0];
    let navsLeft = nav;

    while (navsLeft.length > 0) {
      if (navsLeft.startsWith('e') || navsLeft.startsWith('w')) {
        position = navOnHex[navsLeft[0]](...position);
        navsLeft = navsLeft.substring(1);
      } else {
        position = navOnHex[navsLeft.substring(0, 2)](...position);
        navsLeft = navsLeft.substring(2);
      }
    }

    const finalNav = position.join('x');
    if (blackTiles.has(finalNav)) {
      blackTiles.delete(finalNav);
    } else {
      blackTiles.add(finalNav);
    }
  });

  // Part 1
  console.log(blackTiles.size);

  // Days 1-100
  for (let i = 1; i <= 100; i++) {
    const minX = Math.min(...[...blackTiles].map(t => Number(t.split('x')[0])));
    const maxX = Math.max(...[...blackTiles].map(t => Number(t.split('x')[0])));
    const minY = Math.min(...[...blackTiles].map(t => Number(t.split('x')[1])));
    const maxY = Math.max(...[...blackTiles].map(t => Number(t.split('x')[1])));

    const newTiles = new Set();


    for (let x = minX - 1; x <= maxX + 1; x++) {
      let finalMinY, finalMaxY;
      if (x % 2 === 0) {
        finalMinY = minY % 4 === 0 ? minY : minY - 2;
        finalMaxY = maxY % 4 === 0 ? maxY : maxY + 2;
      } else {
        finalMinY = minY % 4 === 0 ? minY - 2 : minY;
        finalMaxY = maxY % 4 === 0 ? maxY + 2 : maxY;
      }

      for (let y = finalMinY; y <= finalMaxY; y += 4) {
        let neighbours = 0;
        if (blackTiles.has(`${x+2}x${y}`)) neighbours++;
        if (blackTiles.has(`${x-2}x${y}`)) neighbours++;
        if (blackTiles.has(`${x+1}x${y-2}`)) neighbours++;
        if (blackTiles.has(`${x+1}x${y+2}`)) neighbours++;
        if (blackTiles.has(`${x-1}x${y-2}`)) neighbours++;
        if (blackTiles.has(`${x-1}x${y+2}`)) neighbours++;

        if (blackTiles.has(`${x}x${y}`)) {
          if (neighbours === 1 || neighbours === 2) {
            newTiles.add(`${x}x${y}`);
          }
        } else {
          if (neighbours === 2) {
            newTiles.add(`${x}x${y}`);
          }
        }
      }
    }

    blackTiles = newTiles;
  }

  // Part 2
  console.log(blackTiles.size);
}

// Day 25
const day25_keys = fs.readFileSync('./2020/day25.txt', 'utf-8').split('\n').map(Number);

function findEncryptionKey(publicKeys) {
  let publicKeyToUse = null;
  let loop = 0;
  let subjectNumber = 1;

  while (!publicKeyToUse) {
    loop++
    subjectNumber *= 7;
    subjectNumber = subjectNumber % 20201227;
    if (subjectNumber === publicKeys[0]) {
      publicKeyToUse = publicKeys[1];
    }
    if (subjectNumber === publicKeys[1]) {
      publicKeyToUse = publicKeys[0];
    }
  }

  let encryptionKey = 1;
  for (let i = 0; i < loop; i++) {
    encryptionKey *= publicKeyToUse;
    encryptionKey = encryptionKey % 20201227;
  }

  console.log(encryptionKey);
}


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

// console.log('Day 19, part 1 (this will take a while):');
// countValidMessages(day19_rules, day19_messages);
// console.log('Day 19, part 2:');
// countValidMessagesWithLoopedRules(day19_rules, day19_messages);

// console.log('Day 20, part 1:');
// const tilesData = findCornerTilesAndMatches(day20_tiles)
// console.log('Day 20, part 2:');
// alignTilesAndFindMonsters(tilesData);

// console.log('Day 21, part 1 & 2:');
// findDangerousFood(day21_foods)

// console.log('Day 22, part 1:');
// playCombatGame(day22_players);
// console.log('Day 22, part 2 (this will take a while):');
// playCombatGame(day22_players, true);

// console.log('Day 23, part 1:');
// moveCrabCups(day23_cups);
// console.log('Day 23, part 2 (this takes about 8-9h xD):');
// moveMassiveAmountOfCrabCups(day23_cups);
// For immediate answer, run the 3 lines below:
/*
const { move, i } = JSON.parse(fs.readFileSync('./2020/day23_data.txt', 'utf-8'));
const cups = JSON.parse(fs.readFileSync('./2020/day23_cups.txt', 'utf-8'));
moveMassiveAmountOfCrabCups(cups, i, move);
*/

// console.log('Day 24, part 1 & 2:');
// turnHexTiles(day24_navs);

// console.log('Day 25');
// findEncryptionKey(day25_keys);
