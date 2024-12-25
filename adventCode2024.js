const fs = require("fs");

//Day 1
const day1_locations = fs.readFileSync('./2024/day1.txt', 'utf-8').split('\n').map(row => row.split('   ').map(Number));

function getDifferenceInLists(lists) {
  const leftList = lists.map(l => l[0]).sort((a, b) => a - b);
  const rightList = lists.map(l => l[1]).sort((a, b) => a - b);;
  let diff = 0;
  for (let i = 0; i < leftList.length; i++) {
    diff += Math.abs(leftList[i] - rightList[i]);
  }
  console.log(diff);
}

function getSimilarityInLists(lists) {
  const leftList = lists.map(l => l[0]).sort((a, b) => a - b);
  const rightList = lists.map(l => l[1]).sort((a, b) => a - b);;
  let similar = 0;

  for (let i = 0; i < leftList.length; i++) {
    const num = leftList[i];
    const occurrence = rightList.filter(x => x === num).length;
    similar += occurrence * num;
  }
  console.log(similar);
}

// Day 2
const day2_reports = fs.readFileSync('./2024/day2.txt', 'utf-8').split('\n').map(row => row.split(' ').map(Number));

function isSafe(report) {
  const increasing = report[0] < report[1];
  let allGood = true;
  for (let x = 0; x < report.length - 1; x++) {
    const diff = report[x+1] - report[x];
    if (Math.abs(diff) > 3 || diff === 0 || (increasing && diff < 0) || (!increasing && diff > 0)) {
      allGood = false;
      break;
    }
  }
  return allGood;
}

function countSafeReports(reports) {
  let safe = 0;
  reports.forEach(report => {
    if (isSafe(report)) safe++;
  });
  console.log(safe);
}

function countSafeReportsWithTolerance(reports) {
  let safe = 0;
  reports.forEach(report => {
    if (isSafe(report)) safe++;
    else {
      for (let i = 0; i < report.length; i++) {
        const newRep = [...report];
        newRep.splice(i, 1);
        if (isSafe(newRep)) {
          safe++;
          break;
        }
      }
    }
  });
  console.log(safe);
}

// Day 3
const day3_commands = fs.readFileSync('./2024/day3.txt', 'utf-8').split('\n');

function mulNumbers(data) {
  let sum = 0;
  data.forEach(row => {
    while (row.length > 0) {
      const start = row.indexOf('mul(');
      if (start === -1) break;
      row = row.substr(start + 4);
      const num1Id = row.indexOf(',');
      const num1 = Number(row.substr(0, num1Id));
      if (Number.isNaN(num1)) continue;
      row = row.substr(num1Id + 1);
      const num2Id = row.indexOf(')');
      const num2 = Number(row.substr(0, num2Id));
      if (Number.isNaN(num2)) continue;
      row = row.substr(num2Id + 1);
      sum += num1 * num2;
    }
  });
  console.log(sum);
}

function mulNumbersAdvanced(data) {
  let sum = 0;
  let enabled = true;
  data.forEach(row => {
    while (row.length > 0) {
      if (!enabled) {
        const start = row.indexOf('do()');
        if (start === -1) break;
        row = row.substr(start + 4);
        enabled = true
        continue;
      }

      const cancel = row.indexOf("don't()"); 
      const start = row.indexOf('mul(');
      if (cancel !== -1 && cancel < start) {
        enabled = false;
        continue;
      }
      if (start === -1) break;

      row = row.substr(start + 4);
      const num1Id = row.indexOf(',');
      const num1 = Number(row.substr(0, num1Id));
      if (Number.isNaN(num1)) continue;
      row = row.substr(num1Id + 1);
      const num2Id = row.indexOf(')');
      const num2 = Number(row.substr(0, num2Id));
      if (Number.isNaN(num2)) continue;
      row = row.substr(num2Id + 1);
      sum += num1 * num2;
    }
  });
  console.log(sum);
}

// Day 4
const day4_letters = fs.readFileSync('./2024/day4.txt', 'utf-8').split('\n').map(row => row.split(''));

function findXMAS(lettersGrid) {
  let count = 0;
  const word = 'XMAS';
  for (let x = 0; x < lettersGrid[0].length; x++) {
    for (let y = 0; y < lettersGrid.length; y++) {
      if (word[0] === lettersGrid[y][x]) {
        // possible match
        let right = left = up = down = diagRightDown = diagLeftDown = diagRightUp = diagLeftUp = word[0];

        for (let i = 1; i < word.length; i++) {
          right += lettersGrid[y][x + i];
          left += lettersGrid[y][x - i];
          if (lettersGrid[y + i]) {
            down += lettersGrid[y + i][x];
            diagRightDown += lettersGrid[y + i][x + i];
            diagLeftDown += lettersGrid[y + i][x - i];
          }
          if (lettersGrid[y - i]) {
            up += lettersGrid[y - i][x];
            diagRightUp += lettersGrid[y - i][x + i];
            diagLeftUp += lettersGrid[y - i][x - i];
          }
        }

        if (right === word) count++;
        if (left === word) count++;
        if (down === word) count++;
        if (up === word) count++;
        if (diagRightDown === word) count++;
        if (diagLeftDown === word) count++;
        if (diagRightUp === word) count++;
        if (diagLeftUp === word) count++;
      }
    }
  }
  console.log(count);
}

function findX_MAS(lettersGrid) {
  let count = 0;
  for (let x = 1; x < lettersGrid[0].length - 1; x++) {
    for (let y = 1; y < lettersGrid.length - 1; y++) {
      if (lettersGrid[y][x] === 'A') {
        const i = 1;
        const diagRightDown = lettersGrid[y + i][x + i];
        const diagLeftDown = lettersGrid[y + i][x - i];
        const diagRightUp = lettersGrid[y - i][x + i];
        const diagLeftUp = lettersGrid[y - i][x - i];
        const allDiags = [diagRightDown, diagLeftDown, diagRightUp, diagLeftUp].sort();

        if (allDiags.join('') === 'MMSS' && diagRightDown !== diagLeftUp) count++;
      }
    }
  }
  console.log(count);
}

// Day 5
const [day5_rules, day5_pages] = fs.readFileSync('./2024/day5.txt', 'utf-8').split('\n\n').map(data => data.split('\n'));

function sumCorrectPages(rules, pages) {
  rules = rules.map((r) => r.split('|').map(Number));
  pages = pages.map((p) => p.split(',').map(Number));
  let correctMiddles = 0;
  pages.forEach((page) => {
    let isCorrect = true;
    for (const rule of rules) {
      const id1 = page.indexOf(rule[0]);
      const id2 = page.indexOf(rule[1]);
      if (id1 === -1 || id2 === -1) continue;
      if (id1 > id2) {
        isCorrect = false;
        break;
      }
    }
    if (isCorrect) correctMiddles += page[Math.floor(page.length / 2)];
  });
  console.log(correctMiddles);
}

function fixIncorrectPages(rules, pages) {
  rules = rules.map((r) => r.split('|').map(Number));
  pages = pages.map((p) => p.split(',').map(Number));
  let fixedMiddles = 0;
  pages.forEach((page) => {
    let isCorrect = true;
    for (let check = 0; check <= 5; check++) {
      if (check > 0 && isCorrect) break;
      for (const rule of rules) {
        const id1 = page.indexOf(rule[0]);
        const id2 = page.indexOf(rule[1]);
        if (id1 === -1 || id2 === -1) continue;
        if (id1 > id2) {
          isCorrect = false;
          page[id2] = rule[0];
          page[id1] = rule[1];
        }
      }
    }
    if (!isCorrect) {
      fixedMiddles += page[Math.floor(page.length / 2)];
    }
  });
  console.log(fixedMiddles);
}

// Day 6
const day6_map = fs.readFileSync('./2024/day6.txt', 'utf-8').split('\n').map(row => row.split(''));

function wouldExit(startPositionm, map, recordVisited = false) {
  const visitedPlaces = new Set();
  const currentPosition = [...startPositionm];
  let dir = 'UP';
  if (recordVisited) visitedPlaces.add(`${currentPosition[0]},${currentPosition[1]}`);

  let exited = false;
  let step = 0;
  while (!exited) {
    const [x, y] = currentPosition;
    if (dir === 'UP') {
      if (!map[y-1]) exited = true
      else if (map[y-1][x] !== '#') currentPosition[1]--;
      else dir = 'RIGHT';
    } else if (dir === 'RIGHT') {
      if (!map[y][x+1]) exited = true
      else if (map[y][x+1] !== '#') currentPosition[0]++;
      else dir = 'DOWN';
    } else if (dir === 'DOWN') {
      if (!map[y+1]) exited = true
      else if (map[y+1][x] !== '#') currentPosition[1]++;
      else dir = 'LEFT';
    } else { // LEFT
      if (!map[y][x-1]) exited = true
      else if (map[y][x-1] !== '#') currentPosition[0]--;
      else dir = 'UP';
    }

    if (recordVisited) visitedPlaces.add(`${currentPosition[0]},${currentPosition[1]}`);
    step++;
    if (step > 10_000) break; // got in a loop
  }
  
  if (recordVisited) console.log(visitedPlaces.size);
  return exited;
}

function countVisitedPlaces(map) {
  const currentPosition = [0, 0];
  out: for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '^') {
        currentPosition[0] = x;
        currentPosition[1] = y;
        break out;
      }
    }
  }

  wouldExit(currentPosition, map, true);
}

function createLoops(map) {
  const currentPosition = [0, 0];
  out: for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '^') {
        currentPosition[0] = x;
        currentPosition[1] = y;
        break out;
      }
    }
  } 

  let loops = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '.') {
        const copy = JSON.parse(JSON.stringify(map));
        copy[y][x] = '#';
        if (!wouldExit(currentPosition, copy)) loops++;
      }
    }
  }

  console.log(loops);
}

// Day 7
const day7_data = fs.readFileSync('./2024/day7.txt', 'utf-8').split('\n');

function calibrateOperations(data, withConcat = false) {
  let calibrationResult = 0;
  data.forEach(line => {
    let [result, equation] = line.split(': ');
    result = Number(result);
    equation = equation.split(' ').map(Number);
    let valid = false
    const addSign = (currentVal, i) => {
      if (valid || currentVal > result) return;
      if (!equation[i]) {
        if (currentVal === result) valid = true;
        return;
      }
      addSign(currentVal + equation[i], i + 1);
      addSign(currentVal * equation[i], i + 1);
      if (withConcat) addSign(Number(currentVal.toString() + equation[i].toString()), i + 1);
    }
    addSign(equation[0], 1);
    if (valid) calibrationResult += result;
  });
  console.log(calibrationResult);
}

// Day 8
const day8_antennas = fs.readFileSync('./2024/day8.txt', 'utf-8').split('\n').map(row => row.split(''));

function countAntinodes(antennas, allVariants = false) {
  const antinodes = new Set();
  const antennasPositions = {};
  for (let y = 0; y < antennas.length; y++) {
    for (let x = 0; x < antennas[0].length; x++) {
      if (antennas[y][x] !== '.') {
        const antenna = antennas[y][x];
        if (!antennasPositions[antenna]) antennasPositions[antenna] = [];
        antennasPositions[antenna].push([x, y]);
      }
    }
  }
  
  Object.values(antennasPositions).forEach(positionList => {
    for (let i = 0; i < positionList.length; i++) {
      for (let j = 0; j < positionList.length; j++) {
        if (i === j) continue;
        const diffX = positionList[i][0] - positionList[j][0];
        const diffY = positionList[i][1] - positionList[j][1];
        if (allVariants) {
          for (let n = 0;; n++) {
            const antinode = [positionList[i][0] + diffX * n, positionList[i][1] + diffY * n];
            if (antinode[0] < 0 || antinode[1] < 0 || antinode[0] >= antennas[0].length || antinode[1] >= antennas.length) break; // out of bounds
            antinodes.add(antinode.join('x'));
          }
        } else {
          const antinode = [positionList[i][0] + diffX, positionList[i][1] + diffY];
          if (antinode[0] < 0 || antinode[1] < 0 || antinode[0] >= antennas[0].length || antinode[1] >= antennas.length) continue; // out of bounds
          antinodes.add(antinode.join('x'));
        }
      }
    }
  });

  console.log(antinodes.size);
}

// Day 9
const day9_diskData = fs.readFileSync('./2024/day9.txt', 'utf-8').split('').map(Number);

function moveFiles(data) {
  let checksum = 0;

  let pos = 0;
  for (let i = 0; i < data.length; i++) {
    if (i % 2 === 0) {
      const id = i / 2;
      for (let x = 1; x <= data[i]; x++) {
        checksum += pos * id;
        pos++;
      }
    } else {
      let freeSpace = data[i];
      while (freeSpace > 0) {
        const fileId = Math.floor(data.length / 2);
        let file = data.pop();
        while (freeSpace > 0 && file > 0) {
          checksum += pos * fileId;
          pos++;
          file--;
          freeSpace--;
        }
        if (file === 0) {
          data.pop(); // remove free space in the end
        } else {
          data.push(file);
        }
      }
    }
  }

  console.log(checksum);
}

function moveFileblocks(data) {
  const disk = [];
  data.forEach((x, id) => {
    if (id % 2 === 0) {
      disk.push({ type: "file", id: id / 2, size: x });
    } else {
      disk.push({ type: "space", id: null, size: x });
    }
  });

  for (let i = disk.length - 1; i >= 0; i--) {
    const el = disk[i];
    if (el.type === "space") continue;
    let wasMoved = false;
    for (let j = 0; j < i; j++) {
      const el2 = disk[j];
      if (el2.type === "space") {
        if (el2.size >= el.size) {
          el2.size -= el.size;
          disk.splice(j, 0, { ...el });
          wasMoved = true;
          i++;
          break;
        }
      }
    }
    if (wasMoved) {
      el.type = "space";
      el.id = null;
    }
  }

  let checksum = 0;
  let pos = 0;
  disk.forEach((el) => {
    if (el.type === "file") {
      for (let x = 1; x <= el.size; x++) {
        checksum += pos * el.id;
        pos++;
      }
    } else {
      pos += el.size;
    }
  });

  console.log(checksum);
}

// Day 10
const day10_map = fs.readFileSync('./2024/day10.txt', 'utf-8').split('\n').map(row => row.split('').map(Number));

function searchHikingTrails(map) {
  let scores = 0;
  let rating = 0;

  let memo = {};
  const climbUp = (x, y) => {
    const pos = map[y][x];
    const id = `${y}x${x}`;
    if (memo[id]) return memo[id];
    if (pos === 9) {
      scores++;
      return memo[id] = 1;
    }

    let thisRating = 0;
    if (map[y + 1] && map[y + 1][x] === pos + 1) thisRating += climbUp(x, y + 1);
    if (map[y - 1] && map[y - 1][x] === pos + 1) thisRating += climbUp(x, y - 1);
    if (map[y][x + 1] === pos + 1) thisRating += climbUp(x + 1, y);
    if (map[y][x - 1] === pos + 1) thisRating += climbUp(x - 1, y);
    return memo[id] = thisRating;
  };

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 0) {
        memo = {};
        rating += climbUp(x, y);
      }
    }
  }

  console.log(scores);
  console.log(rating);
}

// Day 11
const day11_stones = fs.readFileSync('./2024/day11.txt', 'utf-8').split(' ').map(Number);

function blinkOnStones(stones, maxBlinks) {
  const memo = {};
  const onBlink = (stone, blinkNo) => {
    if (blinkNo === maxBlinks) return 1;
    const id = `${stone}x${blinkNo}`;
    if (memo[id]) return memo[id];

    let thisCount = 0;
    if (stone === 0) thisCount += onBlink(1, blinkNo + 1);
    else if (stone.toString().length % 2 === 0) {
      const L = stone.toString().length / 2;
      const firstSt = Math.floor(stone / 10 ** L);
      const secondSt = stone % (10 ** L);
      thisCount += onBlink(firstSt, blinkNo + 1);
      thisCount += onBlink(secondSt, blinkNo + 1);
    } 
    else thisCount += onBlink(stone * 2024, blinkNo + 1);

    return memo[id] = thisCount;
  }

  let totalCount = 0;
  for (const stone of stones) {
    totalCount += onBlink(stone, 0);
  }
  console.log(totalCount);
}

// Day 12
const day12_map = fs.readFileSync('./2024/day12.txt', 'utf-8').split('\n').map(row => row.split(''));

function getPriceOfFence(map) {
  let totalPerimeterPrice = 0;
  let totalSidesPrice = 0;
  
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] !== '*') {
        let currentArea = currentPerimeter = currentSides = 0;
        const sides = new Set();
        let memo = {};
        let mapCopy = JSON.parse(JSON.stringify(map));
        const calcPrice = (currentRegion, y, x) => {
          const id = `${y}x${x}`;
          if (memo[id]) return;
          memo[id] = true;
          currentArea++;
          if (map[y][x-1] !== currentRegion) {
            currentPerimeter++;
            sides.add(`Lx${y}x${x}`);
          }
          else calcPrice(currentRegion, y, x-1);
          if (map[y][x+1] !== currentRegion) {
            currentPerimeter++;
            sides.add(`Rx${y}x${x}`);
          }
          else calcPrice(currentRegion, y, x+1);
          if (!map[y-1] || map[y-1][x] !== currentRegion) {
            currentPerimeter++;
            sides.add(`Ux${y}x${x}`);
          }
          else calcPrice(currentRegion, y-1, x);
          if (!map[y+1] || map[y+1][x] !== currentRegion) {
            currentPerimeter++;
            sides.add(`Dx${y}x${x}`);
          }
          else calcPrice(currentRegion, y+1, x);

          mapCopy[y][x] = '*';
        }

        calcPrice(map[y][x], y, x);
        let  = 0;
        while (sides.size > 0) {
          currentSides++;
          const side = sides.values().next().value;
          sides.delete(side);
          const [dir, yy, xx] = side.split('x');
          if (dir === 'L' || dir === 'R') {
            for (let checkY = Number(yy) - 1;; checkY--) {
              const checkSide = `${dir}x${checkY}x${xx}`;
              if (sides.has(checkSide)) sides.delete(checkSide);
              else break;
            }
            for (let checkY = Number(yy) + 1;; checkY++) {
              const checkSide = `${dir}x${checkY}x${xx}`;
              if (sides.has(checkSide)) sides.delete(checkSide);
              else break;
            }
          } else {
            for (let checkX = Number(xx) - 1;; checkX--) {
              const checkSide = `${dir}x${yy}x${checkX}`;
              if (sides.has(checkSide)) sides.delete(checkSide);
              else break;
            }
            for (let checkX = Number(xx) + 1;; checkX++) {
              const checkSide = `${dir}x${yy}x${checkX}`;
              if (sides.has(checkSide)) sides.delete(checkSide);
              else break;
            }
          }
        }

        totalPerimeterPrice += currentArea * currentPerimeter;
        totalSidesPrice += currentArea * currentSides;
        map = JSON.parse(JSON.stringify(mapCopy));
      }
    }
  }

  console.log(totalPerimeterPrice);
  console.log(totalSidesPrice);
}

// Day 13
const NUMBER_REGEX = /-?[0-9]+/g;
const day13_machines = fs.readFileSync('./2024/day13.txt', 'utf-8').split('\n\n').map(machine => machine.match(NUMBER_REGEX).map(Number));

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

function getPrizesFromClawMachines(machines, addition = 0) {
  let spentTokens = 0;
  machines.forEach(machine => {
    /* Just solving system of equations (example based on first machine from the puzzle)
      94a + 22b = 8400 || * lcm(94,34) / 94 = 17
      34a + 67b = 5400 || * lcm(94,34) / 34 = 47

      1598a + 374b = 142800
      1598a + 3149b = 253800

      2775b = 111000 => b = 40
      94a + 22*40 = 8400 => 94a = 7520 => a = 80
    */ 
    let minCost;
    let [aX, aY, bX, bY, prizeX, prizeY] = machine;
    prizeX += addition;
    prizeY += addition;
    const lcmA = lcm(aX, aY);

    let bPushes = Math.abs(bX * (lcmA / aX) - bY * (lcmA / aY));
    let res = Math.abs(prizeX * (lcmA / aX) - prizeY * (lcmA / aY));
    bPushes = res / bPushes;
    if (Number.isInteger(bPushes)) {
      const aPushes = (prizeX - bX * bPushes) / aX;
      if (Number.isInteger(aPushes)) {
        minCost = 3 * aPushes + 1 * bPushes;
      }
    }

    if (minCost) spentTokens += minCost;
  });

  console.log(spentTokens);
}

// Day 14
const day14_robots = fs.readFileSync('./2024/day14.txt', 'utf-8').split('\n').map(row => row.match(NUMBER_REGEX).map(Number));

function countRobotsInQuadrants(robots) {
  const quadrants = [0, 0, 0, 0];
  const maxX = 101;
  const maxY = 103;
  const seconds = 100;
  robots.forEach(robot => {
    let [x, y, velX, velY] = robot;
    let finalX = (x + seconds * velX) % maxX;
    if (finalX < 0) finalX += maxX;
    let finalY = (y + seconds * velY) % maxY;
    if (finalY < 0) finalY += maxY;

    if (finalX < Math.floor(maxX / 2)) {
      if (finalY < Math.floor(maxY / 2)) {
        quadrants[0]++;
      } else if (finalY > Math.floor(maxY / 2)) {
        quadrants[1]++;
      }
    } else if (finalX > Math.floor(maxX / 2)) {
      if (finalY < Math.floor(maxY / 2)) {
        quadrants[2]++;
      } else if (finalY > Math.floor(maxY / 2)) {
        quadrants[3]++;
      }
    }
  });
  console.log(quadrants.reduce((a, b) => a * b, 1));
}

function findChristmasTree(robots) {
  const maxX = 101;
  const maxY = 103;

  for (let seconds = 1000; seconds <= 10000; seconds++) {
    const map = new Array(maxY).fill([]).map(row => new Array(maxX).fill('.'));
    robots.forEach(robot => {
      let [x, y, velX, velY] = robot;
      let finalX = (x + seconds * velX) % maxX;
      if (finalX < 0) finalX += maxX;
      let finalY = (y + seconds * velY) % maxY;
      if (finalY < 0) finalY += maxY;
      
      map[finalY][finalX] = 'X';
    });
    if (map.some(row => row.join('').includes('XXXXXXXXXXXXXXX'))) {
      // Uncomment this to see the christmas tree!
      // const pictureMap = JSON.stringify(map).replaceAll('"', '').replaceAll(',', '').replaceAll(']', '\n').replaceAll('[', '');
      // console.log(pictureMap);
      console.log(seconds);
      return;
    }
  }
}

// Day 15
let [day15_map, day15_moves] = fs.readFileSync('./2024/day15.txt', 'utf-8').split('\n\n');
day15_map = day15_map.split('\n').map(row => row.split(''));
day15_moves = day15_moves.replaceAll('\n', '').split('');

function moveBoxes(map, moves) {
  const robotPosition = [0, 0];
  out: for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '@') {
        robotPosition[0] = x;
        robotPosition[1] = y;
        break out;
      }
    }
  }
  map = JSON.parse(JSON.stringify(map)); // make a copy to not break input for second part

  moves.forEach(move => {
    if (move === '^') {
      if (map[robotPosition[1]-1][robotPosition[0]] === '.') {
        map[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[1]--;
        map[robotPosition[1]][robotPosition[0]] = '@';
      } else if (map[robotPosition[1]-1][robotPosition[0]] === 'O') {
        let diff = 1;
        while (map[robotPosition[1]-diff][robotPosition[0]] === 'O') diff++;
        if (map[robotPosition[1]-diff][robotPosition[0]] === '.') {
          while (diff > 1) {
            map[robotPosition[1]-diff][robotPosition[0]] = 'O';
            diff--;
          }
          map[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[1]--;
          map[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    } else if (move === '>') {
      if (map[robotPosition[1]][robotPosition[0]+1] === '.') {
        map[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[0]++;
        map[robotPosition[1]][robotPosition[0]] = '@';
      } else if (map[robotPosition[1]][robotPosition[0]+1] === 'O') {
        let diff = 1;
        while (map[robotPosition[1]][robotPosition[0]+diff] === 'O') diff++;
        if (map[robotPosition[1]][robotPosition[0]+diff] === '.') {
          while (diff > 1) {
            map[robotPosition[1]][robotPosition[0]+diff] = 'O';
            diff--;
          }
          map[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[0]++;
          map[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    } else if (move === 'v') {
      if (map[robotPosition[1]+1][robotPosition[0]] === '.') {
        map[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[1]++;
        map[robotPosition[1]][robotPosition[0]] = '@';
      } else if (map[robotPosition[1]+1][robotPosition[0]] === 'O') {
        let diff = 1;
        while (map[robotPosition[1]+diff][robotPosition[0]] === 'O') diff++;
        if (map[robotPosition[1]+diff][robotPosition[0]] === '.') {
          while (diff > 1) {
            map[robotPosition[1]+diff][robotPosition[0]] = 'O';
            diff--;
          }
          map[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[1]++;
          map[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    } else { // <
      if (map[robotPosition[1]][robotPosition[0]-1] === '.') {
        map[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[0]--;
        map[robotPosition[1]][robotPosition[0]] = '@';
      } else if (map[robotPosition[1]][robotPosition[0]-1] === 'O') {
        let diff = 1;
        while (map[robotPosition[1]][robotPosition[0]-diff] === 'O') diff++;
        if (map[robotPosition[1]][robotPosition[0]-diff] === '.') {
          while (diff > 1) {
            map[robotPosition[1]][robotPosition[0]-diff] = 'O';
            diff--;
          }
          map[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[0]--;
          map[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    }
  });

  let GPS = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 'O') {
        GPS += 100 * y + x;
      }
    }
  }
  console.log(GPS);
}

function moveWideBoxes(map, moves) {
  const robotPosition = [0, 0];
  const wideMap = [];
  for (let y = 0; y < map.length; y++) {
    wideMap.push([]);
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') wideMap[y].push('#', '#');
      if (map[y][x] === 'O') wideMap[y].push('{', '}');
      if (map[y][x] === '.') wideMap[y].push('.', '.');
      if (map[y][x] === '@') {
        robotPosition[0] = wideMap[y].length;
        robotPosition[1] = y;
        wideMap[y].push('@', '.');
      }
    }
  }

  moves.forEach(move => {
    if (move === '^') {
      if (wideMap[robotPosition[1]-1][robotPosition[0]] === '.') {
        wideMap[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[1]--;
        wideMap[robotPosition[1]][robotPosition[0]] = '@';
      } else if (['{', '}'].includes(wideMap[robotPosition[1]-1][robotPosition[0]])) {
        const moveUp = (y, xs) => {
          if (xs.map(x => wideMap[y-1][x]).every(p => p === '.')) {
            return true;
          }
          if (xs.map(x => wideMap[y-1][x]).some(p => p === '#')) {
            return false;
          }
          const newXs = new Set();
          xs.forEach(x => {
            if (wideMap[y-1][x] === '{') {
              newXs.add(x);
              newXs.add(x+1);
            } else if (wideMap[y-1][x] === '}') {
              newXs.add(x-1);
              newXs.add(x);
            }
          });

          const moved = moveUp(y-1, [...newXs].sort((a, b) => a - b));
          if (moved) {
            [...newXs].sort((a, b) => a - b).forEach(x => {
              wideMap[y-2][x] = wideMap[y-1][x];
              wideMap[y-1][x] = '.';
            });
          }
          return moved;
        }
        const newXs = wideMap[robotPosition[1]-1][robotPosition[0]] === '{' ? [robotPosition[0], robotPosition[0]+1] : [robotPosition[0]-1, robotPosition[0]]
        const moved = moveUp(robotPosition[1]-1, newXs);
        
        if (moved) {
          newXs.forEach(x => {
            wideMap[robotPosition[1]-2][x] = wideMap[robotPosition[1]-1][x];
            wideMap[robotPosition[1]-1][x] = '.';
          });
          wideMap[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[1]--;
          wideMap[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    } else if (move === '>') {
      if (wideMap[robotPosition[1]][robotPosition[0]+1] === '.') {
        wideMap[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[0]++;
        wideMap[robotPosition[1]][robotPosition[0]] = '@';
      } else if (wideMap[robotPosition[1]][robotPosition[0]+1] === '{') {
        let diff = 1;
        while (['{', '}'].includes(wideMap[robotPosition[1]][robotPosition[0]+diff])) diff++;
        if (wideMap[robotPosition[1]][robotPosition[0]+diff] === '.') {
          while (diff > 1) {
            wideMap[robotPosition[1]][robotPosition[0]+diff] = wideMap[robotPosition[1]][robotPosition[0]+diff-1];
            diff--;
          }
          wideMap[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[0]++;
          wideMap[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    } else if (move === 'v') {
      if (wideMap[robotPosition[1]+1][robotPosition[0]] === '.') {
        wideMap[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[1]++;
        wideMap[robotPosition[1]][robotPosition[0]] = '@';
      } else if (['{', '}'].includes(wideMap[robotPosition[1]+1][robotPosition[0]])) {
        const moveDown = (y, xs) => {
          if (xs.map(x => wideMap[y+1][x]).every(p => p === '.')) {
            return true;
          }
          if (xs.map(x => wideMap[y+1][x]).some(p => p === '#')) {
            return false;
          }
          const newXs = new Set();
          xs.forEach(x => {
            if (wideMap[y+1][x] === '{') {
              newXs.add(x);
              newXs.add(x+1);
            } else if (wideMap[y+1][x] === '}') {
              newXs.add(x-1);
              newXs.add(x);
            }
          });

          const moved = moveDown(y+1, [...newXs].sort((a, b) => a - b));
          if (moved) {
            [...newXs].sort((a, b) => a - b).forEach(x => {
              wideMap[y+2][x] = wideMap[y+1][x];
              wideMap[y+1][x] = '.';
            });
          }
          return moved;
        }
        const newXs = wideMap[robotPosition[1]+1][robotPosition[0]] === '{' ? [robotPosition[0], robotPosition[0]+1] : [robotPosition[0]-1, robotPosition[0]]
        const moved = moveDown(robotPosition[1]+1, newXs);
        
        if (moved) {
          newXs.forEach(x => {
            wideMap[robotPosition[1]+2][x] = wideMap[robotPosition[1]+1][x];
            wideMap[robotPosition[1]+1][x] = '.';
          });
          wideMap[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[1]++;
          wideMap[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    } else { // <
      if (wideMap[robotPosition[1]][robotPosition[0]-1] === '.') {
        wideMap[robotPosition[1]][robotPosition[0]] = '.';
        robotPosition[0]--;
        wideMap[robotPosition[1]][robotPosition[0]] = '@';
      } else if (wideMap[robotPosition[1]][robotPosition[0]-1] === '}') {
        let diff = 1;
        while (['{', '}'].includes(wideMap[robotPosition[1]][robotPosition[0]-diff])) diff++;
        if (wideMap[robotPosition[1]][robotPosition[0]-diff] === '.') {
          while (diff > 1) {
            wideMap[robotPosition[1]][robotPosition[0]-diff] = wideMap[robotPosition[1]][robotPosition[0]-diff+1];
            diff--;
          }
          wideMap[robotPosition[1]][robotPosition[0]] = '.';
          robotPosition[0]--;
          wideMap[robotPosition[1]][robotPosition[0]] = '@';
        }
      }
    }
  });

  let GPS = 0;
  for (let y = 0; y < wideMap.length; y++) {
    for (let x = 0; x < wideMap[0].length; x++) {
      if (wideMap[y][x] === '{') {
        GPS += 100 * y + x;
      }
    }
  }
  console.log(GPS);
}

// Day 16
const day16_map = fs.readFileSync('./2024/day16.txt', 'utf-8').split('\n').map(row => row.split(''));

function watchReindeerOlympics(map) {
  const reindeerPosition = [0, 0];
  out: for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "S") {
        reindeerPosition[0] = x;
        reindeerPosition[1] = y;
        break out;
      }
    }
  }

  let score = 0;
  const queue = { 0: [{ pos: reindeerPosition, dir: "E", hist: [] }] };
  const memo = {};

  const clearQueue = () => {
    queue[score].shift();
    if (queue[score].length === 0) {
      delete queue[score];
      while (!queue[score]) score++;
    }
  };

  const DIRS = {
    W: [-1, 0],
    E: [1, 0],
    N: [0, -1],
    S: [0, 1],
  };
  const DIRS_ARR = ["N", "E", "S", "W"];

  let winningHist;

  while (!winningHist) {
    const { pos, dir, hist } = queue[score][0];
    const id = `${pos}x${dir}`;
    if (map[pos[1]][pos[0]] === "E") {
      console.log(score);
      winningHist = [...hist, id];
      continue;
    }

    if (memo[id]) {
      if (memo[id].best === score) {
        memo[id].tiles = new Set([...memo[id].tiles, ...hist]);
      }
      clearQueue();
      continue;
    }
    memo[id] = { best: score, tiles: new Set(hist) };

    const nextTile = [pos[0] + DIRS[dir][0], pos[1] + DIRS[dir][1]];
    if (map[nextTile[1]] && map[nextTile[1]][nextTile[0]] && map[nextTile[1]][nextTile[0]] !== "#") {
      if (!queue[score + 1]) queue[score + 1] = [];
      queue[score + 1].push({ pos: nextTile, dir, hist: [...hist, id] });
    }

    const dirId = DIRS_ARR.indexOf(dir);
    if (!queue[score + 1000]) queue[score + 1000] = [];
    queue[score + 1000].push({ pos, dir: DIRS_ARR[(dirId + 1) % 4], hist: [...hist, id] });
    queue[score + 1000].push({ pos, dir: DIRS_ARR[(dirId + 4 - 1) % 4], hist: [...hist, id] });

    clearQueue();
  }

  const possibleSeats = new Set();
  const checked = [];

  for (const field of winningHist) {
    if (checked.includes(field)) continue;
    possibleSeats.add(field.split("x")[0]);
    checked.push(field);

    if (memo[field]) [...memo[field].tiles].forEach((histField) => {
      possibleSeats.add(histField.split("x")[0]);
      winningHist.push(histField);
    });
  }

  console.log(possibleSeats.size);
}

// Day 17
const [day17_registers, day17_program] = fs.readFileSync('./2024/day17.txt', 'utf-8').split('\n\n').map(x => x.match(NUMBER_REGEX).map(Number));

class Debugger {
  constructor(registerA) {
    this.registerA = registerA;
    this.registerB = 0;
    this.registerC = 0;
    this.pointer = 0;
    this.output = [];
  }

  getComboOperand(x) {
    if (x <= 3) return x;
    if (x === 4) return this.registerA;
    if (x === 5) return this.registerB;
    if (x === 6) return this.registerC;
  }

  op0(x) { // adv
    this.registerA = Math.floor(this.registerA / 2 ** this.getComboOperand(x));
    this.pointer += 2;
  }

  op1(x) { // bxl
    this.registerB = this.registerB ^ x;
    this.pointer += 2;
  }

  op2(x) { // bst
    this.registerB = this.getComboOperand(x) % 8;
    this.pointer += 2;
  }

  op3(x) { // jnz
    if (this.registerA === 0) {
      this.pointer += 2;
    } else {
      this.pointer = x;
    }
  }

  op4(x) { // bxc
    this.registerB = this.registerB ^ this.registerC;
    this.pointer += 2;
  }

  op5(x) { // out
    let res = this.getComboOperand(x) % 8;
    if (res < 0) res += 8
    this.output.push(res);
    this.pointer += 2;
  }

  op6(x) { // bdv
    this.registerB = Math.floor(this.registerA / 2 ** this.getComboOperand(x));
    this.pointer += 2;
  }

  op7(x) { // cdv
    this.registerC = Math.floor(this.registerA / 2 ** this.getComboOperand(x));
    this.pointer += 2;
  }

  getOutput() {
    return this.output.join(',');
  }

  runDebugger(program) {
    while (this.pointer < program.length) {
      const op = program[this.pointer];
      const val = program[this.pointer + 1];
      this[`op${op}`](val);
    }
  }
}

function getDebuggerOutput(registers, program) {
  const device = new Debugger(registers[0]);
  device.runDebugger(program);
  console.log(device.getOutput());
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function getPossibleNumsForXXX(xxx) {
  let possibleNums = [''];
  for (let i = 2; i >= 0; i--) {
    if (xxx[i] === 'x') {
      possibleNums = possibleNums.map(n => ['0' + n, '1' + n]).flat();
    } else {
      possibleNums = possibleNums.map(n => xxx[i] + n);
    }
  }
  return possibleNums;
}

/* 
  For part 2, it was necessary to do a reverse-engineering of the debugger to see what exactly is going on inside.
  (NOTE: this is only for my input, it may have slight differences for other inputs)
  To best describe the process, let's use an example. Suppose, we need to get "2" as the first output.
  What debugger does, is perform a xxx ^ 3, where "xxx" are last 3 bits of regA. Let's call the result "Y"
  Then, let's cut last Y bits from regA and focus on last 3 bits from remaining number. 
  Those last 3 bits (call them yyy) must be chosen in a way that (Y ^ 5) ^ yyy = 2.
  So, matching numbers would be: 100000   ->   xxx = 0,   Y = 0^3 = 3,   cut 3 bits to 100 (4 in dec),    3^5^4 = 2
      ("x" mean any digit)  x000xxxx100   ->   xxx = 4,   Y = 4^3 = 7,   cut 7 bits to 000 (0 in dec),    7^5^0 = 2
                              x010xx110, x001xxx101, x011x111 -> ...same process...
  This way, we're left with 5 candidates that will produce output starting with "2". 
  Then, if the next output is supposed to be "4", we're using those candidates to find next matching bits. 
  At this point, last 3 bits from regA are now "stabilized" (because debugger does regA /= 8), so from "x010xx110", we're only analyzing "x010xx" and treat "0xx" as last bits
*/
function findRegisterToGetCopy(program) {
  let lowestMatch = Infinity;
  let regA = 'xxx'.repeat(program.length + 2);

  const buildRegA = (currentReg, lastId, resultId) => {
    if (program[resultId] === undefined) {
      const parsedNum = parseInt(currentReg.replaceAll('x', 0), 2);

      const device = new Debugger(parsedNum);
      device.runDebugger(program);
      if (device.getOutput() === program.join(',')) {
        if (parsedNum < lowestMatch) lowestMatch = parsedNum;
      }
      return;
    }

    const possibleNums = getPossibleNumsForXXX(currentReg.slice(lastId-2, lastId+1));
    possibleNums.forEach(num => {
      const numDec = parseInt(num, 2);
      const numXor3 = numDec ^ 3;
      const finalNum = numXor3 ^ 5;
      let newReg = currentReg;
      for (let i = 0; i < 3; i++) {
        newReg = newReg.replaceAt(lastId-i, num[2-i]);
      }

      const possiblePair = getPossibleNumsForXXX(newReg.slice(lastId - 2 - numXor3, lastId + 1 - numXor3));
      possiblePair.forEach(pair => {
        const pairDec = parseInt(pair, 2);
        if ((finalNum ^ pairDec) === program[resultId]) {
          let finalReg = newReg;
          for (let i = 0; i < 3; i++) {
            finalReg = finalReg.replaceAt(lastId-numXor3-i, pair[2-i]);
          }
          buildRegA(finalReg, lastId - 3, resultId + 1);
        }
      })
    })
  }
  buildRegA(regA, regA.length - 1, 0);

  console.log(lowestMatch);
}

// Day 18
const day18_bytes = fs.readFileSync('./2024/day18.txt', 'utf-8').split('\n').map(row => row.split(',').map(Number));
const Graph = require('node-dijkstra');

function findPathThroughMemory(bytes) {
  const memory = Array(71).fill('.').map(() => Array(71).fill('.'));
  bytes.slice(0, 1024).forEach(byte => {
    memory[byte[1]][byte[0]] = '#';
  });

  const route = new Graph();
  for (let y = 0; y < memory.length; y++) {
    for (let x = 0; x < memory[0].length; x++) {
      const from = `${x},${y}`;
      const to = new Map();
      if (memory[y-1] && memory[y-1][x] === '.') to.set(`${x},${y-1}`, 1);
      if (memory[y][x-1] === '.') to.set(`${x-1},${y}`, 1);
      if (memory[y][x+1] === '.') to.set(`${x+1},${y}`, 1);
      if (memory[y+1] && memory[y+1][x] === '.' ) to.set(`${x},${y+1}`, 1);

      route.addNode(from, to);
    }
  }
  const foundRoute = route.path("0,0", '70,70', { cost: true })
  console.log(foundRoute.cost); // part 1

  let lastPath = foundRoute.path;
  for (let b = 1024;; b++) {
    const byte = bytes[b];
    memory[byte[1]][byte[0]] = '#';
    route.removeNode(`${byte[0]},${byte[1]}`);
    if (!lastPath.includes(`${byte[0]},${byte[1]}`)) continue;

    const foundRoute = route.path("0,0", '70,70', { cost: true })
    if (foundRoute.cost === 0) {
      console.log(bytes[b].join(','));
      return;
    } else {
      lastPath = foundRoute.path;
    }
  }
}

// Day 19
let [day19_towels, day19_designs] = fs.readFileSync('./2024/day19.txt', 'utf-8').split('\n\n');
day19_towels = day19_towels.split(', ');
day19_designs = day19_designs.split('\n');

function arrangeTowels(towels, designs) {
  let possibleCount = 0;
  let waysCount = 0;

  designs.forEach(design => {
    const memo = {};
    const createPattern = (patternLeft) => {
      if (!patternLeft) return 1;
      if (memo[patternLeft] !== undefined) return memo[patternLeft];
      let thisCount = 0;
      towels.filter(t => patternLeft.startsWith(t)).forEach(t => {
        thisCount += createPattern(patternLeft.replace(t, ''));
      });
      return memo[patternLeft] = thisCount;
    }
    
    const count = createPattern(design);
    if (count > 0) possibleCount++;
    waysCount += count;
  });

  console.log(possibleCount);
  console.log(waysCount);
}

// Day 20
const day20_map = fs.readFileSync('./2024/day20.txt', 'utf-8').split('\n').map(row => row.split(''));

function findCheatsInRace(map) {
  const start = [0, 0];
  const end = [0, 0]
  const minSave = 100;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 'S') {
        start[0] = x;
        start[1] = y;
        map[y][x] = '.';
      }
      if (map[y][x] === 'E') {
        end[0] = x;
        end[1] = y;
        map[y][x] = '.'
      }
    }
  }

  const route = new Graph();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] !== '.') continue;
      const from = `${x},${y}`;
      const to = new Map();
      if (map[y-1] && map[y-1][x] === '.') to.set(`${x},${y-1}`, 1);
      if (map[y][x-1] === '.') to.set(`${x-1},${y}`, 1);
      if (map[y][x+1] === '.') to.set(`${x+1},${y}`, 1);
      if (map[y+1] && map[y+1][x] === '.' ) to.set(`${x},${y+1}`, 1);

      route.addNode(from, to);
    }
  }
  const normalRoute = route.path(start.join(','), end.join(','), { cost: true });

  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const CHEATING_DIRS = [[-2, 0], [2, 0], [0, -2], [0, 2]];

  let goodCheats = 0;
  normalRoute.path.slice(0, -minSave).forEach((field, id) => {
    const [x, y] = field.split(',').map(Number);
    CHEATING_DIRS.forEach(cheat => {
      const nextTile = [x + cheat[0], y + cheat[1]].join(',');
      const tileId = normalRoute.path.indexOf(nextTile);
      if (tileId !== -1 && tileId > id + minSave) {
        goodCheats++;
      }
    });
  });
  console.log(goodCheats); // Part 1

  let betterCheats = 0;
  const maxCheat = 20;

  normalRoute.path.slice(0, -minSave).forEach((field, id) => {
    const [x, y] = field.split(',').map(Number);
    const memo = {};
    const endTiles = new Set();
    const goCheat = (x, y, time) => {
      const key = `${x},${y}`;
      if (memo[key] && memo[key] <= time) return;
      memo[key] = time;

      if (key !== field && map[y][x] === '.') {
        const tileId = normalRoute.path.indexOf(key);
        if (tileId - minSave >= id + time) {
          endTiles.add(key);
        }
      }
      if (time === maxCheat) return;

      DIRS.forEach(dir => {
        const nextTile = [x + dir[0], y + dir[1]];
        if (map[nextTile[1]] && map[nextTile[1]][nextTile[0]]) {
          goCheat(nextTile[0], nextTile[1], time + 1);
        }
      });
    }
    goCheat(x, y, 0, []);
    betterCheats += endTiles.size;
  });

  console.log(betterCheats);
}

// Day 21
const day21_codes = fs.readFileSync('./2024/day21.txt', 'utf-8').split('\n');

const memoNumeric = {};
function getPathOnNumeric(from, to) {
  const numericKeypad = [['7','8','9'], ['4','5','6'], ['1','2','3'], [undefined, '0', 'A']];
  const key = `${from}->${to}`;
  if (memoNumeric[key]) return memoNumeric[key];
  let currentPos, targetPos;
  for (let y = 0; y < numericKeypad.length; y++) {
    for (let x = 0; x < numericKeypad[0].length; x++) {
      if (numericKeypad[y][x] === from) {
        currentPos = { x, y };
      }
      if (numericKeypad[y][x] === to) {
        targetPos = { x, y };
      }
    }
  }

  const paths = [];
  const findPath = (x, y, currentPath) => {
    if (x === targetPos.x && y === targetPos.y) {
      paths.push(currentPath + 'A');
      return;
    }
    if(y > targetPos.y && numericKeypad[y-1][x]) {
      findPath(x, y-1, currentPath + '^');
    }
    if(y < targetPos.y && numericKeypad[y+1][x]) {
      findPath(x, y+1, currentPath + 'v');
    }
    if(x < targetPos.x && numericKeypad[y][x+1]) {
      findPath(x+1, y, currentPath + '>');
    }
    if(x > targetPos.x && numericKeypad[y][x-1]) {
      findPath(x-1, y, currentPath + '<');
    }
  }
  findPath(currentPos.x, currentPos.y, '');

  return memoNumeric[key] = paths;
}

const memoDir = {};
function getPathOnDirectional(from, to) {
  const directionalKeypad = [[undefined, '^', 'A'], ['<', 'v', '>']];
  const key = `${from}->${to}`;
  if (memoDir[key]) return memoDir[key];
  let currentPos, targetPos;
  for (let y = 0; y < directionalKeypad.length; y++) {
    for (let x = 0; x < directionalKeypad[0].length; x++) {
      if (directionalKeypad[y][x] === from) {
        currentPos = { x, y };
      }
      if (directionalKeypad[y][x] === to) {
        targetPos = { x, y };
      }
    }
  }

  const paths = [];
  const findPath = (x, y, currentPath) => {
    if (x === targetPos.x && y === targetPos.y) {
      paths.push(currentPath + 'A');
      return;
    }
    if(y > targetPos.y && directionalKeypad[y-1][x]) {
      findPath(x, y-1, currentPath + '^');
    }
    if(y < targetPos.y && directionalKeypad[y+1][x]) {
      findPath(x, y+1, currentPath + 'v');
    }
    if(x < targetPos.x && directionalKeypad[y][x+1]) {
      findPath(x+1, y, currentPath + '>');
    }
    if(x > targetPos.x && directionalKeypad[y][x-1]) {
      findPath(x-1, y, currentPath + '<');
    }
  }
  findPath(currentPos.x, currentPos.y, '');

  return memoDir[key] = paths;
}

let movingMemo = {};
function moveRobot(robotId, robotsPositions, target) {
  const robotPaths = getPathOnDirectional(robotsPositions[robotId], target);
  let updatedRobotPositions = [...robotsPositions];
  let bestPath = { id: 999, length: Infinity };
  const key = `${robotsPositions[robotId]}x${robotId}x${target}`;
  if (movingMemo[key]) {
    updatedRobotPositions[robotId] = target;
    return { bestPath: movingMemo[key], updatedRobotPositions }
  }

  robotPaths.forEach((path, id) => {
    if (robotsPositions[robotId+1]) { // more robots on the way
      let L = 0;
      let lastPositions = [...robotsPositions];
      path.split('').forEach(move => {
        const movingData = moveRobot(robotId + 1, lastPositions, move);
        L += movingData.bestPath.length;
        lastPositions = movingData.updatedRobotPositions;
      });
      if (L < bestPath.length) {
        bestPath = { id, length: L };
        updatedRobotPositions = lastPositions;
      }
    } else { // this is the last robot
      if (path.length < bestPath.length) {
        bestPath = { id, length: path.length };
      }
    }
  });

  updatedRobotPositions[robotId] = target;
  movingMemo[key] = bestPath;
  return { bestPath, updatedRobotPositions };
}

function pushTheKeypad(codes, robots) {  
  let complexity = 0;

  codes.forEach(codeToEnter => {
    let totalMoves = 0;
    let lastNumPosition = 'A';
    let mainRobotPositions = Array(robots).fill('A');
    codeToEnter.split('').forEach(code => {
      const paths = getPathOnNumeric(lastNumPosition, code);
      lastNumPosition = code;
      let thisMoves = Infinity;
      paths.forEach(path => {
        let bestPathMove = 0;
        const robotPositions = [...mainRobotPositions];
        path.split('').forEach(move => {
          const movingData = moveRobot(0, robotPositions, move);
          bestPathMove += movingData.bestPath.length;
          robotPositions[0] = movingData.updatedRobotPositions[0];
          robotPositions[1] = movingData.updatedRobotPositions[1];
        });
        if (bestPathMove < thisMoves) {
          thisMoves = bestPathMove;
          mainRobotPositions = robotPositions;
        }
      });
      totalMoves += thisMoves;
    });

    complexity += totalMoves * Number(codeToEnter.match(NUMBER_REGEX));
  });

  movingMemo = {} // clear memo for next part
  console.log(complexity);
}

// Day 22
const day22_numbers = fs.readFileSync('./2024/day22.txt', 'utf-8').split('\n').map(Number);

function getMostBananas(numbers) {
  let finalNums = numbers.map(num => ({ num, changes: [] }));
  const mod = 16777216;
  const changesList = [];
  for (let op = 1; op <= 2000; op++) {
    finalNums = finalNums.map(({ num, changes }, id) => {
      const orgPrice = num % 10;
      num = ((num * 64) ^ num) % mod;
      if (num < 0) num += mod;
      num = (Math.floor(num / 32) ^ num) % mod;
      if (num < 0) num += mod;
      num = ((num * 2048) ^ num) % mod;
      if (num < 0) num += mod;
      const newPrice = num % 10;
      changes.push(newPrice - orgPrice);
      if (changes.length > 4) changes.shift();
      if (changes.length === 4) {
        if (!changesList[id]) changesList[id] = { best: [] };
        const cId = changes.join(',');
        if (!changesList[id][cId]) changesList[id][cId] = newPrice;
        if (newPrice === 9) {
          changesList[id].best.push(cId);
        }
      }

      return { num, changes };
    });
  }

  console.log(finalNums.reduce((a, b) => a + b.num, 0)); // part 1

  let bestBananas = 0;
  const checked = {};
  changesList.map(cl => cl.best).forEach(bestChanges => {
    bestChanges.forEach(bestChange => {
      if (checked[bestChange]) return;
      checked[bestChange] = true;
      const matches = changesList.map(cl => cl[bestChange]);
      const sum = matches.reduce((a, b) => a + (b || 0), 0);
      if (sum > bestBananas) {
        bestBananas = sum;
      }
    });
  });
  
  console.log(bestBananas);
}

// Day 23
const day23_computers = fs.readFileSync('./2024/day23.txt', 'utf-8').split('\n');

function findLanParties(computers) {
  const connections = {};
  const tComps = new Set();
  computers.forEach(lan => {
    const [comp1, comp2] = lan.split('-');
    if (!connections[comp1]) connections[comp1] = [];
    if (!connections[comp2]) connections[comp2] = [];
    connections[comp1].push(comp2);
    connections[comp2].push(comp1);
    if (comp1.startsWith('t')) tComps.add(comp1);
    if (comp2.startsWith('t')) tComps.add(comp2);
  });
  let partiesOf3 = new Set();
  
  for (const tComp of tComps) {
    connections[tComp].forEach(connected => {
      const commonComps = connections[tComp].filter(c => connections[connected].includes(c));
      commonComps.forEach(common => {
        const party = [tComp, connected, common].sort().join(',');
        partiesOf3.add(party)
      });
    });
  }
  console.log(partiesOf3.size); // part 1

  let biggestParty = 0;
  let password = '';

  const memo = {};
  for (const tComp of tComps) {
    const addComp = (currentComp, compsAdded) => {
      const pass = [...compsAdded, currentComp].sort().join(',');
      if (memo[pass]) return;
      memo[pass] = true;

      if (compsAdded.length + 1 > biggestParty) {
        biggestParty = compsAdded.length + 1;
        password = pass;
      }

      connections[currentComp].filter(c => compsAdded.every(ca => connections[c].includes(ca))).forEach(newComp => {
        addComp(newComp, [...compsAdded, currentComp]);
      });
    }
    addComp(tComp, []);
  }
  console.log(password);
}

// Day 24
const [day24_wires, day24_gates] = fs.readFileSync('./2024/day24.txt', 'utf-8').split('\n\n').map(data => data.split('\n'));

function getOutputFromGates(wires, gates) {
  const allWires = {};
  wires.forEach(w => {
    const [wire, value] = w.split(': ');
    allWires[wire] = Number(value);
  });
  
  while (true) {
    let newConnections = false;
    gates.forEach(g => {
      const [wireA, op, wireB, _, output] = g.split(' ');
      if (allWires[output] === undefined) {
        if (allWires[wireA] !== undefined && allWires[wireB] !== undefined) {
          newConnections = true;
          if (op === 'OR') allWires[output] = allWires[wireA] | allWires[wireB];
          else if (op === 'AND') allWires[output] = allWires[wireA] & allWires[wireB];
          else allWires[output] = allWires[wireA] ^ allWires[wireB];
        }
      }
    });
    if (!newConnections) break;
  }

  let num = '';
  for (let z = 0;; z++) {
    if (allWires[`z${z.toString().padStart(2, '0')}`] !== undefined) {
      num = allWires[`z${z.toString().padStart(2, '0')}`] + num;
    } else break;
  }
  console.log(parseInt(num, 2));
}

/* 
  Really nice task. I googled how to make an addition using binary gates and got this:
  https://www.electronics-tutorials.ws/combination/comb_7.html
  Then, it was just a matter of following those 5 operations per bit & carry presented on the "Full Adder Truth Table with Carry" and catching errors
*/
function fixMixedGates(gates) {
  let cOut = gates.find(g => g.startsWith('y00 AND x00') || g.startsWith('x00 AND y00')).split('-> ')[1];

  const mixedPairs = [];
  for (let i = 1; i <= 44; i++) {
    const wireA = `x${i.toString().padStart(2, '0')}`;
    const wireB = `y${i.toString().padStart(2, '0')}`;
    let firstXOR = gates.find(g => g.startsWith(`${wireA} XOR ${wireB}`) || g.startsWith(`${wireB} XOR ${wireA}`)).split('-> ')[1];
    let firstAND = gates.find(g => g.startsWith(`${wireA} AND ${wireB}`) || g.startsWith(`${wireB} AND ${wireA}`)).split('-> ')[1];
    let sum;
    try {
      sum = gates.find(g => g.startsWith(`${cOut} XOR ${firstXOR}`) || g.startsWith(`${firstXOR} XOR ${cOut}`)).split('-> ')[1];
    } catch (e) {
      const cache = firstAND;
      firstAND = firstXOR;
      firstXOR = cache;
      mixedPairs.push(firstAND, firstXOR);
      sum = gates.find(g => g.startsWith(`${cOut} XOR ${firstXOR}`) || g.startsWith(`${firstXOR} XOR ${cOut}`)).split('-> ')[1];
    }

    const correctSum = `z${i.toString().padStart(2, '0')}`;
    if (sum !== correctSum) {
      if (firstXOR === correctSum) {
        mixedPairs.push(firstXOR, sum);
        firstXOR = sum;
        sum = correctSum;
      } else if (firstAND === correctSum) {
        mixedPairs.push(firstAND, sum);
        firstAND = sum;
        sum = correctSum;
      }
    }
    
    let secondAND = gates.find(g => g.startsWith(`${firstXOR} AND ${cOut}`) || g.startsWith(`${cOut} AND ${firstXOR}`)).split('-> ')[1];
    if (secondAND === correctSum) {
      mixedPairs.push(secondAND, sum);
      secondAND = sum;
      sum = correctSum;
    }

    let newCout = gates.find(g => g.startsWith(`${firstAND} OR ${secondAND}`) || g.startsWith(`${secondAND} OR ${firstAND}`)).split('-> ')[1];
    if (newCout === correctSum) {
      mixedPairs.push(newCout, sum);
      newCout = sum;
      sum = correctSum;
    }
    cOut = newCout;
  }
  
  console.log(mixedPairs.sort().join(','));
}

// Day 25
const day25_locks_n_keys = fs.readFileSync('./2024/day25.txt', 'utf-8').split('\n\n');

function matchKeysToLocks(locksAndKeys) {
  const locks = [];
  const keys = [];

  locksAndKeys.forEach(lockOrKey => {
    const isLock = lockOrKey.startsWith('#####');
    const asArray = lockOrKey.split('\n').map(row => row.split(''));
    const sizes = [];
    for (let col = 0; col < 5; col++) {
      let size = 0;
      for (let row = isLock ? 1 : 5; isLock ? row <= 5 : row >= 1; isLock ? row++ : row--) {
        if (asArray[row][col] === '#') size++;
        else break;
      }
      sizes.push(size);
    }
    if (isLock) locks.push(sizes);
    else keys.push(sizes);
  }); 

  let fits = 0;
  for (const lock of locks) {
    for (const key of keys) {
      if (lock.every((pin, id) => key[id] + pin <= 5 )) fits++;
    }
  }
  console.log(fits);
}


// -----Answers for solved days-----
// Uncomment proper lines to get them
// Total runtime: 384.6 sec

// console.log('Day 1, part 1:');
// getDifferenceInLists(day1_locations);
// console.log('Day 1, part 2:');
// getSimilarityInLists(day1_locations);

// console.log('Day 2, part 1:');
// countSafeReports(day2_reports);
// console.log('Day 2, part 2:');
// countSafeReportsWithTolerance(day2_reports);

// console.log('Day 3, part 1:');
// mulNumbers(day3_commands);
// console.log('Day 3, part 2:');
// mulNumbersAdvanced(day3_commands);

// console.log('Day 4, part 1:');
// findXMAS(day4_letters);
// console.log('Day 4, part 2:');
// findX_MAS(day4_letters);

// console.log('Day 5, part 1:');
// sumCorrectPages(day5_rules, day5_pages);
// console.log('Day 5, part 2:');
// fixIncorrectPages(day5_rules, day5_pages);

// console.log('Day 6, part 1:');
// countVisitedPlaces(day6_map);
// console.log('Day 6, part 2:');
// createLoops(day6_map);

// console.log('Day 7, part 1:');
// calibrateOperations(day7_data);
// console.log('Day 7, part 2:');
// calibrateOperations(day7_data, true);

// console.log('Day 8, part 1:');
// countAntinodes(day8_antennas);
// console.log('Day 8, part 2:');
// countAntinodes(day8_antennas, true);

// console.log('Day 9, part 1:');
// moveFiles([...day9_diskData]);
// console.log('Day 9, part 2:');
// moveFileblocks(day9_diskData);

// console.log('Day 10, part 1 & 2:');
// searchHikingTrails(day10_map);

// console.log('Day 11, part 1:');
// blinkOnStones(day11_stones, 25);
// console.log('Day 11, part 2:');
// blinkOnStones(day11_stones, 75);

// console.log('Day 12, part 1 & 2:');
// getPriceOfFence(day12_map);

// console.log('Day 13, part 2:');
// getPrizesFromClawMachines(day13_machines);
// console.log('Day 13, part 2:');
// getPrizesFromClawMachines(day13_machines, 10000000000000);

// console.log('Day 14, part 1:');
// countRobotsInQuadrants(day14_robots);
// console.log('Day 14, part 2:');
// findChristmasTree(day14_robots);

// console.log('Day 15, part 1:');
// moveBoxes(day15_map, day15_moves);
// console.log('Day 15, part 2:');
// moveWideBoxes(day15_map, day15_moves);

// console.log('Day 16, part 1 & 2:');
// watchReindeerOlympics(day16_map);

// console.log('Day 17, part 1:');
// getDebuggerOutput(day17_registers, day17_program);
// console.log('Day 17, part 2:');
// findRegisterToGetCopy(day17_program);

// console.log('Day 18, part 1 & 2:');
// findPathThroughMemory(day18_bytes);

// console.log('Day 19, part 1 & 2:');
// arrangeTowels(day19_towels, day19_designs);

// console.log('Day 20, part 1 & 2:');
// findCheatsInRace(day20_map); // Part 2 takes about 6 minutes

// console.log('Day 21, part 1:');
// pushTheKeypad(day21_codes, 2);
// console.log('Day 21, part 2:');
// pushTheKeypad(day21_codes, 25);

// console.log('Day 22, part 1 & 2:');
// getMostBananas(day22_numbers);

// console.log('Day 23, part 1 & 2:');
// findLanParties(day23_computers);

// console.log('Day 24, part 1:');
// getOutputFromGates(day24_wires, day24_gates);
// console.log('Day 24, part 2:');
// fixMixedGates(day24_gates);

// console.log('Day 25:');
// matchKeysToLocks(day25_locks_n_keys);
