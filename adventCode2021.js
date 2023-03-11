const fs = require("fs");

//Day 1
const day1_numbers = fs.readFileSync('./2021/day1.txt', 'utf-8').split('\n').map(Number);

function countIncrease(nums) {
  let count = 0
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) count++;
  }
  console.log(count);
}

function makeTriples(nums) {
  const triples = [];
  for (let i = 2; i < nums.length; i++) {
    triples.push(nums[i - 2] + nums[i - 1] + nums[i]);
  }
  return triples;
}

//Day 2
const day2_navs = fs.readFileSync('./2021/day2.txt', 'utf-8').split('\n');

function getCoordinates(navs) {
  const coordinates = {
    horizontal: 0,
    depth: 0
  };
  navs.forEach(nav => {
    const [command, value] = nav.split(' ');
    if (command === "forward") {
      coordinates.horizontal += Number(value);
    } else if (command === "down") {
      coordinates.depth += Number(value);
    } else {
      coordinates.depth -= Number(value);
    }
  })
  console.log(coordinates.horizontal * coordinates.depth);
}

function getBetterCoordinates(navs) {
  const coordinates = {
    horizontal: 0,
    depth: 0,
    aim: 0
  };
  navs.forEach(nav => {
    const [command, value] = nav.split(' ');
    if (command === "forward") {
      coordinates.horizontal += Number(value);
      coordinates.depth += (value * coordinates.aim);
    } else if (command === "down") {
      coordinates.aim += Number(value);
    } else {
      coordinates.aim -= Number(value);
    }
  })
  console.log(coordinates.horizontal * coordinates.depth);
}

//Day 3
const day3_codes = fs.readFileSync('./2021/day3.txt', 'utf-8').split('\n');

function calcPowerConsumption(codes) {
  const code = [];
  let filteredCodes = codes;
  for (let i = 0; i < codes[1].length; i++) {
    let zeros = 0;
    let ones = 0;
    filteredCodes.forEach(code => {
      Number(code[i]) === 1 ? ones++ : zeros++;
    })
    zeros > ones ? code.push(0) : code.push(1)
  }
  const reversedCode = code.map(n => n === 1 ? 0 : 1);
  console.log(parseInt(Number(code.join('')), 2) * parseInt(Number(reversedCode.join('')), 2));
}

function oxygenRating(codes) {
  const code = [];
  let filteredCodes = codes;
  for (let i = 0; i < codes[1].length; i++) {
    let zeros = 0;
    let ones = 0;
    filteredCodes.forEach(code => {
      Number(code[i]) === 1 ? ones++ : zeros++;
    })
    zeros > ones ? code.push(0) : code.push(1)
    filteredCodes = filteredCodes.filter(c =>
      Number(c[i]) === code[i]);
    if (filteredCodes.length === 1) break;
  }
  const oxygen = codes.find(c => c.startsWith(code.join('')))
  return parseInt(Number(oxygen), 2)
}

function scrubberRating(codes) {
  const code = [];
  let filteredCodes = codes;
  for (let i = 0; i < codes[1].length; i++) {
    let zeros = 0;
    let ones = 0;
    filteredCodes.forEach(code => {
      Number(code[i]) === 1 ? ones++ : zeros++;
    })
    zeros > ones ? code.push(1) : code.push(0)
    filteredCodes = filteredCodes.filter(c =>
      Number(c[i]) === code[i]);
    if (filteredCodes.length === 1) break;
  }
  const scrubber = codes.find(c => c.startsWith(code.join('')))
  return parseInt(Number(scrubber), 2)
}

//Day 4
const day4_numbers = fs.readFileSync('./2021/day4_numbers.txt', 'utf-8').split(',').map(Number);
const day4_boards = fs.readFileSync('./2021/day4_boards.txt', 'utf-8').split('\n\n').map(board => board.replace(/\s+/g,' ').trim().split(' '));

function playBingoToWin(boards, numbers) {
  let winningNumber, winningBoard;
  const boardsToPlay = [];

  boards.forEach(board => {
    const currentBoard = Array(5).fill(0).map(() => Array(5).fill(0));
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        currentBoard[i][j] = Number(board[5 * i + j])
      }
    }
    boardsToPlay.push(currentBoard);
  })

  for (let num of numbers) {
    boardsToPlay.forEach((board, boardID) => {
      //cross number
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (board[i][j] === num) board[i][j] = "x";
        }
      }

      //check rows
      for (let i = 0; i < 5; i++) {
        if (board[i].every(f => f === "x") && !winningNumber) {
          winningBoard = boardID;
          winningNumber = num;
        }
      }

      //check columns
      const reversedBoard = Array(5).fill(0).map(() => Array(5).fill(0));
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          reversedBoard[i][j] = board[j][i];
        }
        if (reversedBoard[i].every(f => f === "x") && !winningNumber) {
          winningBoard = boardID;
          winningNumber = num;
        }
      }
    });
    if (winningNumber) {
      break;
    }
  }

  console.log(boardsToPlay[winningBoard]);
  let score = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (boardsToPlay[winningBoard][i][j] !== 'x') score += boardsToPlay[winningBoard][i][j]
    }
  }
  score *= winningNumber
  console.log(score);
}

function playBingoToLose(boards, numbers) {
  let lastWinningNumber, lastWinningBoard;
  let boardsCrossed = [];
  const boardsToPlay = [];

  boards.forEach(board => {
    const currentBoard = Array(5).fill(0).map(() => Array(5).fill(0));
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        currentBoard[i][j] = Number(board[5 * i + j])
      }
    }
    boardsToPlay.push(currentBoard);
  })

  for (let num of numbers) {
    boardsToPlay.forEach((board, boardID) => {
      if (boardsCrossed.includes(boardID)) return;

      //cross number
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (board[i][j] === num) board[i][j] = "x";
        }
      }

      //check rows
      for (let i = 0; i < 5; i++) {
        if (board[i].every(f => f === "x")) {
          lastWinningBoard = boardID;
          lastWinningNumber = num;
          if (!boardsCrossed.includes(boardID)) boardsCrossed.push(boardID);
        }
      }

      //check columns
      const reversedBoard = Array(5).fill(0).map(() => Array(5).fill(0));
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          reversedBoard[i][j] = board[j][i];
        }
        if (reversedBoard[i].every(f => f === "x")) {
          lastWinningBoard = boardID;
          lastWinningNumber = num;
          if (!boardsCrossed.includes(boardID)) boardsCrossed.push(boardID);
        }
      }
    });
    if (boardsCrossed.length === boards.length) {
      break;
    }
  }

  console.log(boardsToPlay[lastWinningBoard]);
  let score = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (boardsToPlay[lastWinningBoard][i][j] !== 'x') score += boardsToPlay[lastWinningBoard][i][j]
    }
  }
  score *= lastWinningNumber
  console.log(score);
}

//Day 5
const day5_lines = fs.readFileSync('./2021/day5.txt', 'utf-8').split('\n').map(line => line.split(' -> '));

function findDangerousVents(lines, withDiagonals = false) {
    const gridSize = 1000
    const map = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        map[i][j] = 0;
      }
    }
    lines.forEach(line => {
    const x1 = Number(line[0].substring(0, line[0].indexOf(',')));
    const x2 = Number(line[1].substring(0, line[1].indexOf(',')));
    const y1 = Number(line[0].substring(line[0].indexOf(',') + 1));
    const y2 = Number(line[1].substring(line[1].indexOf(',') + 1));
    if (x1 === x2) {
      for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) {
        map[i][x1]++;
      }
      return;
    }
    if (y1 === y2) {
      for (let j = Math.min(x1, x2); j <= Math.max(x1, x2); j++) {
        map[y1][j]++;
      }
      return;
    }
    if (withDiagonals && Math.abs(x1-x2) === Math.abs(y1-y2)) {
      if ((x1 > x2 && y1 > y2) || (x1 <x2 && y1 < y2)) {
        for (let i = 0; i <= Math.abs(x1-x2); i++) {
          map[Math.min(y1, y2) + i][Math.min(x1, x2) + i]++;
        }
      } else {
        for (let i = 0; i <= Math.abs(x1-x2); i++) {
          map[Math.max(y1, y2) - i][Math.min(x1, x2) + i]++;
        }
      }
    }
  });

  let countDangerous = 0;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (map[i][j] > 1) countDangerous++;
    }
  }
  console.log(countDangerous);
}

//Day 6
const day6_fish = fs.readFileSync('./2021/day6.txt', 'utf-8').split(',').map(Number);

function countLanternfish(fish) {
  let fishDays = fish;
  for (let i = 1; i <= 80; i++) {
    let newFish = 0;
    fishDays = fishDays.map(day => {
      if (day > 0) return day-1;
      else {
        newFish++;
        return 6;
      }
    });
    for (let x = 0; x < newFish; x++) {
      fishDays.push(8);
    }
  }
  console.log(fishDays.length);
}

function countLanternfishMoreEfficient(fish) {
  const fishObj = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  fish.forEach(f => {
    fishObj[f]++;
  })
  for (let i = 1; i <= 256; i++) {
    const cache = fishObj[0];
    for (let x = 0; x < 6; x++) {
      fishObj[x] = fishObj[x + 1];
    }
    fishObj[6] = fishObj[7] + cache;
    fishObj[7] = fishObj[8];
    fishObj[8] = cache;
  }
  let count = 0;
  Object.values(fishObj).forEach(f => count += f)
  console.log(count);
}

//Day 7
const day7_positions = fs.readFileSync('./2021/day7.txt', 'utf-8').split(',').map(Number);

function evaluateFuel(positions) {
  const usedFuel = [];
  for (let i = 0; i <= Math.max(...positions); i++) {
    let spentFuel = 0;
    positions.forEach(pos => {
      spentFuel += Math.abs(pos - i)
    })
    usedFuel.push(spentFuel);
  }
  console.log(Math.min(...usedFuel));
}

function evaluateFuel2(positions) {
  const usedFuel = [];
  for (let i = 0; i <= Math.max(...positions); i++) {
    let spentFuel = 0;
    positions.forEach(pos => {
      const steps = Math.abs(pos - i);
      for (x = 1; x <= steps; x++) {
        spentFuel += x;
      }
    })
    usedFuel.push(spentFuel);
  }
  console.log(Math.min(...usedFuel));
}

//Day 8
const day8_digits = fs.readFileSync('./2021/day8.txt', 'utf-8').split('\n');

function checkDigits(outputs) {
  const NAMES_REGEX = /[a-z]+/g;
  let count = 0;
  outputs.forEach(o => {
    const out = o.substring(o.indexOf('|')+2);
    const nums = out.match(NAMES_REGEX);
    nums.forEach(n => {
      if (n.length === 2 || n.length === 3 || n.length === 4 || n.length === 7) {
        count++;
      }
    })
  })
  console.log(count);
}

function decodeDigits(outputs) {
  const NAMES_REGEX = /[a-z]+/g;
  let sum = 0;
  outputs.forEach(o => {
    const inn = o.substring(0, o.indexOf('|')-1);
    const out = o.substring(o.indexOf('|')+2);
    const numsIn = inn.match(NAMES_REGEX);
    const numsOut = out.match(NAMES_REGEX);

    //Finding numbers
    const one = numsIn.find(n => n.length === 2);
    const four = numsIn.find(n => n.length === 4);
    const seven = numsIn.find(n => n.length === 3);
    const eight = numsIn.find(n => n.length === 7);
    const six = numsIn.find(n => n.length === 6 && (!n.includes(one[0]) || !n.includes(one[1])));
    const nine = numsIn.find(n => n.length === 6 && four.split('').every(l => n.includes(l)));
    const zero = numsIn.find(n => n.length === 6 && n !== six && n !== nine);
    const two = numsIn.find(n => n.length === 5 && !n.split('').every(l => nine.includes(l)));
    const three = numsIn.find(n => n.length === 5 && seven.split('').every(l => n.includes(l)));
    const five = numsIn.find(n => n.length === 5 && n !== two && n !== three);
    const nums = [zero, one, two, three, four, five, six, seven, eight, nine].map(num => (
      num.split('').sort().join('')
    ))

    let code = ''
    numsOut.forEach(num => {
      code += nums.indexOf(num.split('').sort().join(''))
    })
    sum += Number(code);
  })

  console.log(sum);
}

//Day 9
const day9_map = fs.readFileSync('./2021/day9.txt', 'utf-8').split('\n').map(row => row.split('').map(Number));

function findLowPoints(map) {
  const lowPoints = [];
  map.forEach((row, rowId) => {
    row.forEach((num, colId) => {
      let up,down,left,right;
      map[rowId-1] !== undefined ? up = map[rowId-1][colId] : up = 99;
      map[rowId+1] !== undefined ? down = map[rowId+1][colId] : down = 99;
      map[rowId][colId-1] !== undefined ? left = map[rowId][colId-1] : left = 99;
      map[rowId][colId+1] !== undefined ? right = map[rowId][colId+1] : right = 99;
      if (num === Math.min(num, up, down, left, right) && num !== up && num !== down && num !== left && num !== right) {
        lowPoints.push(num);
      }
    })
  });
  let count = 0;
  lowPoints.forEach(p => count += p+1)
  console.log(count)
}

function findLowPointsCoords(map) {
  const lowPoints = [];
  map.forEach((row, rowId) => {
    row.forEach((num, colId) => {
      let up,down,left,right;
      map[rowId-1] !== undefined ? up = map[rowId-1][colId] : up = 99;
      map[rowId+1] !== undefined ? down = map[rowId+1][colId] : down = 99;
      map[rowId][colId-1] !== undefined ? left = map[rowId][colId-1] : left = 99;
      map[rowId][colId+1] !== undefined ? right = map[rowId][colId+1] : right = 99;
      if (num === Math.min(num, up, down, left, right) && num !== up && num !== down && num !== left && num !== right) {
        lowPoints.push([getCoordsString(rowId, colId)]);
      }
    })
  });
  return lowPoints;
}

function getCoordsString(row, col) {
  return `${row},${col}`
}

function findBasins(map) {
  const basins = findLowPointsCoords(map);
  basins.forEach(basin => {
    let newPoints = 1;
    while (newPoints > 0) {
      for (let i = basin.length - newPoints; i < basin.length; i++) {
        newPoints = 0;
        const row = Number(basin[i].split(',')[0]);
        const col = Number(basin[i].split(',')[1]);
        //check up
        if (map[row-1] && map[row-1][col] !== 9 && !basin.includes(getCoordsString(row-1, col))) {
          basin.push(getCoordsString(row-1, col));
          newPoints++;
        }
        //check down
          if (map[row+1] && map[row+1][col] !== 9 && !basin.includes(getCoordsString(row+1, col))) {
            basin.push(getCoordsString(row+1, col));
          newPoints++;
        }
        //check left
          if (map[row][col-1] && map[row][col-1] !== 9 && !basin.includes(getCoordsString(row, col-1))) {
            basin.push(getCoordsString(row, col-1));
          newPoints++;
        }
        //check right
        if (map[row][col+1] && map[row][col+1] !== 9 && !basin.includes(getCoordsString(row, col+1))) {
          basin.push(getCoordsString(row, col+1));
          newPoints++;
        }
      }
    }
  })
  let basinsSizes = basins.map(basin => basin.length);
  basinsSizes.sort((a, b) => b - a);
  console.log(basinsSizes[0] * basinsSizes[1] * basinsSizes[2])
}

//Day 10
const day10_chunks = fs.readFileSync('./2021/day10.txt', 'utf-8').split('\n');

function updateClosingArray(currentArr, char) {
  const a = [...currentArr];
  switch (char) {
    case '(':
       a.push(')'); break;
    case '[':
      a.push(']'); break;
    case '{':
       a.push('}'); break;
    case '<':
      a.push('>'); break;
    default:
      break;
  }
  return a;
}

function findError(chunks) {
  let score = 0;
  const points = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  }
  const corruptedChunks = [];
  chunks.forEach(chunk => {
    const closing = ')]}>';
    let shouldClose = [];
    for (let i = 0; i < chunk.length; i++) {
      shouldClose = updateClosingArray(shouldClose, chunk[i]);

      if (shouldClose[shouldClose.length-1] !== chunk[i] && closing.includes(chunk[i])) {
        score += points[chunk[i]];
        corruptedChunks.push(chunk);
        break;
      }
      else if (closing.includes(chunk[i])) {
        shouldClose.pop()
      }
    }
  })
  console.log(score);
  return corruptedChunks;
}

function completeLines(chunks) {
  let scores = [];
  const points = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  }
  let incompleteChunks = chunks;
  chunks.forEach(chunk => {
    const closing = ')]}>';
    let shouldClose = [];
    for (let i = 0; i < chunk.length; i++) {
      shouldClose = updateClosingArray(shouldClose, chunk[i]);

      if (shouldClose[shouldClose.length-1] !== chunk[i] && closing.includes(chunk[i])) {
        incompleteChunks = incompleteChunks.filter(c => c !== chunk);
        break;
      }
      else if (closing.includes(chunk[i])) {
        shouldClose.pop()
      }
    }

    if (incompleteChunks.includes(chunk)) {
      scores.push(shouldClose.reverse().join(''));
    }
  })

  scores = scores.map(score => {
    let point = 0;
    for (let i = 0; i < score.length; i++) {
      point *= 5;
      point += points[score[i]];
    }
    return point
  })

  scores = scores.sort((a, b) => a - b);
  console.log(scores[Math.floor(scores.length / 2)]);
}

//Day 11
const day11_octopuses = fs.readFileSync('./2021/day11.txt', 'utf-8').split('\n').map(row => row.split('').map(Number));
const day11_octopuses_p2 = fs.readFileSync('./2021/day11.txt', 'utf-8').split('\n').map(row => row.split('').map(Number));

function countFlashes(data) {
  let flashes = 0;
  const octopuses = [...data];

  for (let x = 1; x <= 100; x++) { //steps
    for (let i = 0; i < octopuses.length; i++) {
      for (let j = 0; j < octopuses.length; j++) {
        octopuses[i][j]++;
      }
    }

    while (octopuses.some(row => row.some(octo => octo > 9))) {
      for (let i = 0; i < octopuses.length; i++) {
        for (let j = 0; j < octopuses.length; j++) {
          if (octopuses[i][j] > 9) {
            octopuses[i][j] = 0;
            flashes++;
            if (octopuses[i-1] && octopuses[i-1][j-1]) octopuses[i-1][j-1]++;
            if (octopuses[i-1] && octopuses[i-1][j]) octopuses[i-1][j]++;
            if (octopuses[i-1] && octopuses[i-1][j+1]) octopuses[i-1][j+1]++;
            if (octopuses[i][j-1]) octopuses[i][j-1]++;
            if (octopuses[i][j+1]) octopuses[i][j+1]++;
            if (octopuses[i+1] && octopuses[i+1][j-1]) octopuses[i+1][j-1]++;
            if (octopuses[i+1] && octopuses[i+1][j]) octopuses[i+1][j]++;
            if (octopuses[i+1] && octopuses[i+1][j+1]) octopuses[i+1][j+1]++;
          }
        }
      }
    }
  }

  console.log(flashes);
}

function findMassiveFlash(data) {
  let steps = 0;
  const octopuses = [...data];

  while (octopuses.some(row => row.some(octo => octo !== 0))) {
    for (let i = 0; i < octopuses.length; i++) {
      for (let j = 0; j < octopuses.length; j++) {
        octopuses[i][j]++;
      }
    }

    while (octopuses.some(row => row.some(octo => octo > 9))) {
      for (let i = 0; i < octopuses.length; i++) {
        for (let j = 0; j < octopuses.length; j++) {
          if (octopuses[i][j] > 9) {
            octopuses[i][j] = 0;
            if (octopuses[i-1] && octopuses[i-1][j-1]) octopuses[i-1][j-1]++;
            if (octopuses[i-1] && octopuses[i-1][j]) octopuses[i-1][j]++;
            if (octopuses[i-1] && octopuses[i-1][j+1]) octopuses[i-1][j+1]++;
            if (octopuses[i][j-1]) octopuses[i][j-1]++;
            if (octopuses[i][j+1]) octopuses[i][j+1]++;
            if (octopuses[i+1] && octopuses[i+1][j-1]) octopuses[i+1][j-1]++;
            if (octopuses[i+1] && octopuses[i+1][j]) octopuses[i+1][j]++;
            if (octopuses[i+1] && octopuses[i+1][j+1]) octopuses[i+1][j+1]++;
          }
        }
      }
    }
    steps++;
  }

  console.log(steps);
}

//Day 12
const day12_caves = fs.readFileSync('./2021/day12.txt', 'utf-8').split('\n').map(route => route.split('-'));

function prepareGraph(caves) {
  const cavesNames = [];
  caves.forEach(c => {
    if (!cavesNames.includes(c[0])) cavesNames.push(c[0])
    if (!cavesNames.includes(c[1])) cavesNames.push(c[1])
  });
  const graph = new Map();
  cavesNames.forEach(c => graph.set(c, []));
  caves.forEach(([from, to]) => {
    if (to !== 'start' && from !== 'end') {
      graph.get(from).push(to);
    }
    if (to !== 'end' && from !== 'start') {
      graph.get(to).push(from);
    }
  });

  return graph;
}

function isUpper(word) {
  return word === word.toUpperCase()
}

function findPathsThroughCaves(cavesConnections) {
  const routes = prepareGraph(cavesConnections);
  let paths = [];

  const dfs = (start, visited = []) => {
    visited.push(start);
    const destinations = routes.get(start);

    destinations.forEach(destination => {
      if (destination === 'end') {
        paths.push(Array(...visited, 'end').join(','));
        return;
      }
      if (!visited.includes(destination) || isUpper(destination)) {
        dfs(destination, [...visited]);
      }
    });
  }
  dfs('start');

  console.log(paths.length);
}

function findPathsThroughCavesWithDoubleVisit(cavesConnections) {
  const routes = prepareGraph(cavesConnections);
  let paths = [];

  const dfs = (start, visited = [], doubled = '') => {
    visited.push(start);
    const destinations = routes.get(start);

    destinations.forEach(destination => {
      if (destination === 'end') {
        paths.push(Array(...visited, 'end').join(','));
        return;
      }
      if (!visited.includes(destination) || isUpper(destination)) {
        dfs(destination, [...visited], doubled);
      } else if (!isUpper(destination) && !doubled) {
        dfs(destination, [...visited], destination);
      }
    });
  }
  dfs('start');

  console.log(paths.length);
}

//Day 13
const [day13_dots, day13_folds] = fs.readFileSync('./2021/day13.txt', 'utf-8').split('\n\n').map(data => data.split('\n'));

function foldPaper(dotsCoords, folds) {
  const NUMBERS_REGEX = /[0-9]+/g;
  const dots = dotsCoords.map(d => d.split(',').map(Number));
  const xSize = Math.max(...dots.map(d => d[0])) + 1;
  let ySize = Math.max(...dots.map(d => d[1])) + 1;
  if (ySize % 2 === 0) ySize++;

  const paper = Array(ySize).fill('.').map(() => Array(xSize).fill('.'));
  dots.forEach(dot => {
    paper[dot[1]][dot[0]] = '█'
  })

  folds.forEach((fold, id) => {
    const coord = Number(fold.match(NUMBERS_REGEX)[0]);
    if (fold.includes('y')) {
      for (let i = 0; i < coord; i++) {
        for (let j = 0; j < paper[0].length; j++) {
          let toWrite = paper[i][j];
          if (paper[paper.length - 1 - i][j] === '█') toWrite = '█'
          paper[i][j] = toWrite;
        }
      }
      paper.splice(coord);
    } else {
      for (let i = 0; i < paper.length; i++) {
        for (let j = 0; j < coord; j++) {
          let toWrite = paper[i][j];
          if (paper[i][paper[i].length - 1 - j] === '█') toWrite = '█'
          paper[i][j] = toWrite;
        }
        paper[i].splice(coord);
      }
    }
    //Part 1
    if (id === 0) console.log('Part 1: ' + JSON.stringify(paper).split('').filter(x => x === '█').length);
  });

  //Part 2
  console.log('Part 2: Adjust the size of your console to see the answer');
  console.log(JSON.stringify(paper))
}

//Day 14
const [day14_template, day14_rules] = fs.readFileSync('./2021/day14.txt', 'utf-8').split('\n\n');

function growPolymer(template, rules, steps) {
  const combinations = {};
  let currentTemplate = {};
  let newTemplates = {};
  const letters = {};
  rules.split('\n').forEach(r => {
    r = r.split(' -> ');
    combinations[r[0]] = r[1];
  });
  for (let i = 0; i < template.length - 1; i ++) {
    currentTemplate[template[i] + template[i+1]] = 1;
  }
  for (let i = 0; i < template.length; i++) {
    letters[template[i]] = letters[template[i]] ? letters[template[i]] + 1 : 1;
  }

  for (let i = 1; i <= steps; i++) {
    for (combination in currentTemplate) {
      const newLetter = combinations[combination];
      const count = currentTemplate[combination];
      letters[newLetter] = letters[newLetter] ? letters[newLetter] + count : count;

      newTemplates[combination[0] + newLetter] = newTemplates[combination[0] + newLetter] ?
        newTemplates[combination[0] + newLetter] + count :
        count;

      newTemplates[newLetter + combination[1]] = newTemplates[newLetter + combination[1]] ?
      newTemplates[newLetter + combination[1]] + count :
      count;
    }
    currentTemplate = {...newTemplates};
    newTemplates = {};
  }

  console.log(Math.max(...Object.values(letters)) - Math.min(...Object.values(letters)))
}

//Day 15
const day15_cave = fs.readFileSync('./2021/day15.txt', 'utf-8').split('\n').map(row => row.split('').map(Number));
const Graph = require('node-dijkstra');

function findSafestRoute(cave) {
  const route = new Graph();
  for (let y = 0; y < cave.length; y++) {
    for (let x = 0; x < cave[0].length; x++) {
      const from = `${x},${y}`;
      const to = new Map();
      if (cave[y-1]) to.set(`${x},${y-1}`, cave[y-1][x]);
      if (cave[x-1]) to.set(`${x-1},${y}`, cave[y][x-1]);
      if (cave[x+1]) to.set(`${x+1},${y}`, cave[y][x+1]);
      if (cave[y+1]) to.set(`${x},${y+1}`, cave[y+1][x]);

      route.addNode(from, to);
    }
  }
  console.log(route.path("0,0", `${cave[0].length - 1},${cave.length - 1}`, { cost: true }).cost)
}

function findSafestRouteOnBigCave(smallCave) {
  const bigCave = JSON.parse(JSON.stringify(smallCave));
  //Expand cave on right
  for (let i = 1; i <= 4; i++) {
    for (let y = 0; y < smallCave.length; y++) {
      for (let x = 0; x < smallCave[0].length; x++) {
        let toAdd = smallCave[y][x] + i;
        if (toAdd > 9) toAdd -= 9;
        bigCave[y].push(toAdd);
      }
    }
  }

  const bigCaveSingleTileRow = JSON.parse(JSON.stringify(bigCave));
  //Expand cave on bottom
  for (let i = 1; i <= 4; i++) {
    for (let y = 0; y < bigCaveSingleTileRow.length; y++) {
      bigCave.push(bigCaveSingleTileRow[y].map(x => {
        let toAdd = x + i;
        if (toAdd > 9) toAdd -= 9;
        return toAdd;
      }))
    }
  }
  findSafestRoute(bigCave);
}

//Day 16
const day16_transmission = fs.readFileSync('./2021/day16.txt', 'utf-8');

function binaryToDec(binary) {
  return parseInt(binary.toString(), 2);
}

function hexToBinary(hex) {
  //parseInt truncates big numbers so I had to write my own function;
  const dict = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111"
  }
  let binary = '';
  hex.split('').forEach(x => {
    binary += dict[x];
  })
  return binary;
}

function decodeLiteralValue(packet) {
  let bits = packet;
  let decodedValue = '';
  let usedBits = 0;
  let lastGroup = false;
  while (!lastGroup) {
    decodedValue += bits.slice(1,5);
    usedBits += 5;
    if (bits[0] === '0') lastGroup = true;
    bits = bits.slice(5);
  }
  if (bits.split('').every(n => n === '0')) {
    usedBits += bits.length;
    bits = '';
  }
  decodedValue = binaryToDec(decodedValue);
  return { usedBits, remainingTransmission: bits, decodedValue };
}

function decodeOperatorPacket(packet, packetTypeID) {
  let bits = packet.slice(1);
  let usedBits = 1;
  const versions = [];
  const values = [];
  const lengthType = packet[0];
  if (lengthType === '0') {
    let lengthOfBits = binaryToDec(bits.slice(0, 15));
    bits = bits.slice(15);
    usedBits += 15;

    while (lengthOfBits > 0) {
      versions.push(binaryToDec(bits.slice(0,3)));
      bits = bits.slice(3);
      usedBits += 3;
      const typeID = binaryToDec(bits.slice(0,3));
      if (typeID === 4) {
        const data = decodeLiteralValue(bits.slice(3));
        usedBits += 3;
        bits = data.remainingTransmission;
        lengthOfBits -= 6;
        lengthOfBits -= data.usedBits;
        usedBits += data.usedBits;
        values.push(data.decodedValue);
      } else {
        const data = decodeOperatorPacket(bits.slice(3), typeID);
        usedBits += 3;
        bits = data.remainingTransmission;
        lengthOfBits -= 6;
        lengthOfBits -= data.usedBits;
        usedBits += data.usedBits;
        versions.push(...data.versions)
        values.push(data.decodedValue);
      }
    }

  } else {
    let totalSubPackets = binaryToDec(bits.slice(0,11));
    bits = bits.slice(11);
    usedBits += 11;

    while (totalSubPackets > 0) {
      versions.push(binaryToDec(bits.slice(0,3)));
      bits = bits.slice(3);
      usedBits += 3;
      const typeID = binaryToDec(bits.slice(0,3));
      if (typeID === 4) {
        const data = decodeLiteralValue(bits.slice(3));
        usedBits += 3;
        bits = data.remainingTransmission;
        usedBits += data.usedBits;
        totalSubPackets--;
        values.push(data.decodedValue);
      } else {
        const data = decodeOperatorPacket(bits.slice(3), typeID);
        usedBits += 3;
        bits = data.remainingTransmission;
        usedBits += data.usedBits;
        versions.push(...data.versions)
        totalSubPackets--;
        values.push(data.decodedValue);
      }
    }
  }

  if (bits.split('').every(n => n === '0')) {
    usedBits += bits.length;
    bits = '';
  }
  let finalValue;
  switch(packetTypeID) {
    case 0:
      finalValue = values.reduce((a,b) => a + b);
      break;
    case 1:
      finalValue = values.reduce((a,b) => a * b);
      break;
    case 2:
      finalValue = Math.min(...values);
      break;
    case 3:
      finalValue = Math.max(...values);
      break;
    case 5:
      finalValue = values[0] > values[1] ? 1 : 0;
      break;
    case 6:
      finalValue = values[0] < values[1] ? 1 : 0;
      break;
    case 7:
      finalValue = values[0] === values[1] ? 1 : 0;
      break;
    default: break;
  }

  return { usedBits, remainingTransmission: bits, versions, decodedValue: finalValue };
}

function decodeTransmission(transmission) {
  let binaryTransmission = hexToBinary(transmission);
  const versions = [];
  let decodedValue;
  while (binaryTransmission.length > 0) {
    versions.push(binaryToDec(binaryTransmission.slice(0,3)));
    binaryTransmission = binaryTransmission.slice(3);
    const typeID = binaryToDec(binaryTransmission.slice(0,3));
    if (typeID === 4) {
      const data = decodeLiteralValue(binaryTransmission.slice(3));
      binaryTransmission = data.remainingTransmission;
    } else {
      const data = decodeOperatorPacket(binaryTransmission.slice(3), typeID);
      binaryTransmission = data.remainingTransmission;
      versions.push(...data.versions);
      decodedValue = data.decodedValue;
    }
  }
  console.log(versions.reduce((a,b) => a + b));
  console.log(decodedValue);
}

//Day 17
const day17_target = fs.readFileSync('./2021/day17.txt', 'utf-8');

function fireProbe(target) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const area = target.match(NUMBER_REGEX).map(Number);
  let biggestHeight = 0;
  let matchingFires = 0;
  const matchingXs = [];
  for (let x = 5; x <= area[1]; x++) {
    let sum = x;
    let tempX = x;
    while (sum < area[0] && tempX > 0) {
      tempX--;
      sum += tempX;
    }
    if (sum >= area[0] && sum <= area[1]) matchingXs.push(x);
  }

  let fireDirection = [matchingXs[0], area[2]];
  while (fireDirection[0] <= matchingXs[matchingXs.length - 1]) {
    let overshooted = false;
    while (!overshooted) {
      let thisFire = [...fireDirection];
      let probeCoords = [0, 0];
      let probeMaxY = 0;
      while (probeCoords[1] > area[3]) {
        probeCoords[0] += thisFire[0];
        probeCoords[1] += thisFire[1];
        if (thisFire[0] > 0) thisFire[0]--;
        thisFire[1]--;
        if (probeMaxY < probeCoords[1]) probeMaxY = probeCoords[1];
      }

      //edge case, probe fit on Y, but didn't make it to X, but still can, after additional steps
      while(probeCoords[1] + thisFire[1] >= area[2] && probeCoords[0] < area[0]) {
        probeCoords[0] += thisFire[0];
        probeCoords[1] += thisFire[1];
        if (thisFire[0] > 0) thisFire[0]--;
        thisFire[1]--;
      }

      if (probeCoords[0] < area[0]) {
        fireDirection[1]++;
      } else if (probeCoords[0] >= area[0] && probeCoords[0] <= area[1]) {
        if (probeCoords[1] >= area[2]) {
          matchingFires++;
          if (biggestHeight < probeMaxY) biggestHeight = probeMaxY;
        } else {
          const overshoot = probeCoords[1] - area[2];
          if (overshoot < area[2]) overshooted = true;
        }
        fireDirection[1]++;
      } else {
        overshooted = true;
      }
    }
    fireDirection[0]++;
    fireDirection[1] = area[2];
  }
  console.log(biggestHeight);
  console.log(matchingFires);
}

//day 18
const day18_snail_numbers = fs.readFileSync('./2021/day18.txt', 'utf-8').split('\n');
const NUMS_REGEX = /[0-9]+/g;

String.prototype.replaceAt = function(index, replacement, toReplace = replacement.length) {
  return this.substring(0, index) + replacement + this.substring(index + toReplace);
}

function toExplode(num) {
  let depth = 0;
  let explodingIndex = null
  for (let i = 0; i < num.length; i++) {
    if (num[i] === '[') depth++;
    if (num[i] === ']') depth--;
    if (depth === 5) {
      explodingIndex = i
      break;
    }
  }
  return explodingIndex;
}

function toSplit(num) {
  const nums = num.match(NUMS_REGEX).map(Number);
  return nums.find(n => n >= 10);
}

function addSnailNumbers(nums) {
  let currentResult = nums[0];
  const remainingNumbers = nums.slice(1);

  while (remainingNumbers.length > 0) {
    currentResult = `[${currentResult},${remainingNumbers.splice(0, 1)}]`;
    let canBeReduced = true;

    while(canBeReduced) {
      let explodingPairId = toExplode(currentResult)
      const splitNum = toSplit(currentResult)

      if (explodingPairId) {
        const [toExplode1, toExplode2] = currentResult.slice(explodingPairId).match(NUMS_REGEX).map(Number).slice(0,2);
        let pairLength = 5;
        if (toExplode1 > 9) pairLength++;
        if (toExplode2 > 9) pairLength++;

        let leftToAdd = currentResult.slice(0, explodingPairId).match(NUMS_REGEX)
        if (leftToAdd) {
          leftToAdd = Number(leftToAdd[leftToAdd.length - 1]);
          const indexToReplace = currentResult.slice(0, explodingPairId).lastIndexOf(leftToAdd);
          const toReplace = leftToAdd > 9 ? 2 : 1;
          currentResult = currentResult.replaceAt(indexToReplace, leftToAdd + toExplode1, toReplace);
          explodingPairId += (leftToAdd + toExplode1).toString().length - toReplace;
        }

        let rightToAdd = currentResult.slice(explodingPairId + pairLength).match(NUMS_REGEX);
        if (rightToAdd) {
          rightToAdd = Number(rightToAdd[0]);
          const indexToReplace = currentResult.slice(explodingPairId + pairLength).indexOf(rightToAdd) + explodingPairId + pairLength;
          const toReplace = rightToAdd > 9 ? 2 : 1;
          currentResult = currentResult.replaceAt(indexToReplace, rightToAdd + toExplode2, toReplace);
        }

        currentResult = currentResult.replaceAt(explodingPairId, 0, pairLength);
      } else if (splitNum) {
        const afterSplit = `[${Math.floor(splitNum / 2)},${Math.ceil(splitNum / 2)}]`;
        currentResult = currentResult.replaceAt(currentResult.indexOf(splitNum), afterSplit, 2);
      } else {
        canBeReduced = false;
      }
    }
  }

  return currentResult;
}

function findMagnitudeOfSnailNumbers(numbers, toConsole = true) {
  let magnitude = addSnailNumbers(numbers);

  while (!Number(magnitude)) {
    const nums = magnitude.match(NUMS_REGEX);
    let pairToReduce, num1, num2
    for (let i = 0; i < nums.length - 1; i++) {
      pairToReduce = `[${nums[i]},${nums[i+1]}]`;
      if (magnitude.indexOf(pairToReduce) !== -1) {
        num1 = Number(nums[i]);
        num2 = Number(nums[i+1]);
        break;
      }
    }
    const reducedValue = 3 * num1 + 2 * num2;
    magnitude = magnitude.replace(pairToReduce, reducedValue);
  }

  if (toConsole) {
    console.log(magnitude);
  } else {
    return Number(magnitude);
  }
}

function findBiggestMagnitudeOfTwoSnailNumbers(numbers) {
  let biggestMagnitude = 0;
  while(numbers.length > 1) {
    for (let i = 1; i < numbers.length; i++) {
      const magXY = findMagnitudeOfSnailNumbers([numbers[0], numbers[i]], false);
      const magYX = findMagnitudeOfSnailNumbers([numbers[i], numbers[0]], false);
      biggestMagnitude = Math.max(biggestMagnitude, magXY, magYX);
    }
    numbers.splice(0,1);
  }
  console.log(biggestMagnitude);
}

// Day 19
const day19_scanners = fs.readFileSync('./2021/day19.txt', 'utf-8').split('\n\n');

function rotateThingsToDir(position, dir) {
  const [x, y, z] = position.split(',').map(Number);
  return {
    1: `${x},${y},${z}`,
    2: `${-y},${x},${z}`,
    3: `${-x},${-y},${z}`,
    4: `${y},${-x},${z}`,
    5: `${x},${z},${-y}`,
    6: `${-y},${z},${-x}`,
    7: `${-x},${z},${y}`,
    8: `${y},${z},${x}`,
    9: `${x},${-y},${-z}`,
    10: `${-y},${-x},${-z}`,
    11: `${-x},${y},${-z}`,
    12: `${y},${x},${-z}`,
    13: `${x},${-z},${y}`,
    14: `${-y},${-z},${x}`,
    15: `${-x},${-z},${-y}`,
    16: `${y},${-z},${-x}`,
    17: `${-z},${y},${x}`,
    18: `${-z},${x},${-y}`,
    19: `${-z},${-y},${-x}`,
    20: `${-z},${-x},${y}`,
    21: `${z},${y},${-x}`,
    22: `${z},${x},${y}`,
    23: `${z},${-y},${x}`,
    24: `${z},${-x},${-y}`,
  }[dir];
}

class Beacon {
  constructor(position) {
    const [x,y,z] = position.split(',').map(Number);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updatePosition(position) {
    this.x = position[0];
    this.y = position[1];
    this.z = position[2];
  }
  get position() {
    return { x: this.x, y: this.y, z: this.z };
  }
  get positionLabel() {
    return `${this.x},${this.y},${this.z}`;
  }
  getNeighboursForDir(otherBeacons, dir) {
    const neighbours = [];
    otherBeacons.forEach(beacon => {
      const otherPos = beacon.position;
      neighbours.push(rotateThingsToDir(`${this.x - otherPos.x},${this.y - otherPos.y},${this.z - otherPos.z}`, dir))
    })
    return neighbours;
  }
}

function findAllNeighbours(beacons, dir = 1) {
  const neighbours = [];
  beacons.forEach(beacon => {
    const others = beacons.filter(b => b.positionLabel !== beacon.positionLabel);
    neighbours.push(beacon.getNeighboursForDir(others, dir));
  });
  return neighbours;
}

function findDistinctBeacons(scanners_raw) {
  const scanners = scanners_raw.map((scanner, id) => {
    const beacons = scanner.split('\n');
    beacons.shift(); //remove title
    return { id, beacons: beacons.map(b => new Beacon(b)), position: undefined };
  });

  const connectedBeacons = [...scanners[0].beacons];
  scanners[0].position = [0, 0, 0]
  let processedScanners = 0;

  while(!scanners.every(sc => !!sc.position)) {
    scanners.forEach(scanner => {
      if (scanner.position) return;
      const knownNeighbours = findAllNeighbours(connectedBeacons);
      const knownLocations = connectedBeacons.map(b => b.positionLabel);
      const beacons = scanner.beacons;
      for (let dir = 1; dir <= 24; dir++) {
        if (scanner.position) return;
        const newNeighbours = findAllNeighbours(beacons, dir);
        let overlappingBeacons = 0;
        let lastOvelapped, overlappedWith;

        newNeighbours.forEach((newNeigh, newBeaconId) => {
          knownNeighbours.forEach((knNeigh, oldBeaconId) => {
            const matching = newNeigh.filter(n => knNeigh.includes(n)).length;
            if (matching >= 11) {
              // 11 matching neighbours + checked beacon
              overlappingBeacons++;
              lastOvelapped = scanner.beacons[newBeaconId];
              overlappedWith = connectedBeacons[oldBeaconId];
            }
          })
        });
        if (overlappingBeacons >= 12) {
          const afterRotate = rotateThingsToDir(lastOvelapped.positionLabel, dir).split(',').map(Number);
          scanner.position = [
            overlappedWith.x - afterRotate[0],
            overlappedWith.y - afterRotate[1],
            overlappedWith.z - afterRotate[2],
          ]
          scanner.beacons.forEach(beacon => {
            let updatedBeaconPos = rotateThingsToDir(beacon.positionLabel, dir).split(',').map(Number);
            updatedBeaconPos = updatedBeaconPos.map((pos, id) => pos + scanner.position[id]);
            beacon.updatePosition(updatedBeaconPos);
            if (!knownLocations.includes(updatedBeaconPos.join(','))) {
              connectedBeacons.push(beacon);
            }
          });
          processedScanners++;
          console.log('Processed scanners: ' + processedScanners + ' / ' + (scanners.length - 1));
        }
      }
    })
  }

  console.log(connectedBeacons.length);
  return scanners.map(s => s.position);
}

function getScannersSpread(positions) {
  let maxSpread = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const distance = Math.abs(positions[i][0] - positions[j][0]) + Math.abs(positions[i][1] - positions[j][1]) + Math.abs(positions[i][2] - positions[j][2]);
      maxSpread = Math.max(maxSpread, distance);
    }
  }
  console.log(maxSpread);
}

// Day 20
let [day20_algorithm, day20_image] = fs.readFileSync('./2021/day20.txt', 'utf-8').split('\n\n');
day20_image = day20_image.split('\n').map(row => (row.split('')));

function countLitPixels(algorithm, startImage, steps) {
  let pixels = {};

  for (let y = 0; y < startImage.length; y++) {
    for (let x = 0; x < startImage[0].length; x++) {
      const pos = `${x}x${y}`;
      if (startImage[y][x] === '#') pixels[pos] = '1';
      else pixels[pos] = '0';
    }
  }

  let lowest = 0;
  let highest = startImage.length - 1;
  for (let step = 1; step <= steps; step++) {
    const newPixels = {};
    lowest--;
    highest++;

    for (let x = lowest; x <= highest; x++) {
      for (let y = lowest; y <= highest; y++) {
        let code = '';
        if (pixels[`${x-1}x${y-1}`]) code += pixels[`${x-1}x${y-1}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x}x${y-1}`]) code += pixels[`${x}x${y-1}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x+1}x${y-1}`]) code += pixels[`${x+1}x${y-1}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x-1}x${y}`]) code += pixels[`${x-1}x${y}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x}x${y}`]) code += pixels[`${x}x${y}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x+1}x${y}`]) code += pixels[`${x+1}x${y}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x-1}x${y+1}`]) code += pixels[`${x-1}x${y+1}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x}x${y+1}`]) code += pixels[`${x}x${y+1}`];
        else code += step % 2 === 0 ? '1' : '0';
        if (pixels[`${x+1}x${y+1}`]) code += pixels[`${x+1}x${y+1}`];
        else code += step % 2 === 0 ? '1' : '0';

        const id = parseInt(code, 2);
        newPixels[`${x}x${y}`] = algorithm[id] === '#' ? '1' : '0';
      }
    }

    pixels = { ...newPixels };
  }

  console.log(Object.values(pixels).reduce((a, b) => a + Number(b), 0));
}

// Day 21
const day21_positions = fs.readFileSync('./2021/day21.txt', 'utf-8').split('\n');

function playDiceGame(startPositions) {
  let player1Position = Number(startPositions[0][startPositions[0].length - 1]);
  let player2Position = Number(startPositions[1][startPositions[1].length - 1]);
  const scores = [0, 0];
  let nextDice = 1;
  let turn = 1
  let throws = 0;

  const getNextDice = () => {
    throws++;
    nextDice++;
    if (nextDice > 100) nextDice -= 100;
  }

  while (scores[0] < 1000 && scores[1] < 1000) {
    let toAdd = nextDice;
    getNextDice();
    toAdd += nextDice;
    getNextDice();
    toAdd += nextDice;
    getNextDice();

    if (turn === 1) {
      let newPosition = (player1Position + toAdd) % 10;
      if (newPosition === 0) newPosition = 10;

      player1Position = newPosition;
      scores[0] += newPosition;

      turn = 2;
    } else {
      let newPosition = (player2Position + toAdd) % 10;
      if (newPosition === 0) newPosition = 10;

      player2Position = newPosition;
      scores[1] += newPosition;

      turn = 1;
    }
  }

  console.log(scores.find(sc => sc < 1000) * throws);
}

function playQuantumDiceGame(startPositions) {
  const player1Position = Number(startPositions[0][startPositions[0].length - 1]);
  const player2Position = Number(startPositions[1][startPositions[1].length - 1]);

  // There are 27 possibilites that can give a sum between 3 and 9
  const possibilities = {
    3: 1,
    4: 3,
    5: 6,
    6: 7,
    7: 6,
    8: 3,
    9: 1,
  };

  let player1Wins = 0;
  let player2Wins = 0;

  const history = {};

  const dfs = (pos1, pos2, score1, score2, turn, universes) => {
    const thisData = [pos1, pos2, score1, score2, turn, universes].toString();
    if (history[thisData]) {
      const result = history[thisData];
      player1Wins += result[0];
      player2Wins += result[1];
      return result;
    }

    const results = [0, 0];

    Object.entries(possibilities).forEach(([sum, variations]) => {
      if (turn === 1) {
        newPos1 = (pos1 + Number(sum)) % 10;
        if (newPos1 === 0) newPos1 = 10;
        newScore1 = score1 + newPos1;
        newUniverses = universes * variations;

        if (newScore1 >= 21) {
          player1Wins += newUniverses;
          results[0] += newUniverses;
          return;
        }
        const otherRes = dfs(newPos1, pos2, newScore1, score2, 2, newUniverses);
        results[0] += otherRes[0];
        results[1] += otherRes[1];
      } else {
        newPos2 = (pos2 + Number(sum)) % 10;
        if (newPos2 === 0) newPos2 = 10;
        newScore2 = score2 + newPos2;
        newUniverses = universes * variations;

        if (newScore2 >= 21) {
          player2Wins += newUniverses;
          results[1] += newUniverses;
          return;
        }
        const otherRes = dfs(pos1, newPos2, score1, newScore2, 1, newUniverses);
        results[0] += otherRes[0];
        results[1] += otherRes[1];
      }
    });

    history[thisData] = results;
    return results;
  }

  dfs(player1Position, player2Position, 0, 0, 1, 1);

  console.log(Math.max(player1Wins, player2Wins));
}

// Day 22
const day22_instructions = fs.readFileSync('./2021/day22.txt', 'utf-8').split('\n');

function addRange(ranges, rangeToAdd) {
  const allRanges = [...JSON.parse(JSON.stringify(ranges)), rangeToAdd];
  allRanges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return allRanges.reduce((ranges, newRange) => {
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
}

function removeRange(ranges, rangeToRemove) {
  const rInMiddle = [];
  const mutatedRanges = JSON.parse(JSON.stringify(ranges)).map(range => {
    if (range[0] > rangeToRemove[1] || range[1] < rangeToRemove[0]) return range;
    if (range[0] >= rangeToRemove[0] && range[1] <= rangeToRemove[1]) return [];
    if (range[0] < rangeToRemove[0] && range[1] > rangeToRemove[1]) {
      const first = [range[0], rangeToRemove[0] - 1];
      const second = [rangeToRemove[1] + 1, range[1]];
      rInMiddle.push(first);
      return second;
    }
    if (range[0] <= rangeToRemove[1] && range[1] > rangeToRemove[1]) {
      range[0] = rangeToRemove[1] + 1;
      return range;
    }
    if (range[1] >= rangeToRemove[0]) {
      range[1] = rangeToRemove[0] - 1;
      return range;
    }
  });
  mutatedRanges.push(...rInMiddle);

  return mutatedRanges.sort((a, b) => a[0] - b[0] || a[1] - b[1]).filter(r => r.length > 0);
}

function findGapsInMiddle(ranges, rangeToAdd) {
  const gaps = [];
  for (let x = 0; x < ranges.length - 1; x++) {
    if (ranges[x][1] + 1 === ranges[x+1][0] || rangeToAdd[0] >= ranges[x+1][0]) continue;
    if (rangeToAdd[1] <= ranges[x][1] || rangeToAdd[0] >= ranges[ranges.length - 1][0]) break;

    const newGap = [Math.max(ranges[x][1] + 1, rangeToAdd[0]), Math.min(ranges[x+1][0] - 1, rangeToAdd[1])];
    gaps.push(newGap.join('x'));
  }
  return gaps;
}

function rebootReactor(instructions, ignoreBig = true) {
  const navs = instructions.map(i => i.match(/-?[0-9]+/g).map(Number));
  const cubes = {};

  instructions.forEach((inst, id) => {
    if (!ignoreBig) console.log(`Calc... ${id}/${instructions.length} = ${((id/instructions.length*100).toFixed(2))}%`);
    const nav = navs[id];
    if (ignoreBig && nav.some(n => n < -50 || n > 50)) return;

    for (let z = nav[4]; z <= nav[5]; z++) {
      if (!cubes[z]) {
        const yRange = [nav[2], nav[3]].join('x');
        cubes[z] = { [yRange]: [] };
        if (inst.startsWith('on')) {
          cubes[z][yRange] = addRange([], [nav[0], nav[1]]);
        }
      } else {
        const updatedZ = {};

        if (inst.startsWith('on')) {
          const yRanges = Object.keys(cubes[z]).map(range => range.split('x').map(Number));
          yRanges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
          const gaps = findGapsInMiddle(yRanges, [nav[2], nav[3]]);

          gaps.forEach(gap => {
            updatedZ[gap] = addRange([], [nav[0], nav[1]]);
          });
        }

        Object.entries(cubes[z]).forEach(([y, xRanges], id) => {
          const yRange = y.split('x').map(Number);

          // Check left overflow
          if (id === 0 && yRange[0] > nav[2]) {
            if (inst.startsWith('on')) {
              const newYRange = [nav[2], Math.min(yRange[0] - 1, nav[3])].join('x');
              updatedZ[newYRange] = addRange([], [nav[0], nav[1]]);
            }
          }
          // Check right overflow
          if (id === Object.keys(cubes[z]).length - 1 && yRange[1] < nav[3]) {
            if (inst.startsWith('on')) {
              const newYRange = [Math.max(yRange[1] + 1, nav[2]), nav[3]].join('x');
              updatedZ[newYRange] = addRange([], [nav[0], nav[1]]);
            }
          }

          // Check if this range is outside new range
          if (yRange[0] > nav[3] || yRange[1] < nav[2]) {
            updatedZ[y] = xRanges;
          }
          // Check if this whole range should be replaced
          else if (yRange[0] >= nav[2] && yRange[1] <= nav[3]) {
            if (inst.startsWith('on')) {
              updatedZ[y] = addRange(xRanges, [nav[0], nav[1]]);
            } else {
              updatedZ[y] = removeRange(xRanges, [nav[0], nav[1]]);
            }
          }
          // Check if only middle part should be replaced
          else if (yRange[0] < nav[2] && yRange[1] > nav[3]) {
            const leftUnchanged = [yRange[0], nav[2] - 1].join('x');
            updatedZ[leftUnchanged] = xRanges;
            const rightUnchanged = [nav[3] + 1, yRange[1]].join('x');
            updatedZ[rightUnchanged] = xRanges;

            const updatedY = [nav[2], nav[3]].join('x');
            if (inst.startsWith('on')) {
              updatedZ[updatedY] = addRange(xRanges, [nav[0], nav[1]]);
            } else {
              updatedZ[updatedY] = removeRange(xRanges, [nav[0], nav[1]]);
            }
          }
          // Check if only left part should be replaced
          else if (yRange[0] >= nav[2] && yRange[0] <= nav[3] && yRange[1] > nav[3]) {
            const rightUnchanged = [nav[3] + 1, yRange[1]].join('x');
            updatedZ[rightUnchanged] = xRanges;

            const updatedY = [yRange[0], nav[3]].join('x');
            if (inst.startsWith('on')) {
              updatedZ[updatedY] = addRange(xRanges, [nav[0], nav[1]]);
            } else {
              updatedZ[updatedY] = removeRange(xRanges, [nav[0], nav[1]]);
            }
          }
          // Check if only right part should be replaced
          else {
            const leftUnchanged = [yRange[0], nav[2] - 1].join('x');
            updatedZ[leftUnchanged] = xRanges;

            const updatedY = [nav[2], yRange[1]].join('x');
            if (inst.startsWith('on')) {
              updatedZ[updatedY] = addRange(xRanges, [nav[0], nav[1]]);
            } else {
              updatedZ[updatedY] = removeRange(xRanges, [nav[0], nav[1]]);
            }
          }
        });

        let zData = Object.entries(updatedZ).sort((a, b) => a[0].split('x').map(Number)[0] - b[0].split('x').map(Number)[0]);
        const compressedZData = zData.reduce((ranges, newRange) => {
          const lastRange = ranges[ranges.length - 1] || [];
          if (lastRange.length > 0 &&
            lastRange[0].split('x').map(Number)[1] + 1 === newRange[0].split('x').map(Number)[0] &&
            JSON.stringify(lastRange[1]) === JSON.stringify(newRange[1])) {
            lastRange[0] = `${lastRange[0].split('x')[0]}x${newRange[0].split('x')[1]}`;
            return ranges;
          }
          return ranges.concat([newRange]);
        }, []);

        cubes[z] = Object.fromEntries(compressedZData);
      }
    }
  });
  console.log('All cubes set up, summing...')

  let count = 0;

  Object.values(cubes).forEach((yDimension) => {
    Object.entries(yDimension).forEach(([yRange, xRanges]) => {
      const y = yRange.split('x').map(Number);
      const repeats = Math.abs(y[1] - y[0]) + 1;
      xRanges.forEach(range => {
        count += (Math.abs(range[1] - range[0]) + 1) * repeats;
      });
    })
  })

  console.log(count);
}

// Day 23
// Too lazy to write input parser for this day.
const day23_amphipods = { A: ["A","D"], B: ["C","D"], C: ["B","A"], D: ["B","C"], hailway: "...........".split("") };
const day23_amphipods_part2 = { A: ["A","D","D","D"], B: ["C","C","B","D"], C: ["B","B","A","A"], D: ["B","A","C","C"], hailway: "...........".split("") };

function organizeAmphipods(positions, amphPerRoom) {
  const queue = { 0: [positions] };
  let energy = 0;
  let amphipodsOrganized = false;
  const savedMoves = [];
  const energies = { A: 1, B: 10, C: 100, D: 1000 };

  const clearQueue = () => {
    queue[energy].shift();
    if (queue[energy].length === 0) {
      delete queue[energy];
      energy++;
    }
  }

  const addToQueue = (newEnergy, data) => {
    if (!queue[energy + newEnergy]) queue[energy + newEnergy] = [];
    queue[energy + newEnergy].push(data);
  }

  const checkGoingOutOfRoom = (thisMove, room, startPos) => {
    if (thisMove[room].join('') !== room.repeat(amphPerRoom) && thisMove[room].length > 0) {
      const movingAmph = thisMove[room][0];
      if (thisMove[room].every(a => a === room)) return;
      const energyPerMove = energies[movingAmph];

      // Going left
      let moves = amphPerRoom + 1 - thisMove[room].length // Moving out of room;
      let position = startPos;
      while (position > 0 && thisMove.hailway[position - 1] === '.') {
        position--;
        moves++;
        if (position === 2) checkGoingToRoom(thisMove, 'A', movingAmph, moves, energyPerMove, room);
        else if (position === 4) checkGoingToRoom(thisMove, 'B', movingAmph, moves, energyPerMove, room);
        else if (position === 6) checkGoingToRoom(thisMove, 'C', movingAmph, moves, energyPerMove, room);
        else {
          const updatedHailway = [...thisMove.hailway]
          updatedHailway[position] = movingAmph;
          addToQueue(moves * energyPerMove, { ...thisMove, [room]: thisMove[room].slice(1), hailway: updatedHailway });
        }
      }

      // Going right
      moves = amphPerRoom + 1 - thisMove[room].length;
      position = startPos;
      while (position < 10 && thisMove.hailway[position + 1] === '.') {
        position++;
        moves++;
        if (position === 4) checkGoingToRoom(thisMove, 'B', movingAmph, moves, energyPerMove, room);
        else if (position === 6) checkGoingToRoom(thisMove, 'C', movingAmph, moves, energyPerMove, room);
        else if (position === 8) checkGoingToRoom(thisMove, 'D', movingAmph, moves, energyPerMove, room);
        else {
          const updatedHailway = [...thisMove.hailway]
          updatedHailway[position] = movingAmph;
          addToQueue(moves * energyPerMove, { ...thisMove, [room]: thisMove[room].slice(1), hailway: updatedHailway });
        }
      }
    }
  }

  const checkGoingToRoom = (thisMove, room, movingAmph, moves, energyPerMove, fromRoom) => {
    if ((thisMove[room].length === 0 || (thisMove[room].length === 1 && thisMove[room][0] === room)) && movingAmph === room) {
      const energySpent = (moves + (amphPerRoom - thisMove[room].length)) * energyPerMove;
      const updatedRoom = [...thisMove[room]];
      updatedRoom.unshift(movingAmph);
      addToQueue(energySpent, { ...thisMove, [room]: updatedRoom, [fromRoom]: thisMove[fromRoom].slice(1) });
    }
  }

  const checkMovingFromHailway = (thisMove, amph, position, destinationP) => {
    const energyPerMove = energies[amph];
    if (thisMove[amph].length === 0 || thisMove[amph].every(p => p === amph)) {
      let moves;
      if (position < destinationP && thisMove.hailway.slice(position + 1, destinationP + 1).every(p => p === '.')) {
        moves = destinationP - position + (amphPerRoom - thisMove[amph].length);
      }
      if (position > destinationP && thisMove.hailway.slice(destinationP, position).every(p => p === '.')) {
        moves = position - destinationP + (amphPerRoom - thisMove[amph].length);
      }
      if (moves) {
        const updatedHailway = [...thisMove.hailway];
        updatedHailway[position] = '.';
        addToQueue(moves * energyPerMove, { ...thisMove, [amph]: [amph, ...thisMove[amph]], hailway: updatedHailway })
      }
    }
  }

  while (!amphipodsOrganized) {
    if (Object.keys(queue).length === 0) {
      console.log('ALERT! No more options!')
      break;
    }
    if (!queue[energy]) {
      energy++;
      continue;
    }

    const thisMove = queue[energy][0];
    if (thisMove.A.join('') === 'A'.repeat(amphPerRoom) && thisMove.B.join('') === 'B'.repeat(amphPerRoom) && thisMove.C.join('') === 'C'.repeat(amphPerRoom) && thisMove.D.join('') === 'D'.repeat(amphPerRoom)) {
      amphipodsOrganized = true;
      break;
    }

    const data = JSON.stringify(thisMove);
    if (savedMoves.includes(data)) {
      clearQueue();
      continue;
    }
    savedMoves.push(data);

    checkGoingOutOfRoom(thisMove, 'A', 2);
    checkGoingOutOfRoom(thisMove, 'B', 4);
    checkGoingOutOfRoom(thisMove, 'C', 6);
    checkGoingOutOfRoom(thisMove, 'D', 8);
    // Going from hailway
    const destinations = { A: 2, B: 4, C: 6, D: 8 };
    thisMove.hailway.forEach((point, position) => {
      if (point === '.') return;
      checkMovingFromHailway(thisMove, point, position, destinations[point]);
    });

    clearQueue();
  }

  console.log(energy);
}

// Day 24
const day24_instructions = fs.readFileSync('./2021/day24.txt', 'utf-8').split('\n');

/*
  For this task, it was required to reverse-engineer the ALU system and check what's going on inside.
  There were many operations that did nothing at all, so instead of interpreting real input, I deleted the code that ran all operations and just wrote down everything that matters, hardcoding everything.
  It's ugly, but it works and it's fast, so I'm fine with it xD
*/
function findMONADnumbers() {
  let smallest = Number.MAX_SAFE_INTEGER;
  let biggest = 0;

  const addNum = (z, input) => {
    if (input.length === 14) {
      const monad = Number(input);
      if (monad < smallest) smallest = monad;
      if (monad > biggest) biggest = monad;
    }

    for (let num = 1; num <= 9; num++) {
      if (input.length === 0) {
        addNum(num + 6, input + num);
      } else if (input.length === 1) {
        addNum(z * 26 + num + 6, input + num);
      } else if (input.length === 2) {
        addNum(z * 26 + num + 3, input + num);
      } else if (input.length === 3) {
        let checkX = z % 26 - 11;
        if (checkX !== num) continue;
        addNum(Math.floor(z / 26), input + num);
      } else if (input.length === 4) {
        addNum(z * 26 + num + 9, input + num);
      } else if (input.length === 5) {
        let checkX = z % 26 - 1;
        if (checkX !== num) continue;
        addNum(Math.floor(z / 26), input + num);
      } else if (input.length === 6) {
        addNum(z * 26 + num + 13, input + num);
      } else if (input.length === 7) {
        addNum(z * 26 + num + 6, input + num);
      } else if (input.length === 8) {
        let checkX = z % 26;
        if (checkX !== num) continue;
        addNum(Math.floor(z / 26), input + num);
      } else if (input.length === 9) {
        addNum(z * 26 + num + 10, input + num);
      } else if (input.length === 10) {
        let checkX = z % 26 - 5;
        if (checkX !== num) continue;
        addNum(Math.floor(z / 26), input + num);
      } else if (input.length === 11) {
        let checkX = z % 26 - 16;
        if (checkX !== num) continue;
        addNum(Math.floor(z / 26), input + num);
      } else if (input.length === 12) {
        let checkX = z % 26 - 7;
        if (checkX !== num) continue;
        addNum(Math.floor(z / 26), input + num);
      } else if (input.length === 13) {
        let checkX = z % 26 - 11;
        if (checkX !== num) continue;
        addNum(Math.floor(z / 26), input + num);
      }
    }
  }

  addNum(0, '');

  console.log(biggest);
  console.log(smallest);
}

// Day 25
const day25_cucumbers = fs.readFileSync('./2021/day25.txt', 'utf-8').split('\n').map(x => x.split(''));

function moveSeaCucumbers(cucumbers) {
  let stepsPassed = 0;
  let wasMove = true;

  while (wasMove) {
    wasMove = false;
    let updatedMap = JSON.parse(JSON.stringify(cucumbers));

    for (let y = 0; y < cucumbers.length; y++) {
      for (let x = 0; x < cucumbers[0].length; x++) {
        if (cucumbers[y][x] === '>') {
          if (cucumbers[y][(x + 1) % cucumbers[0].length] === '.') {
            updatedMap[y][(x + 1) % cucumbers[0].length] = '>';
            updatedMap[y][x] = '.';
            wasMove = true;
          }
        }
      }
    }
    cucumbers = updatedMap;
    updatedMap = JSON.parse(JSON.stringify(cucumbers));
    for (let y = 0; y < cucumbers.length; y++) {
      for (let x = 0; x < cucumbers[0].length; x++) {
        if (cucumbers[y][x] === 'v') {
          if (cucumbers[(y + 1) % cucumbers.length][x] === '.') {
            updatedMap[(y + 1) % cucumbers.length][x] = 'v';
            updatedMap[y][x] = '.';
            wasMove = true;
          }
        }
      }
    }
    cucumbers = updatedMap;
    stepsPassed++;
  }

  console.log(stepsPassed);
}

// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1:');
// countIncrease(day1_numbers);
// console.log('Day 1, part 2:');
// countIncrease(makeTriples(day1_numbers));

// console.log('Day 2, part 1:');
// getCoordinates(day2_navs)
// console.log('Day 2, part 2:');
// getBetterCoordinates(day2_navs)

// console.log('Day 3, part 1:');
// calcPowerConsumption(day3_codes);
// console.log('Day 3, part 2:');
// console.log(oxygenRating(day3_codes) * scrubberRating(day3_codes));

// console.log('Day 4, part 1:');
// playBingoToWin(day4_boards, day4_numbers);
// console.log('Day 4, part 2:');
// playBingoToLose(day4_boards, day4_numbers);

// console.log('Day 5, part 1:');
// findDangerousVents(day5_lines)
// console.log('Day 5, part 2:');
// findDangerousVents(day5_lines, true)

// console.log('Day 6, part 1:');
// countLanternfish(day6_fish);
// console.log('Day 6, part 2:');
// countLanternfishMoreEfficient(day6_fish);

// console.log('Day 7, part 1:');
// evaluateFuel(day7_positions);
// console.log('Day 7, part 2:');
// evaluateFuel2(day7_positions);

// console.log('Day 8, part 1:');
// checkDigits(day8_digits);
// console.log('Day 8, part 2:');
// decodeDigits(day8_digits);

// console.log('Day 9, part 1:');
// findLowPoints(day9_map);
// console.log('Day 9, part 2:');
// findBasins(day9_map);

// console.log('Day 10, part 1 & 2:');
// const corrupted = findError(day10_chunks);
// completeLines(day10_chunks.filter(ch => !corrupted.includes(ch)));

// console.log('Day 11, part 1:');
// countFlashes(day11_octopuses);
// console.log('Day 11, part 2:');
// findMassiveFlash(day11_octopuses_p2);

// console.log('Day 12, part 1:');
// findPathsThroughCaves(day12_caves);
// console.log('Day 12, part 2:');
// findPathsThroughCavesWithDoubleVisit(day12_caves);

// console.log('Day 13:');
// foldPaper(day13_dots, day13_folds);

// console.log('Day 14, part 1:');
// growPolymer(day14_template, day14_rules, 10);
// console.log('Day 14, part 2:');
// growPolymer(day14_template, day14_rules, 40);

// console.log('Day 15, part 1:');
// findSafestRoute(day15_cave);
// console.log('Day 15, part 2:');
// findSafestRouteOnBigCave(day15_cave);

// console.log('Day 16, part 1 & 2:');
// decodeTransmission(day16_transmission);

// console.log('Day 17, part 1 & 2:');
// fireProbe(day17_target);

// console.log('Day 18, part 1:');
// findMagnitudeOfSnailNumbers(day18_snail_numbers);
// console.log('Day 18, part 2:');
// findBiggestMagnitudeOfTwoSnailNumbers(day18_snail_numbers);

// console.log('Day 19, part 1 (this will take ~4-5 minutes):');
// const scannersPositions = findDistinctBeacons(day19_scanners);
// console.log('Day 19, part 2:');
// getScannersSpread(scannersPositions);

// console.log('Day 20, part 1:');
// countLitPixels(day20_algorithm, day20_image, 2);
// console.log('Day 20, part 2:');
// countLitPixels(day20_algorithm, day20_image, 50);

// console.log('Day 21, part 1:');
// playDiceGame(day21_positions);
// console.log('Day 21, part 2:');
// playQuantumDiceGame(day21_positions);

// console.log('Day 22, part 1:');
// rebootReactor(day22_instructions);
// console.log('Day 22, part 2 (this takes about 40 minutes):');
// rebootReactor(day22_instructions, false);

// console.log('Day 23, part 1 (this will take ~3 minutes):');
// organizeAmphipods(day23_amphipods, 2);
// console.log('Day 23, part 2 (this will take ~3 minutes):');
// organizeAmphipods(day23_amphipods_part2, 4);

// console.log('Day 24, part 1 & 2:');
// findMONADnumbers();

// console.log('Day 25:');
// moveSeaCucumbers(day25_cucumbers);
