const fs = require("fs");

//Day 1
const day1_foods = fs.readFileSync('./2022/day1.txt', 'utf-8').split('\n').map(Number);

function findElvesWithBiggestFood(foods) {
  const elves = [];
  let i = 0;
  for (let x = 0; x < foods.length; x++) {
    if (foods[x]) {
      if (elves[i]) elves[i] += foods[x];
      else elves.push(foods[x]);
    } else {
      i++;
    }
  }

  elves.sort((a, b) => b - a);
  console.log(elves[0]);
  console.log(elves[0] + elves[1] + elves[2]);
}

// Day 2
const day2_moves = fs.readFileSync('./2022/day2.txt', 'utf-8').split('\n');

function playRockPaperScissors(moves) {
  let score = 0;
  const movesToPoints = { A: 1, B: 2, C: 3, X: 1, Y: 2, Z: 3 };
  moves.forEach(move => {
    const [opponent, you] = move.split(' ').map(m => movesToPoints[m]);
    score += you;
    if (opponent === 1 && you === 3) score += 0;
    else if (opponent === 3 && you === 1) score += 6;
    else if (opponent > you) score += 0;
    else if (opponent < you) score += 6;
    else score += 3;
  })
  console.log(score);
}

function playRockPaperScissorsDifferentStrategy(moves) {
  let score = 0;
  const movesToPoints = { A: 1, B: 2, C: 3, X: 0, Y: 3, Z: 6 };
  moves.forEach(move => {
    const [opponent, result]  = move.split(' ').map(m => movesToPoints[m]);
    score += result;
    if (result === 3) score += opponent;
    else if (result === 6) score += (opponent % 3) + 1;
    else {
      let toGet = opponent - 1;
      if (toGet === 0) toGet = 3;
      score += toGet;
    }
  });
  console.log(score);
}

// Day 3
const day3_rucksacks = fs.readFileSync('./2022/day3.txt', 'utf-8').split('\n');
const alphabetDouble = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function findRepeatsIncompartments(rucksacks) {
  let priority = 0;
  rucksacks.forEach(rucksack => {
    const comp1 = rucksack.slice(0, rucksack.length / 2);
    const comp2 = rucksack.slice(rucksack.length / 2);

    const commonItem = comp1.split('').find(item => comp2.includes(item));
    priority += alphabetDouble.indexOf(commonItem);
  });
  console.log(priority);
}

function findRepeatsInGroup(rucksacks) {
  let priority = 0;
  for (let i = 0; i < rucksacks.length; i += 3) {
    const commonItem = rucksacks[i].split('').find(
      item => rucksacks[i+1].includes(item) && rucksacks[i+2].includes(item)
    );
    priority += alphabetDouble.indexOf(commonItem);
  }
  console.log(priority);
}

// Day 4
const day4_ranges = fs.readFileSync('./2022/day4.txt', 'utf-8').split('\n');

function findOverlapingSections(ranges) {
  let fullOverlapCounter = 0;
  let partOverlapCounter = 0;
  ranges.forEach(range => {
    const values = range.match(/[0-9]+/g).map(Number);
    if ((values[0] <= values[2] && values[1] >= values[3]) ||
    (values[2] <= values[0] && values[3] >= values[1])) {
      fullOverlapCounter++;
      partOverlapCounter++;
    } else {
      const uniqueSections = new Set();
      let addedSections = 0;
      for (let x = values[0]; x <= values[1]; x++) {
        uniqueSections.add(x);
        addedSections++;
      }
      for (let y = values[2]; y <= values[3]; y++) {
        uniqueSections.add(y);
        addedSections++;
      }
      if (addedSections > uniqueSections.size) partOverlapCounter++;
    }
  });
  console.log(fullOverlapCounter);
  console.log(partOverlapCounter);
}

// Day 5
let [day5_crates, day5_moves] = fs.readFileSync('./2022/day5.txt', 'utf-8').split('\n\n');
day5_crates = day5_crates.split('\n');
day5_crates.pop();
day5_moves = day5_moves.split('\n');

function assignCrates(crates) {
  const stacks = Array(Math.ceil(crates[0].length / 4));

  crates.forEach(row => {
    let stack = 0;
    for (let x = 1; x < row.length; x += 4) {
      if (row[x].trim()) {
        if (stacks[stack]) stacks[stack].push(row[x]);
        else stacks[stack] = [row[x]];
      }
      stack ++;
    }
  })

  return stacks;
}

function moveCrates(crates, moves) {
  const stacks = assignCrates(crates);

  moves.forEach(move => {
    const instructions = move.match(/[0-9]+/g).map(Number);
    for (let m = 1; m <= instructions[0]; m++) {
      const toMove = stacks[instructions[1] - 1].shift();
      stacks[instructions[2] - 1].unshift(toMove);
    }
  });

  console.log(stacks.map(stack => stack[0]).join(''));
}

function moveCratesWithCrateMover9001(crates, moves) {
  const stacks = assignCrates(crates);

  moves.forEach(move => {
    const instructions = move.match(/[0-9]+/g).map(Number);
    const toMove = stacks[instructions[1] - 1].splice(0, instructions[0]);
    stacks[instructions[2] - 1].unshift(...toMove);
  });

  console.log(stacks.map(stack => stack[0]).join(''));
}

// Day 6
const day6_signal = fs.readFileSync('./2022/day6.txt', 'utf-8').split('');

function findStartOfMarker(signal, disinct) {
  for (let x = disinct; x <= signal.length; x++) {
    if (new Set(signal.slice(x - disinct, x)).size === disinct) {
      console.log(x);
      break;
    }
  }
}

// Day 7
const day7_commands = fs.readFileSync('./2022/day7.txt', 'utf-8').split('\n');

function executeCommandsAndFreeSpace(commands) {
  const currentDir = [];
  const overallSizes = { main: 0 };

  commands.forEach(com => {
    if (com.startsWith('$ cd')) {
      if (com === '$ cd /') currentDir.splice(0);
      else if (com === '$ cd ..') currentDir.pop();
      else {
        const newDir = com.replace('$ cd ', '');
        currentDir.push(newDir);
      }
    } else if (com.startsWith('$ ls')) {
      return;
    } else {
      const [value, name] = com.split(' ');
      if (value === 'dir') {
        const fullName = `${currentDir.join('/')}/${name};`
        overallSizes[fullName] = 0;
      } else {
        overallSizes.main += Number(value);
        currentDir.forEach((dir, id) => {
          const fullName = `${currentDir.slice(0, id).join('/')}/${dir};`
          overallSizes[fullName] += Number(value);
        })
      }
    }
  });

  let sumOfSmallDirs = 0
  const freeSpace = 70000000 - overallSizes.main;
  const requiredForUpdate = 30000000 - freeSpace;
  const possibleDeletes = [];

  Object.values(overallSizes).forEach(size => {
    if (size <= 100000) sumOfSmallDirs += size;
    if (size > requiredForUpdate) possibleDeletes.push(size);
  })

  console.log(sumOfSmallDirs);
  console.log(Math.min(...possibleDeletes));
}

// Day 8
const day8_trees = fs.readFileSync('./2022/day8.txt', 'utf-8').split('\n').map(row => row.split('').map(Number));

function countVisibleTrees(trees) {
  let invisible = 0;
  for (let y = 1; y < trees.length - 1; y++) {
    for (let x = 1; x < trees[0].length - 1; x++) {
      const biggestXLeft = Math.max(...trees[y].slice(0, x));
      const biggestXRight = Math.max(...trees[y].slice(x + 1));
      const biggestYTop = Math.max(...trees.map(row => row[x]).slice(0, y));
      const biggestYBottom = Math.max(...trees.map(row => row[x]).slice(y + 1));
      if (trees[y][x] <= biggestXLeft &&
        trees[y][x] <= biggestXRight &&
        trees[y][x] <= biggestYTop &&
        trees[y][x] <= biggestYBottom) {
        invisible++
      }
    }
  }
  console.log(trees.length * trees[0].length - invisible);
}

Array.prototype.findLastIndex = function(callback) {
  const id = [...this].reverse().findIndex(callback);
  if (id === -1) return id;
  return this.length - 1 - id;
}

function findTreeWithNiceView(trees) {
  let bestScore = 0;
  // Trees on the edge are disqualified as one of their side will be 0, so the whole score will be 0
  for (let y = 1; y < trees.length - 1; y++) {
    for (let x = 1; x < trees[0].length - 1; x++) {
      let visibleOnLeft = trees[y].slice(0, x).findLastIndex(tree => tree >= trees[y][x]);
      let visibleOnRight = trees[y].slice(x + 1).findIndex(tree => tree >= trees[y][x]);
      let visibleOnTop = trees.map(row => row[x]).slice(0, y).findLastIndex(tree => tree >= trees[y][x]);
      let visibleOnBottom = trees.map(row => row[x]).slice(y + 1).findIndex(tree => tree >= trees[y][x]);
      if (visibleOnLeft === -1) visibleOnLeft = 0;
      if (visibleOnRight === -1) visibleOnRight = trees[0].length - 1;
      else visibleOnRight += x + 1;
      if (visibleOnTop === -1) visibleOnTop = 0;
      if (visibleOnBottom === -1) visibleOnBottom = trees.length - 1;
      else visibleOnBottom += y + 1;

      const score = (x - visibleOnLeft) * (visibleOnRight - x) * (y - visibleOnTop) * (visibleOnBottom - y);
      bestScore = Math.max(bestScore, score);
    }
  }
  console.log(bestScore)
}

// Day 9
const day9_moves = fs.readFileSync('./2022/day9.txt', 'utf-8').split('\n');

function moveTailOfRope(moves, knotsNumber) {
  const tailPositions = new Set(['0x0']);
  const knots = [];
  for (let knot = 0; knot <= knotsNumber; knot++) { knots.push([0,0]) };

  moves.forEach(move => {
    const [direction, value] = move.split(' ');
    for (let x = 0; x < Number(value); x++) {
      switch (direction) {
        case 'U':
          knots[0][1]--;
          break;
        case 'D':
          knots[0][1]++;
          break;
        case 'L':
          knots[0][0]--;
          break;
        case 'R':
          knots[0][0]++;
          break;
      }
      for (let k = 1; k <= knotsNumber; k++) {
        if (knots[k-1][0] === knots[k][0] && Math.abs(knots[k-1][1] - knots[k][1]) > 1) {
          if (knots[k][1] > knots[k-1][1]) knots[k][1]--;
          else knots[k][1]++;
        } else if (knots[k-1][1] === knots[k][1] && Math.abs(knots[k-1][0] - knots[k][0]) > 1) {
          if (knots[k][0] > knots[k-1][0]) knots[k][0]--;
          else knots[k][0]++;
        } else if ((Math.abs(knots[k-1][1] - knots[k][1]) + Math.abs(knots[k-1][0] - knots[k][0])) > 2) {
          if (knots[k][1] > knots[k-1][1]) knots[k][1]--;
          else knots[k][1]++;
          if (knots[k][0] > knots[k-1][0]) knots[k][0]--;
          else knots[k][0]++;
        }
      }
      tailPositions.add(knots[knotsNumber].join('x'));
    }
  });
  console.log(tailPositions.size);
}

// Day 10
const day10_operations = fs.readFileSync('./2022/day10.txt', 'utf-8').split('\n');

class CRT {
  constructor(operations, cyclesToCheck) {
    this.register = 1;
    this.cycle = 1;
    this.operations = operations;
    this.currentOperation = 0;
    this.cyclesToEnd = 0;
    this.cyclesToCheck = cyclesToCheck;
    this.recordedCycles = {};
    this.pixels = '';
  }

  drawPixel() {
    let row = Math.floor((this.cycle - 1) / 40);
    const pixelsInSprite = [this.register - 1, this.register, this.register + 1].map(x => x + (40 * row));
    if (pixelsInSprite.includes(this.pixels.length)) {
      this.pixels += '█';
    } else {
      this.pixels += ' ';
    }
  }

  noop() {
    this.currentOperation++;
    this.cyclesToEnd = 0;
  }

  addx(value) {
    if (!this.cyclesToEnd) {
      this.cyclesToEnd = 2;
    }
    this.cyclesToEnd--;
    if (this.cyclesToEnd === 0) {
      this.currentOperation++;
      this.register += value;
    }
  }

  showScreen() {
    const toDraw = this.pixels.split('');
    while (toDraw.length > 0) {
      console.log(toDraw.splice(0, 40).join(''));
    }
  }

  startSystem() {
    while (this.currentOperation < this.operations.length) {
      if (this.cyclesToCheck.includes(this.cycle)) {
        this.recordedCycles[this.cycle] = this.register;
      }
      this.drawPixel();
      const [operation, value] = this.operations[this.currentOperation].split(' ');
      this[operation](Number(value));
      this.cycle++;
    }
  }
}

function getSignalStrengthsAndPrintOutput(operations) {
  const crt = new CRT(operations, [20, 60, 100, 140, 180, 220]);
  crt.startSystem();
  const recordedCycles = crt.recordedCycles;
  let totalStrenght = 0;
  Object.entries(recordedCycles).forEach(([cycle, value]) => {
    totalStrenght += Number(cycle) * value
  })
  console.log(totalStrenght);
  crt.showScreen();
}

// Day 11
const day11_monkeys = fs.readFileSync('./2022/day11.txt', 'utf-8').split('\n\n');

function prepareMonkeyObjects(monkeys_raw) {
  return monkeys_raw.map(m => {
    const instructions = m.split('\n');
    return {
      items: instructions[1].match(/[0-9]+/g).map(Number),
      operation: instructions[2].slice(19),
      test: Number(instructions[3].match(/[0-9]+/g)[0]),
      ifTrue: Number(instructions[4].match(/[0-9]+/g)[0]),
      ifFalse: Number(instructions[5].match(/[0-9]+/g)[0]),
      performedChecks: 0,
    }
  });
}

function getItemsFromMonkeys(monkeys_raw) {
  const monkeys = prepareMonkeyObjects(monkeys_raw);

  for (let round = 1; round <= 20; round++) {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const old = item;
        const worryLevel = Math.floor(eval(monkey.operation) / 3);
        if (worryLevel % monkey.test === 0) {
          monkeys[monkey.ifTrue].items.push(worryLevel);
        } else {
          monkeys[monkey.ifFalse].items.push(worryLevel);
        }
        monkey.performedChecks++;
      });
      monkey.items.splice(0);
    })
  }

  const monkeyActivity = monkeys.map(m => m.performedChecks).sort((a, b) => b - a);
  console.log(monkeyActivity[0] * monkeyActivity[1]);
}

function getItemsFromMonkeysBeingWorried(monkeys_raw) {
  const monkeys = prepareMonkeyObjects(monkeys_raw);
  const reducer = monkeys.map(m => m.test).reduce((a, b) => a * b, 1);

  for (let round = 1; round <= 10000; round++) {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const old = item;
        const worryLevel = eval(monkey.operation) % reducer;
        if (worryLevel % monkey.test === 0) {
          monkeys[monkey.ifTrue].items.push(worryLevel);
        } else {
          monkeys[monkey.ifFalse].items.push(worryLevel);
        }
        monkey.performedChecks++;
      });
      monkey.items.splice(0);
    })
  }

  const monkeyActivity = monkeys.map(m => m.performedChecks).sort((a, b) => b - a);
  console.log(monkeyActivity[0] * monkeyActivity[1]);
}

// Day 12
const day12_area = fs.readFileSync('./2022/day12.txt', 'utf-8').split('\n').map(row => row.split(''));
const Graph = require('node-dijkstra');
const alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function findShortestTrail(area) {
  const route = new Graph();
  let start, end;
  const possibleStarts = []; //for part 2
  for (let y = 0; y < area.length; y++) {
    for (let x = 0; x < area[0].length; x++) {
      const from = `${x},${y}`;
      if (area[y][x] === 'S') start = from;
      if (area[y][x] === 'a') possibleStarts.push(from);
      if (area[y][x] === 'E') end = from;
      const to = new Map();

      if (area[y-1]) to.set(`${x},${y-1}`, alphabet.indexOf(area[y-1][x].toLowerCase()) - alphabet.indexOf(area[y][x].toLowerCase()) <= 1 ? 1 : 999999);
      if (area[y][x-1]) to.set(`${x-1},${y}`, alphabet.indexOf(area[y][x-1].toLowerCase()) - alphabet.indexOf(area[y][x].toLowerCase()) <= 1 ? 1 : 999999);
      if (area[y][x+1]) to.set(`${x+1},${y}`, alphabet.indexOf(area[y][x+1].toLowerCase()) - alphabet.indexOf(area[y][x].toLowerCase()) <= 1 ? 1 : 999999);
      if (area[y+1]) to.set(`${x},${y+1}`, alphabet.indexOf(area[y+1][x].toLowerCase()) - alphabet.indexOf(area[y][x].toLowerCase()) <= 1 ? 1 : 999999);

      route.addNode(from, to);
    }
  }

  const routeFromE = route.path(start, end, { cost: true });
  console.log(routeFromE.cost);

  const bestA = routeFromE.path.findLastIndex(x => possibleStarts.includes(x));
  console.log(routeFromE.cost - bestA);
}

// Day 13
const day13_pairs = fs.readFileSync('./2022/day13.txt', 'utf-8').split('\n\n');

function compareArrays(left, right) {
  for (let x = 0; x < left.length; x++) {
    if (Number.isInteger(left[x]) && Number.isInteger(right[x])) {
      if (left[x] > right[x]) {
        return false;
      } else if (left[x] < right[x]) {
        return true;
      }
    } else if (left[x] === undefined) {
      return true;
    } else if (right[x] === undefined) {
      return false
    } else {
      if (!Array.isArray(left[x])) {
        left[x] = JSON.parse(`[${left[x]}]`);
      }
      if (!Array.isArray(right[x])) {
        right[x] = JSON.parse(`[${right[x]}]`);
      }
      const result = compareArrays(left[x], right[x]);
      if (result !== 'draw') {
        return result;
      };
    }
  }
  if (left.length === right.length) {
    return 'draw';
  }
  return true;
}

function countOrderedArrays(pairs) {
  let sumOfCorrectPairs = 0

  pairs.forEach((pair, id) => {
    const [left, right] = pair.split('\n').map(x => JSON.parse(x));
    if (compareArrays(left, right)) {
      sumOfCorrectPairs += id + 1;
    }
  })

  console.log(sumOfCorrectPairs)
}

function sortArrays(pairs) {
  const allArrays = [];
  pairs.forEach(pair => {
    allArrays.push(...pair.split('\n').map(x => JSON.parse(x)));
  })

  let indexOfFirst = 1; // Indices start at 1
  let indexOfSecond = 2; // Second is already bigger that first
  allArrays.forEach(arr => {
    if (compareArrays(arr, [[2]])) {
      indexOfFirst++;
      indexOfSecond++;
    } else if (compareArrays(arr, [[6]])) {
      indexOfSecond++;
    }
  });

  console.log(indexOfFirst * indexOfSecond)
}

// Day 14
const day14_rocks = fs.readFileSync('./2022/day14.txt', 'utf-8').split('\n');

function simulateSandFlow(rocks, withFloor = false) {
  let biggestX = 0;
  let biggestY = 0;
  let smallestX = Infinity;
  const coordinates = rocks.map(rock => {
    const navs = rock.match(/[0-9]+/g).map(Number);
    const x = [];
    const y = [];
    navs.forEach((nav, id) => {
      if (id % 2 === 0) x.push(nav);
      else y.push(nav);
    });
    biggestX = Math.max(biggestX, ...x);
    smallestX = Math.min(smallestX, ...x);
    biggestY = Math.max(biggestY, ...y);
    return { x, y };
  })
  const yToAdd = withFloor ? 3 : 1;
  const xToFill = withFloor ? 1000 : biggestX - smallestX + 3;
  const cave = Array(biggestY + yToAdd).fill('.').map(() => Array(xToFill).fill('.'));

  coordinates.forEach(coord => {
    for (let i = 0; i < coord.x.length - 1; i++) {
      const [smY, bgY] = [coord.y[i], coord.y[i+1]].sort((a,b) => a - b);
      for (let y = smY; y <= bgY; y++ ) {
        let smX, bgX;
        if (withFloor) {
          [smX, bgX] = [coord.x[i], coord.x[i+1]].sort((a,b) => a - b);
        } else {
          [smX, bgX] = [coord.x[i] - smallestX + 1, coord.x[i+1] - smallestX + 1].sort((a,b) => a - b);
        }

        for (let x = smX; x <= bgX; x++) {
          cave[y][x] = '#';
        }
      }
    }
  })

  if (withFloor) {
    for (let x = 0; x < 1000; x++) {
      cave[biggestY + 2][x] = '#';
    }
  }
  const sourceX = withFloor ? 500 : 500 - smallestX + 1;
  let canDrop = true;
  let droppedSandCount = 0;
  let lastRightBlocked = [] // This will save last 3 blocked drops on right. If all values repeats, it means that there's an overflow on the right. Not quite intuitive but I have no idea how to do it better xD

  const dropSand = (x, y) => {
    const possibleDropY = cave.map(row => row[x]).slice(y).findIndex(coord => coord !== '.') - 1 + y;
    if (possibleDropY < 0 || x === 0) {
      return false; // Drops into abyss
    };

    if (cave[possibleDropY+1][x - 1] !== '.') { // blocked on left
      if (cave[possibleDropY+1][x + 1] !== '.') { // blocked on right
        cave[possibleDropY][x] = 'o'
        droppedSandCount++;
        if (x === 500 && possibleDropY === 0) { // blocked source
          canDrop = false;
        }
        return true;
      } else {
        // Check overflow on right
        if (new Set(lastRightBlocked).size === 1 && lastRightBlocked[2] === x) {
          canDrop = false;
          return false;
        }
        lastRightBlocked.push(x);
        if (lastRightBlocked.length > 3) {
          lastRightBlocked.shift();
        }

        const wasDropped = dropSand(x + 1, possibleDropY + 1);
        if (wasDropped) {
          return true;
        } else {
          if (x === sourceX) canDrop = false;
          else return false;
        }
      }
    } else {
      const wasDropped = dropSand(x - 1, possibleDropY + 1);
      if (!wasDropped) {
        // Overflow on left
        canDrop = false;
        return false;
      } else {
        return true;
      }
    }
  }

  while (canDrop) {
    dropSand(sourceX,0);
  }

  console.log(droppedSandCount);
  // Uncomment line below if you want to see visualization in a text file. You can also move it to line 616 to see it live but this will cause the function to run significantly longer, on part 2 even by ~1h.
  // fs.writeFileSync('./2022/day14_cave.txt', JSON.stringify(cave).replaceAll('],', ']\n').replaceAll('\"', '').replaceAll(',', ''));
}

// Day 15
const day15_scanners = fs.readFileSync('./2022/day15.txt', 'utf-8').split('\n');

function getNoDistressBeaconRanges(data, row) {
  const coords = data.map(row => row.match(/-?[0-9]+/g).map(Number));
  const xRanges = []

  coords.forEach(coord => {
    const [scannerX, scannerY, beaconX, beaconY] = coord;
    const distance = Math.abs(scannerX - beaconX) + Math.abs(scannerY - beaconY);
    const distToRow = 0 + Math.abs(scannerY - row);
    if (distToRow > distance) return;

    const remaining = distance - distToRow;
    xRanges.push([scannerX - remaining, scannerX + remaining]);
  });

  xRanges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const combinedRanges = xRanges.reduce((ranges, newRange) => {
    const lastRange = ranges[ranges.length - 1] || [];
    if (lastRange.length > 0 && newRange[0] <= lastRange[1] + 1) { // last +1 because [2,3] & [4,5] can be combined
      // connecting 2 ranges into 1
      if (lastRange[1] < newRange[1]) {
        lastRange[1] = newRange[1];
      }
      return ranges;
    }
    // leaving 2 ranges
    return ranges.concat([newRange]);
  }, []);

  return combinedRanges;
}

function countNoBeaconFieldsInRow(data, row) {
  const range = getNoDistressBeaconRanges(data, row)[0];

  const coords = data.map(row => row.match(/-?[0-9]+/g).map(Number));
  const toRemove = new Set(); // points with other scanners or known beacons have to be removed
  coords.forEach(coord => {
    const [scannerX, scannerY, beaconX, beaconY] = coord;
    if (beaconY === row) toRemove.add(beaconX);
    if (scannerY === row) toRemove.add(scannerX);
  });

  const pointsInRange = range[1] - range[0] + 1;
  console.log(pointsInRange - toRemove.size);
}

function findDistressBeacon(data, range) {
  let rowRanges, rowY;
  for (let y = range; y >= 0; y--) { // going from last as I suspect the answer will be nearer the end
    const ranges = getNoDistressBeaconRanges(data, y);
    if (ranges.length > 1) {
      rowRanges = ranges;
      rowY = y;
      break;
    }
  }

  const x = rowRanges[0][1] + 1;
  console.log(x * 4000000 + rowY);
}

// Day 16
const day16_valves = fs.readFileSync('./2022/day16.txt', 'utf-8').split('\n');

function releaseTheMostPressure(valves_raw) {
  const valves = valves_raw.map(d => ({
    name: d.split(' ')[1],
    flowRate: Number(d.match(/[0-9]+/g)[0]),
    tunnels: d.substring(d.indexOf('valve') + 6).split(', ').map(x => x.trim()),
    isOpened: false,
  }));
  const valvesToOpen = valves.reduce((sum, valve) => valve.flowRate > 0 ? sum + 1 : sum, 0);

  const queue = { 0: [{
    atValve: valves.findIndex(v => v.name === 'AA'),
    currentPressure: 0,
    openedFlow: 0,
    valvesData: JSON.parse(JSON.stringify(valves)),
    openedValves: 0,
  }] };

  const savedRoads = [];

  let time = 0;
  let maxPressure = 0;
  const clearQueue = () => {
    queue[time].shift();
    if (queue[time].length === 0) {
      delete queue[time];
      time++;
      if (queue[time]) {
        queue[time].sort((a,b) => b.currentPressure - a.currentPressure);
        queue[time].splice(500)
      }
    }
  }

  while(time <= 30) {
    if (!queue[time]) {
      time++;
      continue;
    }

    const thisRoad = queue[time][0];
    maxPressure = Math.max(maxPressure, thisRoad.currentPressure);

    const roadData = JSON.stringify([ thisRoad.atValve, thisRoad.currentPressure ]);
    if (savedRoads.includes(roadData)) {
      clearQueue();
      continue;
    }
    savedRoads.push(roadData)

    const currentValve = thisRoad.valvesData[thisRoad.atValve];
    if (!queue[time + 1]) queue[time + 1] = [];
    if (!currentValve.isOpened && currentValve.flowRate > 0) {
      const updatedData = JSON.parse(JSON.stringify(thisRoad.valvesData));
      updatedData[thisRoad.atValve].isOpened = true;
      const newFlow = thisRoad.openedFlow + currentValve.flowRate;
      const newPressure = thisRoad.currentPressure + (30 - (time + 1)) * currentValve.flowRate;
      queue[time + 1].push({
        ...thisRoad,
        currentPressure: newPressure,
        openedFlow: newFlow,
        valvesData: updatedData,
        openedValves: thisRoad.openedValves + 1,
      });
    }

    if (thisRoad.openedValves < valvesToOpen) {
      currentValve.tunnels.forEach(tunnel => {
        const tunnelID = thisRoad.valvesData.findIndex(v => v.name === tunnel);
        queue[time + 1].push({ ...thisRoad, atValve: tunnelID });
      });
    } else {
      queue[time + 1].push({ ...thisRoad });
    }

    clearQueue();
  }

  console.log(maxPressure);
}

function releaseTheMostPressureWithElephant(valves_raw) {
  const valves = valves_raw.map(d => ({
    name: d.split(' ')[1],
    flowRate: Number(d.match(/[0-9]+/g)[0]),
    tunnels: d.substring(d.indexOf('valve') + 6).split(', ').map(x => x.trim()),
    isOpened: false,
  }));
  const valvesToOpen = valves.reduce((sum, valve) => valve.flowRate > 0 ? sum + 1 : sum, 0);
  const valveAA = valves.findIndex(v => v.name === 'AA');

  const queue = { 0: [{
    meAtValve: valveAA,
    elephantAtValve: valveAA,
    currentPressure: 0,
    openedFlow: 0,
    valvesData: JSON.parse(JSON.stringify(valves)),
    openedValves: 0,
  }] };

  const savedRoads = [];

  let time = 0;
  let maxPressure = 0;
  const clearQueue = () => {
    queue[time].shift();
    if (queue[time].length === 0) {
      delete queue[time];
      time++;
      if (queue[time]) {
        queue[time].sort((a,b) => b.currentPressure - a.currentPressure);
        queue[time].splice(1000)
      }
    }
  }

  while(time <= 26) {
    if (!queue[time]) {
      time++;
      continue;
    }

    const thisRoad = queue[time][0];
    maxPressure = Math.max(maxPressure, thisRoad.currentPressure);

    const roadData = JSON.stringify([ [thisRoad.meAtValve, thisRoad.elephantAtValve].sort(), thisRoad.currentPressure ]);
    if (savedRoads.includes(roadData)) {
      clearQueue();
      continue;
    }
    savedRoads.push(roadData);

    const currentValve = thisRoad.valvesData[thisRoad.meAtValve];
    const currentElephantValve = thisRoad.valvesData[thisRoad.elephantAtValve];
    const canIOpen = !currentValve.isOpened && currentValve.flowRate > 0;
    const canElephantOpen = !currentElephantValve.isOpened && currentElephantValve.flowRate > 0;

    if (!queue[time + 1]) queue[time + 1] = [];
    if (canIOpen || canElephantOpen) {
      const updatedGlobalData = JSON.parse(JSON.stringify(thisRoad.valvesData));
      let newGlobalPressure = thisRoad.currentPressure;

      if (canIOpen) {
        updatedGlobalData[thisRoad.meAtValve].isOpened = true;
        newGlobalPressure += (26 - (time + 1)) * currentValve.flowRate;
        const newThisPressure = thisRoad.currentPressure + (26 - (time + 1)) * currentValve.flowRate;

        // Scenario where only I open valve, elephant should move
        const updatedThisData = JSON.parse(JSON.stringify(thisRoad.valvesData));
        updatedThisData[thisRoad.meAtValve].isOpened = true;
        currentElephantValve.tunnels.forEach(elephantTunnel => {
          const elephantTunnelID = thisRoad.valvesData.findIndex(v => v.name === elephantTunnel);
          if (elephantTunnelID === thisRoad.meAtValve) return;

          queue[time + 1].push({
            ...thisRoad,
            elephantAtValve: elephantTunnelID,
            currentPressure: newThisPressure,
            openedFlow: thisRoad.openedFlow + currentValve.flowRate,
            valvesData: updatedThisData,
            openedValves: thisRoad.openedValves + 1,
          });
        });
      }
      if (canElephantOpen) {
        updatedGlobalData[thisRoad.elephantAtValve].isOpened = true;
        newGlobalPressure += (26 - (time + 1)) * currentElephantValve.flowRate;
        const newThisPressure = thisRoad.currentPressure + (26 - (time + 1)) * currentElephantValve.flowRate;

        // Scenario where only elephant opens valve, I should move
        const updatedThisData = JSON.parse(JSON.stringify(thisRoad.valvesData));
        updatedThisData[thisRoad.elephantAtValve].isOpened = true;
        currentValve.tunnels.forEach(tunnel => {
          const tunnelID = thisRoad.valvesData.findIndex(v => v.name === tunnel);
          if (tunnelID === thisRoad.elephantAtValve) return;

          queue[time + 1].push({
            ...thisRoad,
            meAtValve: tunnelID,
            currentPressure: newThisPressure,
            openedFlow: thisRoad.openedFlow + currentElephantValve.flowRate,
            valvesData: updatedThisData,
            openedValves: thisRoad.openedValves + 1,
          });
        });
      }

      if (canIOpen && canElephantOpen) {
        queue[time + 1].push({
          ...thisRoad,
          currentPressure: newGlobalPressure,
          openedFlow: thisRoad.openedFlow + currentValve.flowRate + currentElephantValve.flowRate,
          valvesData: updatedGlobalData,
          openedValves: thisRoad.openedValves + 2,
        });
      }
    }

    if (thisRoad.openedValves < valvesToOpen) {
      currentElephantValve.tunnels.forEach(elephantTunnel => {
        const elephantTunnelID = thisRoad.valvesData.findIndex(v => v.name === elephantTunnel);
        currentValve.tunnels.forEach(tunnel => {
          if (tunnel === elephantTunnel) return;
          const tunnelID = thisRoad.valvesData.findIndex(v => v.name === tunnel);

          queue[time + 1].push({
            ...thisRoad,
            meAtValve: tunnelID,
            elephantAtValve: elephantTunnelID,
          });
        });
      });
    } else {
      queue[time + 1].push({ ...thisRoad });
    }

    clearQueue();
  }

  console.log(maxPressure);
}

// Day 17
const day17_jets = fs.readFileSync('./2022/day17.txt', 'utf-8').split('');

function watchFallingRocks(jets, steps) {
  let currentRock = 0;
  let currentJet = 0;
  const chamber = Array(4001).fill('.').map(() => Array(7).fill('.'));
  let bottomEdge = 4001;

  const nextJet = () => { currentJet = (currentJet + 1) % jets.length; };
  const nextRock = () => { currentRock = (currentRock + 1) % 5; };
  let addedPatterns = 0;

  for (let step = 1; step <= steps; step++) {
    let landed = false;
    let position;
    switch(currentRock) {
      case 0: // shape: -
        position = [2, bottomEdge - 4];
        while (!landed) {
          const jet = jets[currentJet];
          // Moving left/right
          if (jet === '<' && position[0] > 0) {
            if (chamber[position[1]][position[0] - 1] === '.') position[0]--;
          } else if (jet === '>' && position[0] < 3) {
            if (chamber[position[1]][position[0] + 4] === '.') position[0]++;
          }
          nextJet();
          // Falling down
          if (position[1] === 4000) { // floor
            landed = true;
          }
          else if (chamber[position[1] + 1][position[0]] === '.' &&
              chamber[position[1] + 1][position[0] + 1] === '.' &&
              chamber[position[1] + 1][position[0] + 2] === '.' &&
              chamber[position[1] + 1][position[0] + 3] === '.') {
            position[1]++;
          } else {
            landed = true;
          }
        }
        bottomEdge = Math.min(bottomEdge, position[1]);
        chamber[position[1]][position[0]] = '#';
        chamber[position[1]][position[0] + 1] = '#';
        chamber[position[1]][position[0] + 2] = '#';
        chamber[position[1]][position[0] + 3] = '#';
        break;
      case 1: //shape: +
        position = [2, bottomEdge - 6];
        while (!landed) {
          const jet = jets[currentJet];
          if (step === 12) {
          }
          // Moving left/right
          if (jet === '<' && position[0] > 0) {
            if (chamber[position[1]][position[0]] === '.' && chamber[position[1] + 1][position[0] - 1] === '.' && chamber[position[1] + 2][position[0]] === '.') position[0]--;
          } else if (jet === '>' && position[0] < 4) {
            if (chamber[position[1]][position[0] + 2] === '.' && chamber[position[1] + 1][position[0] + 3] === '.' && chamber[position[1] + 2][position[0] + 2] === '.') position[0]++;
          }
          nextJet();
          // Falling down
          if (position[1] === 3998) { // floor
            landed = true;
          } else if (chamber[position[1] + 2][position[0]] === '.' &&
                chamber[position[1] + 3][position[0] + 1] === '.' &&
                chamber[position[1] + 2][position[0] + 2] === '.') {
            position[1]++;
          } else {
            landed = true;
          }
        }
        bottomEdge = Math.min(bottomEdge, position[1]);
        chamber[position[1]][position[0] + 1] = '#';
        chamber[position[1] + 1][position[0]] = '#';
        chamber[position[1] + 1][position[0] + 1] = '#';
        chamber[position[1] + 1][position[0] + 2] = '#';
        chamber[position[1] + 2][position[0] + 1] = '#';
        break;
      case 2: //shape: ⅃
        position = [2, bottomEdge - 6];
        while (!landed) {
          const jet = jets[currentJet];
          // Moving left/right
          if (jet === '<' && position[0] > 0) {
            if (chamber[position[1]][position[0] + 1] === '.' && chamber[position[1] + 1][position[0] + 1] === '.' && chamber[position[1] + 2][position[0] - 1] === '.') position[0]--;
          } else if (jet === '>' && position[0] < 4) {
            if (chamber[position[1]][position[0] + 3] === '.' && chamber[position[1] + 1][position[0] + 3] === '.' && chamber[position[1] + 2][position[0] + 3] === '.') position[0]++;
          }
          nextJet();
          // Falling down
          if (position[1] === 3998) { // floor
            landed = true;
          } else if (chamber[position[1] + 3][position[0]] === '.' &&
              chamber[position[1] + 3][position[0] + 1] === '.' &&
              chamber[position[1] + 3][position[0] + 2] === '.') {
            position[1]++;
          } else {
            landed = true;
          }
        }
        bottomEdge = Math.min(bottomEdge, position[1]);
        chamber[position[1]][position[0] + 2] = '#';
        chamber[position[1] + 1][position[0] + 2] = '#';
        chamber[position[1] + 2][position[0]] = '#';
        chamber[position[1] + 2][position[0] + 1] = '#';
        chamber[position[1] + 2][position[0] + 2] = '#';
        break;
      case 3: //shape: |
        position = [2, bottomEdge - 7];
        while (!landed) {
          const jet = jets[currentJet];
          // Moving left/right
          if (jet === '<' && position[0] > 0) {
            if (chamber[position[1]][position[0] - 1] === '.' &&
            chamber[position[1] + 1][position[0] - 1] === '.' &&
            chamber[position[1] + 2][position[0] - 1] === '.' &&
            chamber[position[1] + 3][position[0] - 1] === '.') position[0]--;
          } else if (jet === '>' && position[0] < 6) {
            if (chamber[position[1]][position[0] + 1] === '.' &&
            chamber[position[1] + 1][position[0] + 1] === '.' &&
            chamber[position[1] + 2][position[0] + 1] === '.' &&
            chamber[position[1] + 3][position[0] + 1] === '.') position[0]++;
          }
          nextJet();
          // Falling down
          if (position[1] === 3997) { // floor
            landed = true;
          } else if (chamber[position[1] + 4][position[0]] === '.') {
            position[1]++;
          } else {
            landed = true;
          }
        }
        bottomEdge = Math.min(bottomEdge, position[1]);
        chamber[position[1]][position[0]] = '#';
        chamber[position[1] + 1][position[0]] = '#';
        chamber[position[1] + 2][position[0]] = '#';
        chamber[position[1] + 3][position[0]] = '#';
        break;
      case 4: //shape: █
        position = [2, bottomEdge - 5];
        while (!landed) {
          const jet = jets[currentJet];
          // Moving left/right
          if (jet === '<' && position[0] > 0) {
            if (chamber[position[1]][position[0] - 1] === '.' && chamber[position[1] + 1][position[0] - 1] === '.') position[0]--;
          } else if (jet === '>' && position[0] < 5) {
            if (chamber[position[1]][position[0] + 2] === '.' && chamber[position[1] + 1][position[0] + 2] === '.') position[0]++;
          }
          nextJet();
          // Falling down
          if (position[1] === 3999) { // floor
            landed = true;
          } else if (chamber[position[1] + 2][position[0]] === '.' && chamber[position[1] + 2][position[0] + 1] === '.') {
            position[1]++;
          } else {
            landed = true;
          }
        }
        bottomEdge = Math.min(bottomEdge, position[1]);
        chamber[position[1]][position[0]] = '#';
        chamber[position[1]][position[0] + 1] = '#';
        chamber[position[1] + 1][position[0]] = '#';
        chamber[position[1] + 1][position[0] + 1] = '#';
        break;
      default:
        break;
    }
    nextRock();

    /*
      Part 2 has a ridiculous amount of steps so I prepared a file with a tower visualization and realized that there's a pattern.
      Starting from step 291, the cycle repeats every 1715 steps and during that process, the tower rises by 2616 blocks.
      Unfortunately, this solution applies only to my input, others will probably have different values here.
    */
    if (step === 291) {
      addedPatterns = Math.floor((steps - 291) / 1715);
      step += addedPatterns * 1715;
      continue;
    }
  }

  console.log(chamber.length - bottomEdge + addedPatterns * 2616);
}

// Day 18
const day18_cubes = fs.readFileSync('./2022/day18.txt', 'utf-8').split('\n').map(row => row.split(',').map(Number));

function countSurfaceArea(cubes) {
  const biggestX = Math.max(...cubes.map(c => c[0]));
  const biggestY = Math.max(...cubes.map(c => c[1]));
  const biggestZ = Math.max(...cubes.map(c => c[2]));

  const area = Array(biggestZ + 1).fill('.').map(() => Array(biggestY + 1).fill('.').map(() => Array(biggestX + 1).fill('.')));
  cubes.forEach(([x,y,z]) => {
    area[z][y][x] = '#';
  });

  let exposedSlides = 0;
  cubes.forEach(([x,y,z]) => {
    if (!area[z-1] || area[z-1][y][x] === '.') exposedSlides++;
    if (!area[z+1] || area[z+1][y][x] === '.') exposedSlides++;
    if (!area[z][y-1] || area[z][y-1][x] === '.') exposedSlides++;
    if (!area[z][y+1] || area[z][y+1][x] === '.') exposedSlides++;
    if (!area[z][y][x-1] || area[z][y][x-1] === '.') exposedSlides++;
    if (!area[z][y][x+1] || area[z][y][x+1] === '.') exposedSlides++;
  });

  console.log(exposedSlides);
}

function countWaterReachableArea(cubes) {
  const biggestX = Math.max(...cubes.map(c => c[0]));
  const biggestY = Math.max(...cubes.map(c => c[1]));
  const biggestZ = Math.max(...cubes.map(c => c[2]));

  // Creating a little bigger area so that I can implement path-finding algorithm by moving on the outsides of the cube.
  // Not really efficient as I will have to search paths many times but well xD
  const area = Array(biggestZ + 3).fill('.').map(() => Array(biggestY + 3).fill('.').map(() => Array(biggestX + 3).fill('.')));
  cubes.forEach(([x,y,z]) => {
    area[z+1][y+1][x+1] = '#';
  });

  const route = new Graph();
  for (let z = 0; z <= biggestZ + 2; z++) {
    for (let y = 0; y <= biggestY + 2; y++) {
      for (let x = 0; x <= biggestX + 2; x++) {
        if (area[z][y][x] === '#') continue;
        const from = `${x},${y},${z}`;
        const to = new Map();

        if (area[z-1] && area[z-1][y][x] === '.') to.set(`${x},${y},${z-1}`, 1);
        if (area[z+1] && area[z+1][y][x] === '.') to.set(`${x},${y},${z+1}`, 1);
        if (area[z][y-1] && area[z][y-1][x] === '.') to.set(`${x},${y-1},${z}`, 1);
        if (area[z][y+1] && area[z][y+1][x] === '.') to.set(`${x},${y+1},${z}`, 1);
        if (area[z][y][x-1] && area[z][y][x-1] === '.') to.set(`${x-1},${y},${z}`, 1);
        if (area[z][y][x+1] && area[z][y][x+1] === '.') to.set(`${x+1},${y},${z}`, 1);

        route.addNode(from, to);
      }
    }
  }

  let exposedSlides = 0;
  cubes.forEach(([x,y,z]) => {
    x++;
    y++;
    z++;
    if (area[z-1][y][x] === '.' && route.path('0,0,0', `${x},${y},${z-1}`)) exposedSlides++;
    if (area[z+1][y][x] === '.' && route.path('0,0,0', `${x},${y},${z+1}`)) exposedSlides++;
    if (area[z][y-1][x] === '.' && route.path('0,0,0', `${x},${y-1},${z}`)) exposedSlides++;
    if (area[z][y+1][x] === '.' && route.path('0,0,0', `${x},${y+1},${z}`)) exposedSlides++;
    if (area[z][y][x-1] === '.' && route.path('0,0,0', `${x-1},${y},${z}`)) exposedSlides++;
    if (area[z][y][x+1] === '.' && route.path('0,0,0', `${x+1},${y},${z}`)) exposedSlides++;
  });

  console.log(exposedSlides);
}

// Day 19
const day19_blueprints = fs.readFileSync('./2022/day19.txt', 'utf-8').split('\n');

const produceResources = (robots, currentResources) => {
  return {
    ore: currentResources.ore + robots.ore,
    clay: currentResources.clay + robots.clay,
    obsidian: currentResources.obsidian + robots.obsidian,
    geode: currentResources.geode + robots.geode,
  }
}

function produceGeodes(blueprints, robotsToCheck, minutes, toConsole) {
  const robotsCosts = blueprints.map(b => {
    const v = b.match(/[0-9]+/g).map(Number);
    return {
      ore: [v[1], 0, 0],
      clay: [v[2], 0, 0],
      obsidian: [v[3], v[4] ,0],
      geode: [v[5], 0, v[6]],
    }
  });

  let quality = 0;
  let multiply = 1;

  for (let robot = 0; robot < robotsToCheck; robot++) {
    // console.log('robot: ' + robot);
    const queue = { 1: [{
      robots: { ore: 1, clay: 0, obsidian: 0, geode: 0 },
      resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    }] };

    const savedSettings = [];
    let time = 1;
    let maxGeodes = 0;
    const clearQueue = () => {
      queue[time].shift();
      if (queue[time].length === 0) {
        delete queue[time];
        time++;
        if (queue[time] && time >= 10) {
          queue[time].sort((a,b) =>
          b.resources.geode - a.resources.geode ||
          b.robots.geode - a.robots.geode ||
          b.resources.obsidian - a.resources.obsidian ||
          b.robots.obsidian - a.robots.obsidian ||
          b.resources.clay - a.resources.clay ||
          b.robots.clay - a.robots.clay ||
          b.resources.ore - a.resources.ore ||
          b.robots.ore - a.robots.ore);
          queue[time].splice(minutes < 30 ? 200 : 750);
        }
      }
    }

    while (time <= minutes + 1) {
      if (!queue[time]) {
        time++;
        continue;
      }

      const thisMove = queue[time][0];
      maxGeodes = Math.max(maxGeodes, thisMove.resources.geode);
      if (time === minutes + 1) { //Only gather geodes
        clearQueue();
        continue;
      }

      const collectionData = JSON.stringify([ thisMove.robots, thisMove.resources ]);
      if (savedSettings.includes(collectionData)) {
        clearQueue();
        continue;
      }
      savedSettings.push(collectionData);
      const costs = robotsCosts[robot];

      if (!queue[time + 1]) queue[time + 1] = [];
      // Robot creation
      if (thisMove.resources.ore >= costs.geode[0] && thisMove.resources.obsidian >= costs.geode[2]) {
        const resAfterProduce = { ...thisMove.resources, ore: thisMove.resources.ore - costs.geode[0], obsidian: thisMove.resources.obsidian - costs.geode[2] }
        queue[time + 1].push({
          robots: { ...thisMove.robots, geode: thisMove.robots.geode + 1 },
          resources: produceResources(thisMove.robots, resAfterProduce),
        });
      }
      if (thisMove.resources.ore >= costs.obsidian[0] && thisMove.resources.clay >= costs.obsidian[1]) {
        const resAfterProduce = { ...thisMove.resources, ore: thisMove.resources.ore - costs.obsidian[0], clay: thisMove.resources.clay - costs.obsidian[1] }
        queue[time + 1].push({
          robots: { ...thisMove.robots, obsidian: thisMove.robots.obsidian + 1 },
          resources: produceResources(thisMove.robots, resAfterProduce),
        });
      }
      if (thisMove.resources.ore >= costs.clay[0]) {
        const resAfterProduce = { ...thisMove.resources, ore: thisMove.resources.ore - costs.clay[0] }
        queue[time + 1].push({
          robots: { ...thisMove.robots, clay: thisMove.robots.clay + 1 },
          resources: produceResources(thisMove.robots, resAfterProduce),
        });
      }
      if (thisMove.resources.ore >= costs.ore[0]) {
        const resAfterProduce = { ...thisMove.resources, ore: thisMove.resources.ore - costs.ore[0] }
        queue[time + 1].push({
          robots: { ...thisMove.robots, ore: thisMove.robots.ore + 1 },
          resources: produceResources(thisMove.robots, resAfterProduce),
        });
      }
      // Don't create robot, just gather resources
      queue[time + 1].push({
        robots: { ...thisMove.robots },
        resources: produceResources(thisMove.robots, thisMove.resources),
      });
    }

    // console.log('collected geodes: ' + maxGeodes);
    quality += (robot + 1) * maxGeodes;
    multiply *= maxGeodes;
  }

  if (toConsole === 'quality') console.log(quality);
  else console.log(multiply);
}

// Day 20
const day20_nums = fs.readFileSync('./2022/day20.txt', 'utf-8').split('\n').map(Number);

function mixNumbers(nums, withDecryption = false) {
  const decryptedNums = nums.map((value, id) => (
    { id, value: withDecryption ? value * 811589153 : value }
  ));

  const mixes = withDecryption ? 10 : 1;
  for (let mixedCount = 1; mixedCount <= mixes; mixedCount++) {
    for (let x = 0; x < nums.length; x++) {
      const numId = decryptedNums.findIndex(num => num.id === x);
      const [numToMove] = decryptedNums.splice(numId, 1);
      const newId = (numId + numToMove.value) % decryptedNums.length;
      decryptedNums.splice(newId, 0, numToMove);
    }
  }

  const zeroId = decryptedNums.findIndex(num => num.value === 0);
  const x = decryptedNums[(zeroId + 1000) % decryptedNums.length].value
  const y = decryptedNums[(zeroId + 2000) % decryptedNums.length].value
  const z = decryptedNums[(zeroId + 3000) % decryptedNums.length].value
  console.log(x + y + z);
}

// Day 21
const day21_monkeys = fs.readFileSync('./2022/day21.txt', 'utf-8').split('\n');
// JS can't properly handle big numbers from part 2, so I had to use this library:
const D = require('decimal.js');

function yellMonkeyNumbers(monkeyNumbers) {
  const monkeys = monkeyNumbers.map(row => row.split(': '));
  let root;

  while (!root) {
    monkeys.forEach(m => {
       if (!Number.isNaN(Number(m[1]))) return;
      const values = m[1].match(/[a-z]+/g)
      const m1 = Number(monkeys.find(mon => mon[0] === values[0])[1]);
      const m2 = Number(monkeys.find(mon => mon[0] === values[1])[1]);
      if (!Number.isInteger(m1) || !Number.isInteger(m2)) return;
      const operation = m[1].split(' ')[1];
      m[1] = eval(`${m1} ${operation} ${m2}`);
      if (m[0] === 'root') root = m[1];
    })
  }
  console.log(root);
}

function yellNumberForMonkeys(monkeyNumbers) {
  let humn = 0;
  let toAchieve;
  const results = [];

  // Check first 2 values of humn to check how much compared numbers are changing
  while (humn < 2) {
    const monkeys = monkeyNumbers.map(row => row.split(': '));
    const humnId = monkeys.findIndex(mon => mon[0] === 'humn');
    monkeys[humnId][1] = humn;

    let rootChecked;
    while (!rootChecked) {
      monkeys.forEach(m => {
        if (!Number.isNaN(Number(m[1]))) return;
        const values = m[1].match(/[a-z]+/g)
        const m1 = Number(monkeys.find(mon => mon[0] === values[0])[1]);
        const m2 = Number(monkeys.find(mon => mon[0] === values[1])[1]);
        if (Number.isNaN(m1) || Number.isNaN(m2)) return;
        if (m[0] !== 'root') {
          const operation = m[1].split(' ')[1];
          m[1] = eval(`${m1} ${operation} ${m2}`);
        } else {
          toAchieve = m2;
          results.push(m1);
          rootChecked = true
        }
      })
    }
    humn++;
  }

  // Get desired humn value from calculated difference
  const diffBetwenHumn = new D(results[0]).sub(results[1]);
  const desiredHumn = new D(results[0]).sub(toAchieve).div(diffBetwenHumn);
  console.log(desiredHumn.toNumber());
}

// Day 22
let [day22_board, day22_path] = fs.readFileSync('./2022/day22.txt', 'utf-8').split('\n\n');
day22_board = day22_board.split('\n').map(row => row.split(''));

function getPasswordFromWeirdMap(board, path) {
  const position = [board[0].indexOf('.'), 0];
  let dir = 0;
  const steps = path.match(/[0-9]+/g).map(Number);
  const turns = path.match(/[A-Z]+/g);

  for (let step = 0; step < steps.length; step++) {
    for (let x = 1; x <= steps[step]; x++) {
      if (dir === 0) {
        const nextStep = board[position[1]][position[0] + 1];
        if (nextStep === '#') break;
        else if (nextStep === '.') position[0]++;
        else {
          const afterWrap = board[position[1]].indexOf('.');
          if (afterWrap === 0 || board[position[1]][afterWrap - 1] !== '#') position[0] = afterWrap;
          else break;
        }
      }
      if (dir === 1) {
        const nextStep = board[position[1] + 1] ? board[position[1] + 1][position[0]] : undefined;
        if (nextStep === '#') break;
        else if (nextStep === '.') position[1]++;
        else {
          const afterWrap = board.map(row => row[position[0]]).indexOf('.');
          if (afterWrap === 0 || board[afterWrap - 1][position[0]] !== '#') position[1] = afterWrap;
          else break;
        }
      }
      if (dir === 2) {
        const nextStep = board[position[1]][position[0] - 1];
        if (nextStep === '#') break;
        else if (nextStep === '.') position[0]--;
        else {
          const afterWrap = board[position[1]].lastIndexOf('.');
          if (board[position[1]][afterWrap + 1] !== '#') position[0] = afterWrap;
          else break;
        }
      }
      if (dir === 3) {
        const nextStep = board[position[1] - 1] ? board[position[1] - 1][position[0]] : undefined;
        if (nextStep === '#') break;
        else if (nextStep === '.') position[1]--;
        else {
          const afterWrap = board.map(row => row[position[0]]).lastIndexOf('.');
          if (!board[afterWrap + 1] || board[afterWrap + 1][position[0]] !== '#') position[1] = afterWrap;
          else break;
        }
      }
    }

    if (step !== steps.length - 1) { //there's one less turn than steps
      if (turns[step] === 'R') dir = (dir + 1) % 4;
      else {
        if (dir === 0) dir = 3;
        else dir--;
      }
    }
  }

  console.log((position[1] + 1) * 1000 + (position[0] + 1) * 4 + dir)
}

function getPasswordFromCubeMap(board, path) {
  let position = { x: board[0].indexOf('.'), y: 0 };
  let dir = 0;
  const steps = path.match(/[0-9]+/g).map(Number);
  const turns = path.match(/[A-Z]+/g);
  /* Marking Cubes as follows:
    .TR
    .F.
    LB.
    K..
  */

  for (let step = 0; step < steps.length; step++) {
    for (let x = 1; x <= steps[step]; x++) {
      let nextPosition;
      let nextDir = dir;
      if (dir === 0) { // right
        if (position.x === 149 && position.y < 50) { nextPosition = { x: 99, y: 149 - position.y }; nextDir = 2 } // R to B
        else if (position.x === 99 && position.y >= 50 && position.y < 100) { nextPosition = { x: position.y + 50, y: 49 }; nextDir = 3 } // F to R
        else if (position.x === 99 && position.y >= 100 && position.y < 150) { nextPosition = { x: 149, y: Math.abs(position.y - 149) }; nextDir = 2 } // B to R
        else if (position.x === 49 && position.y >= 150) { nextPosition = { x: position.y - 100, y: 149 }; nextDir = 3 } // K to B
        else { nextPosition = { x: position.x + 1, y: position.y } }

        const nextStep = board[nextPosition.y][nextPosition.x];
        if (nextStep === '#') break;
      }
      if (dir === 1) { // down
        if (position.y === 199 && position.x < 50) { nextPosition = { x: position.x + 100, y: 0 } } // K to R
        else if (position.y === 149 && position.x >= 50 && position.x < 100) { nextPosition = { x: 49, y: position.x + 100 }; nextDir = 2 } // B to K
        else if (position.y === 49 && position.x >= 100) { nextPosition = { x: 99, y: position.x - 50 }; nextDir = 2 } // R to F
        else { nextPosition = { x: position.x, y: position.y + 1 } }

        const nextStep = board[nextPosition.y][nextPosition.x];
        if (nextStep === '#') break;
      }
      if (dir === 2) { // left
        if (position.x === 50 && position.y < 50) { nextPosition = { x: 0, y: 149 - position.y }; nextDir = 0 } // T to L
        else if (position.x === 50 && position.y >= 50 && position.y < 100) { nextPosition = { x: position.y - 50, y: 100 }; nextDir = 1 } // F to L
        else if (position.x === 0 && position.y >= 100 && position.y < 150) { nextPosition = { x: 50, y: Math.abs(position.y - 149) }; nextDir = 0 } // L to T
        else if (position.x === 0 && position.y >= 150) { nextPosition = { x: position.y - 100, y: 0 }; nextDir = 1 } // K to T
        else { nextPosition = { x: position.x - 1, y: position.y } }

        const nextStep = board[nextPosition.y][nextPosition.x];
        if (nextStep === '#') break;
      }
      if (dir === 3) { // up
        if (position.y === 100 && position.x < 50) { nextPosition = { x: 50, y: position.x + 50 }; nextDir = 0 } // L to F
        else if (position.y === 0 && position.x >= 50 && position.x < 100) { nextPosition = { x: 0, y: position.x + 100 }; nextDir = 0 } // T to K
        else if (position.y === 0 && position.x >= 100) { nextPosition = { x: position.x - 100, y: 199 }; } // R to K
        else { nextPosition = { x: position.x, y: position.y - 1 } }

        const nextStep = board[nextPosition.y][nextPosition.x];
        if (nextStep === '#') break;
      }
      dir = nextDir;
      position = nextPosition;
    }

    if (step !== steps.length - 1) { //there's one less turn than steps
      if (turns[step] === 'R') dir = (dir + 1) % 4;
      else {
        if (dir === 0) dir = 3;
        else dir--;
      }
    }
  }

  console.log((position.y + 1) * 1000 + (position.x + 1) * 4 + dir)
}

// Day 23
const day23_grove = fs.readFileSync('./2022/day23.txt', 'utf-8').split('\n').map(row => row.split(''));

function moveElvesWithPlants(grove) {
  const elves = [];
  const elvesPositions = [];

  for (let y = 0; y < grove.length; y++) {
    for (let x = 0; x < grove[0].length; x++) {
      if (grove[y][x] === '#') {
        elves.push({ position: [x, y], proposition: null });
        elvesPositions.push(`${x},${y}`);
      }
    }
  }

  elvesMoved = 2137; // random number so `while` will work in the first iteration
  let roundsPassed = 0;
  const order = ['N', 'S', 'W', 'E'];
  while (elvesMoved > 0) {
    const elvesProposals = [];
    elves.forEach(elf => {
      const neighbours = [];
      if (elvesPositions.includes(`${elf.position[0]},${elf.position[1]-1}`)) neighbours.push('N');
      if (elvesPositions.includes(`${elf.position[0]+1},${elf.position[1]-1}`)) neighbours.push('NE');
      if (elvesPositions.includes(`${elf.position[0]+1},${elf.position[1]}`)) neighbours.push('E');
      if (elvesPositions.includes(`${elf.position[0]+1},${elf.position[1]+1}`)) neighbours.push('SE');
      if (elvesPositions.includes(`${elf.position[0]},${elf.position[1]+1}`)) neighbours.push('S');
      if (elvesPositions.includes(`${elf.position[0]-1},${elf.position[1]+1}`)) neighbours.push('SW');
      if (elvesPositions.includes(`${elf.position[0]-1},${elf.position[1]}`)) neighbours.push('W');
      if (elvesPositions.includes(`${elf.position[0]-1},${elf.position[1]-1}`)) neighbours.push('NW');

      if (neighbours.length === 0 || neighbours.length === 8) return;
      for (let o = 0; o < 4; o++) {
        if (order[o] === 'N') {
          if (!neighbours.includes('N') && !neighbours.includes('NE') && !neighbours.includes('NW')) {
            elvesProposals.push(`${elf.position[0]},${elf.position[1]-1}`);
            elf.proposition = [elf.position[0], elf.position[1]-1];
            break;
          }
        } else if (order[o] === 'S') {
          if (!neighbours.includes('S') && !neighbours.includes('SE') && !neighbours.includes('SW')) {
            elvesProposals.push(`${elf.position[0]},${elf.position[1]+1}`);
            elf.proposition = [elf.position[0], elf.position[1]+1];
            break;
          }
        } else if (order[o] === 'W') {
          if (!neighbours.includes('W') && !neighbours.includes('NW') && !neighbours.includes('SW')) {
            elvesProposals.push(`${elf.position[0]-1},${elf.position[1]}`);
            elf.proposition = [elf.position[0]-1, elf.position[1]];
            break;
          }
        } else if (order[o] === 'E') {
          if (!neighbours.includes('E') && !neighbours.includes('NE') && !neighbours.includes('SE')) {
            elvesProposals.push(`${elf.position[0]+1},${elf.position[1]}`);
            elf.proposition = [elf.position[0]+1, elf.position[1]];
            break;
          }
        }
      }
    });

    elvesMoved = 0;
    elvesPositions.splice(0);
    elves.forEach(elf => {
      if (elf.proposition) {
        if (elvesProposals.filter(p => p === elf.proposition.join(',')).length === 1) {
          elf.position = [...elf.proposition];
          elvesMoved++;
          elf.proposition = null;
        } else {
          elf.proposition = null;
        }
      }
      elvesPositions.push(`${elf.position[0]},${elf.position[1]}`);
    });

    const ordToMove = order.shift();
    order.push(ordToMove);
    roundsPassed++;

    if (roundsPassed === 10) { // Part 1
      const boundaries = [
        Math.min(...elves.map(e => e.position[0])),
        Math.max(...elves.map(e => e.position[0])),
        Math.min(...elves.map(e => e.position[1])),
        Math.max(...elves.map(e => e.position[1])),
      ]; //smX, bgX, smY, bgY
      console.log((boundaries[1] - boundaries[0] + 1) * [boundaries[3] - boundaries[2] + 1] - elves.length);
    }
  }

  console.log(roundsPassed);
}

// Day 24
const day24_map = fs.readFileSync('./2022/day24.txt', 'utf-8').split('\n').map(row => row.split(''));

function avoidBlizzards(map) {
  const area = Array(map.length).fill('.').map(() => Array(map[0].length).fill('.'));
  const blizzards = [];
  const startingBlizzardPositions = new Set();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') area[y][x] = '#';
      else if (map[y][x] === '^') blizzards.push({ position: [x, y], direction: 'U' });
      else if (map[y][x] === 'v') blizzards.push({ position: [x, y], direction: 'D' });
      else if (map[y][x] === '<') blizzards.push({ position: [x, y], direction: 'L' });
      else if (map[y][x] === '>') blizzards.push({ position: [x, y], direction: 'R' });

      if (map[y][x] !== '.' && map[y][x] !== '#') startingBlizzardPositions.add([x,y].join(','));
    }
  }

  let queue = { 0: [{
    position: [1, 0],
    blizzards: JSON.parse(JSON.stringify(blizzards)),
  }] };
  const savedSettings = [];
  let time = 0;
  let endReached = false;
  let startReached = false;
  let secondEndReached = false;

  const clearQueue = () => {
    queue[time].shift();
    if (queue[time].length === 0) {
      delete queue[time];
      time++;
      if (!endReached && queue[time]) {
        queue[time].sort((a,b) => (b.position[0] + b.position[1]) - (a.position[0] + a.position[1]));
        queue[time].splice(200)
      } else if (!startReached && queue[time]) {
        queue[time].sort((a,b) => (a.position[0] + a.position[1]) - (b.position[0] + b.position[1]));
        queue[time].splice(200)
      } else if (!secondEndReached && queue[time]) {
        queue[time].sort((a,b) => (b.position[0] + b.position[1]) - (a.position[0] + a.position[1]));
        queue[time].splice(200)
      }
    }
  }

  const savedBlizzards = [{ blizzards: JSON.parse(JSON.stringify(blizzards)), positions: startingBlizzardPositions }];
  const getBlizzardsForCurrentTime = () => {
    if (savedBlizzards[time + 1]) return savedBlizzards[time + 1];

    const blizzardPositions = new Set();
    const updatedBlizzards = JSON.parse(JSON.stringify(savedBlizzards[time].blizzards));
    updatedBlizzards.forEach(b => {
      if (b.direction === 'U') {
        b.position[1]--;
        if (b.position[1] === 0) b.position[1] = area.length - 2;
      } else if (b.direction === 'D') {
        b.position[1]++;
        if (b.position[1] === area.length - 1) b.position[1] = 1;
      } else if (b.direction === 'L') {
        b.position[0]--;
        if (b.position[0] === 0) b.position[0] = area[0].length - 2;
      } else if (b.direction === 'R') {
        b.position[0]++;
        if (b.position[0] === area[0].length - 1) b.position[0] = 1;
      }
      blizzardPositions.add(b.position.join(','));
    });
    const obj = { blizzards: updatedBlizzards, positions: blizzardPositions };
    savedBlizzards.push(obj);
    return obj;
  }

  const makeMovesThroughBlizzard = (thisMove) => {
    const bData = getBlizzardsForCurrentTime();

    const blizzardPositions = bData.positions;
    const updatedBlizzards = bData.blizzards;

    if (!blizzardPositions.has(thisMove.position.join(','))) {
      // Can wait without moving
      queue[time + 1].push({ ...thisMove, blizzards: updatedBlizzards, });
    }
    if (area[thisMove.position[1]][thisMove.position[0] - 1] === '.' &&
        !blizzardPositions.has([thisMove.position[0] - 1, thisMove.position[1]].join(','))) {
      queue[time + 1].push({ blizzards: updatedBlizzards, position: [thisMove.position[0] - 1, thisMove.position[1]] });
    }
    if (area[thisMove.position[1]][thisMove.position[0] + 1] === '.' &&
        !blizzardPositions.has([thisMove.position[0] + 1, thisMove.position[1]].join(','))) {
      queue[time + 1].push({ blizzards: updatedBlizzards, position: [thisMove.position[0] + 1, thisMove.position[1]] });
    }
    if (area[thisMove.position[1] - 1] && area[thisMove.position[1] - 1][thisMove.position[0]] === '.' &&
        !blizzardPositions.has([thisMove.position[0], thisMove.position[1] - 1].join(','))) {
      queue[time + 1].push({ blizzards: updatedBlizzards, position: [thisMove.position[0], thisMove.position[1] - 1] });
    }
    if (area[thisMove.position[1] + 1] && area[thisMove.position[1] + 1][thisMove.position[0]] === '.' &&
        !blizzardPositions.has([thisMove.position[0], thisMove.position[1] + 1].join(','))) {
      queue[time + 1].push({ blizzards: updatedBlizzards, position: [thisMove.position[0], thisMove.position[1] + 1] });
    }
  }

  let endData;
  while(!endReached) {
    const thisMove = queue[time][0];
    if (thisMove.position.join(',') === `${area[0].length - 2},${area.length - 1}`) {
      endReached = true;
      endData = thisMove;
      break;
    }

    const moveData = JSON.stringify(thisMove);
    if (savedSettings.includes(moveData)) {
      clearQueue();
      continue;
    }
    savedSettings.push(moveData);

    if (!queue[time + 1]) queue[time + 1] = [];
    makeMovesThroughBlizzard(thisMove);
    clearQueue();
  }

  console.log('Part 1:');
  console.log(time);

  savedSettings.splice(0);
  queue = { [time]: [endData] };
  let startData;
  while(!startReached) {
    const thisMove = queue[time][0];
    if (thisMove.position.join(',') === '1,0') {
      startReached = true;
      startData = thisMove;
      break;
    }

    const moveData = JSON.stringify(thisMove);
    if (savedSettings.includes(moveData)) {
      clearQueue();
      continue;
    }
    savedSettings.push(moveData);

    if (!queue[time + 1]) queue[time + 1] = [];
    makeMovesThroughBlizzard(thisMove);
    clearQueue();
  }

  savedSettings.splice(0);
  queue = { [time]: [startData] };
  while(!secondEndReached) {
    const thisMove = queue[time][0];
    if (thisMove.position.join(',') === `${area[0].length - 2},${area.length - 1}`) {
      secondEndReached = true;
      break;
    }

    const moveData = JSON.stringify(thisMove);
    if (savedSettings.includes(moveData)) {
      clearQueue();
      continue;
    }
    savedSettings.push(moveData);

    if (!queue[time + 1]) queue[time + 1] = [];
    makeMovesThroughBlizzard(thisMove);
    clearQueue();
  }

  console.log('Part 2:');
  console.log(time);
}

// Day 25
const day25_snafus = fs.readFileSync('./2022/day25.txt', 'utf-8').split('\n');

function sumSNAFUNumbers(data) {
  let decimalSum = 0;

  data.forEach(num => {
    num = num.split('').reverse();
    let multipler = 1;
    for (let x = 0; x < num.length; x++) {
      const dec = num[x] === '=' ? -2 : num[x] === '-' ? -1 : Number(num[x]);
      decimalSum += (dec * multipler);
      multipler *= 5;
    }
  });

  const decToSnafu = ['00', '01', '02', '1=', '1-', '10', '11', '12', '2=', '2-', '20'];

  const snafuNum = decimalSum.toString(5).split('').map(Number);
  for (let x = snafuNum.length - 1; x >=0; x--) {
    if (snafuNum[x] >= 3) {
      const converted = decToSnafu[snafuNum[x]];
      snafuNum[x] = converted[1];
      if (x > 0) {
        snafuNum[x - 1] += Number(converted[0]);
      } else {
        snafuNum.unshift(Number(converted[0]));
      }
    }
  }

  console.log(snafuNum.join(''));
}


// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1 & 2:');
// findElvesWithBiggestFood(day1_foods);

// console.log('Day 2, part 1:');
// playRockPaperScissors(day2_moves);
// console.log('Day 2, part 1:');
// playRockPaperScissorsDifferentStrategy(day2_moves);

// console.log('Day 3, part 1:');
// findRepeatsIncompartments(day3_rucksacks);
// console.log('Day 3, part 2:');
// findRepeatsInGroup(day3_rucksacks);

// console.log('Day 4, part 1 & 2:');
// findOverlapingSections(day4_ranges);

// console.log('Day 5, part 1:');
// moveCrates(day5_crates, day5_moves);
// console.log('Day 5, part 2:');
// moveCratesWithCrateMover9001(day5_crates, day5_moves);

// console.log('Day 6, part 1:');
// findStartOfMarker(day6_signal, 4);
// console.log('Day 6, part 2:');
// findStartOfMarker(day6_signal, 14);

// console.log('Day 7, part 1 & 2:');
// executeCommandsAndFreeSpace(day7_commands);

// console.log('Day 8, part 1:');
// countVisibleTrees(day8_trees);
// console.log('Day 8, part 2:');
// findTreeWithNiceView(day8_trees);

// console.log('Day 9, part 1:');
// moveTailOfRope(day9_moves, 1);
// console.log('Day 9, part 2:');
// moveTailOfRope(day9_moves, 9);

// console.log('Day 10, part 1 & 2:');
// getSignalStrengthsAndPrintOutput(day10_operations);

// console.log('Day 11, part 1:');
// getItemsFromMonkeys(day11_monkeys);
// console.log('Day 11, part 2:');
// getItemsFromMonkeysBeingWorried(day11_monkeys);

// console.log('Day 12, part 1 & 2:');
// findShortestTrail(day12_area);

// console.log('Day 13, part 1:');
// countOrderedArrays(day13_pairs);
// console.log('Day 13, part 2:');
// sortArrays(day13_pairs);

// console.log('Day 14, part 1:');
// simulateSandFlow(day14_rocks);
// console.log('Day 14, part 2:');
// simulateSandFlow(day14_rocks, true);

// console.log('Day 15, part 1:');
// countNoBeaconFieldsInRow(day15_scanners, 2000000);
// console.log('Day 15, part 2 (this will take a few seconds):');
// findDistressBeacon(day15_scanners, 4000000);

// console.log('Day 16, part 1:');
// releaseTheMostPressure(day16_valves);
// console.log('Day 16, part 2:');
// releaseTheMostPressureWithElephant(day16_valves);

// console.log('Day 17, part 1:');
// watchFallingRocks(day17_jets, 2022);
// console.log('Day 17, part 2:');
// watchFallingRocks(day17_jets, 1000000000000);

// console.log('Day 18, part 1:');
// countSurfaceArea(day18_cubes);
// console.log('Day 18, part 2 (this will take about 2 minutes):');
// countWaterReachableArea(day18_cubes);

// console.log('Day 19, part 1:');
// produceGeodes(day19_blueprints, day19_blueprints.length, 24, 'quality');
// console.log('Day 19, part 2:');
// produceGeodes(day19_blueprints, 3, 32, 'multiply');

// console.log('Day 20, part 1:');
// mixNumbers(day20_nums);
// console.log('Day 20, part 2:');
// mixNumbers(day20_nums, true);

// console.log('Day 21, part 1:');
// yellMonkeyNumbers(day21_monkeys);
// console.log('Day 21, part 2:');
// yellNumberForMonkeys(day21_monkeys);

// console.log('Day 22, part 1:');
// getPasswordFromWeirdMap(day22_board, day22_path);
// console.log('Day 22, part 2:');
// getPasswordFromCubeMap(day22_board, day22_path);

// console.log('Day 23, part 1 & 2 (second part will take ~4-5 minutes):');
// moveElvesWithPlants(day23_grove);

// console.log('Day 24, part 1 & 2 (this will take ~3-4 minutes):');
// avoidBlizzards(day24_map);

// console.log('Day 25:');
// sumSNAFUNumbers(day25_snafus);
