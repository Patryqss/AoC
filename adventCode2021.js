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
const day12_caves = fs.readFileSync('./2021/day12.txt', 'utf-8').split('\n');





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
