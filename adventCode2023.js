const fs = require("fs");

//Day 1
const day1_calibration = fs.readFileSync('./2023/day1.txt', 'utf-8').split('\n');

function getCalibrationValues(calibration) {
  let sum = 0;
  calibration.forEach(c => {
    const digits = c.match(/-?[0-9]+/g);
    sum += Number(`${digits[0][0]}${digits[digits.length-1].slice(-1)}`);
  });
  console.log(sum);
}

function getRealCalibrationValues(calibration) {
  const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  let sum = 0;
  calibration.forEach(c => {
    let first, last;
    for (let i = 0; i < c.length; i++) {
      if (!Number.isNaN(Number(c[i]))) {
        first = c[i];
        break;
      } else if (digits.some(d => c.slice(i).startsWith(d))) {
        first = digits.findIndex(d => c.slice(i).startsWith(d)) + 1;
        break;
      }
    }
    for (let i = c.length - 1; i >= 0; i--) {
      if (!Number.isNaN(Number(c[i]))) {
        last = c[i];
        break;
      } else if (digits.some(d => c.slice(0, i+1).endsWith(d))) {
        last = digits.findIndex(d => c.slice(0, i+1).endsWith(d)) + 1;
        break;
      }
    }
    sum += Number(`${first}${last}`);
  });

  console.log(sum);
}

// Day 2
const day2_games = fs.readFileSync('./2023/day2.txt', 'utf-8').split('\n');

function checkCubeGames(games) {
  let sum = 0;
  let power = 0;
  const max = {
    red: 12,
    green: 13,
    blue: 14,
  };

  games.forEach((game, id) => {
    game = game.split(': ')[1];

    const sets = game.split('; ');
    let possible = true;
    const min = { red: 0, green: 0, blue: 0 };
    for (const set of sets) {
      const cubes = set.split(', ');
      for (const cube of cubes) {
        const [count, color] = cube.split(' ');
        if (Number(count) > max[color]) possible = false;
        min[color] = Math.max(min[color], Number(count));
      }
    }
    if (possible) sum += id + 1;
    power += Object.values(min).reduce((a, b) => a * b, 1);
  });

  console.log(sum);
  console.log(power);
}

// Day 3
const day3_engine = fs.readFileSync('./2023/day3.txt', 'utf-8').split('\n').map(row => row.split(''));

function fixTheEngine(engine) {
  let sum = 0;
  const gearsData = {};

  for (let y = 0; y < engine.length; y++) {
    for (let x = 0; x < engine[0].length; x++) {
      if (!Number.isNaN(Number(engine[y][x]))) {
        let xx = x;
        let num = ''
        while (!Number.isNaN(Number(engine[y][xx]))) {
          num += engine[y][xx];
          xx++;
        }
        xx--;
        num = Number(num);

        // Check left & right
        if ((x > 0 && engine[y][x-1] !== '.') || 
        (x < engine[0].length - 1 && engine[y][xx+1] && engine[y][xx+1] !== '.')) {
          sum += num;
          if (engine[y][x-1] === '*') {
            if (!gearsData[`${y},${x-1}`]) gearsData[`${y},${x-1}`] = [0, 1];
            gearsData[`${y},${x-1}`][0]++;
            gearsData[`${y},${x-1}`][1] *= num;
          } else if (engine[y][xx+1] === '*') {
            if (!gearsData[`${y},${xx+1}`]) gearsData[`${y},${xx+1}`] = [0, 1];
            gearsData[`${y},${xx+1}`][0]++;
            gearsData[`${y},${xx+1}`][1] *= num;
          }
          x = xx;
          continue;
        }
        // Check top
        if (y > 0) {
          let symbolFound = null;
          for (let i = Math.max(0, x-1); i <= Math.min(engine[0].length-1, xx+1); i++) {
            if (engine[y-1][i] !== '.') {
              symbolFound = { id: `${y-1},${i}`, symbol: engine[y-1][i] };
              break;
            }
          }
          if (symbolFound) {
            sum += num;
            if (symbolFound.symbol === '*') {
              if (!gearsData[symbolFound.id]) gearsData[symbolFound.id] = [0, 1];
              gearsData[symbolFound.id][0]++;
              gearsData[symbolFound.id][1] *= num;
            }
            x = xx;
            continue;
          }
        }
        // Check bottom
        if (y < engine.length - 1) {
          let symbolFound = null;
          for (let i = Math.max(0, x-1); i <= Math.min(engine[0].length-1, xx+1); i++) {
            if (engine[y+1][i] !== '.') {
              symbolFound = { id: `${y+1},${i}`, symbol: engine[y+1][i] };
              break;
            }
          }
          if (symbolFound) {
            sum += num;
            if (symbolFound.symbol === '*') {
              if (!gearsData[symbolFound.id]) gearsData[symbolFound.id] = [0, 1];
              gearsData[symbolFound.id][0]++;
              gearsData[symbolFound.id][1] *= num;
            }
            x = xx;
            continue;
          }
        }
        x = xx;
      }
    }
  }

  console.log(sum);

  let gearRatio = 0;
  Object.values(gearsData).forEach(([count, value]) => {
    if (count === 2) {
      gearRatio += value
    }
  });
  console.log(gearRatio);
}

// Day 4
const day4_scratchcards = fs.readFileSync('./2023/day4.txt', 'utf-8').split('\n');

function scratchSomeCards(cards) {
  let sum = 0;

  cards.forEach(card => {
    const [winning, my] = card.split(' | ').map(x => x.match(/-?[0-9]+/g).map(Number));
    winning.shift(); // Remove Card id
    
    let scored = 0;
    my.forEach(c => {
      if (winning.includes(c)) scored++;
    });
    if (scored > 0) {
      sum += 2 ** (scored - 1);
    }
  });

  console.log(sum);
}

function countWonCards(cards) {
  const memo = {};

  let count = 0;
  const scratchSet = (data) => {
    const st = cards.indexOf(data[0]);
    const key = `${st}x${data.length}`;
    if (memo[key]) {
      count += memo[key];
      return memo[key];
    }
    let thisCount = 0;

    data.forEach((card, id) => {
      thisCount++;
      count++;
      const [winning, my] = card.split(' | ').map(x => x.match(/-?[0-9]+/g).map(Number));
      winning.shift(); // Remove Card id

      let scored = 0;
      my.forEach(c => {
        if (winning.includes(c)) scored++;
      });
      if (scored > 0) {
        thisCount += scratchSet(cards.slice(st+id+1, st+id+scored+1));
      }
    });
    return memo[key] = thisCount;
  }

  scratchSet(cards);
  console.log(count);
}

// Day 5
const day5_almanac = fs.readFileSync('./2023/day5.txt', 'utf-8').split('\n\n');

function placeSeeds(almanac) {
  const seeds = almanac.shift().match(/-?[0-9]+/g).map(Number);
  let minSeed = 999999999999;
  
  seeds.forEach(seed => {
    for (const entry of almanac) {
      const ranges = entry.split('\n');
      ranges.shift(); // remove title
      for (const r of ranges) {
        const [dest, source, len] = r.match(/-?[0-9]+/g).map(Number);
        if (seed >= source && seed <= source + len) {
          const diff = seed - source;
          seed = dest + diff;
          break;
        }
      }
    }
    if (seed < minSeed) minSeed = seed;
  });
  
  console.log(minSeed);
}

function placeRangesOfSeeds(almanac) {
  let seedData = almanac.shift().match(/-?[0-9]+/g).map(Number);
  let seeds = [];

  for (let i = 0; i < seedData.length; i += 2) {
    seeds.push([seedData[i], seedData[i] + seedData[i+1]]);
  }
  seeds.sort((a, b) => a[0] - b[0]);

  for (const entry of almanac) {
    const ranges = entry.split('\n');
    ranges.shift(); // remove title
    const updatedSeeds = [];

    for (const r of ranges) {
      const [dest, source, len] = r.match(/-?[0-9]+/g).map(Number);
      const sourceTo = source + len;

      for (let s = seeds.length - 1; s >= 0; s--) {
        const [from, to] = seeds[s];
        if (to < source) continue;
        if (sourceTo < from) continue;
        seeds.splice(s, 1);

        if (from >= source && to <= sourceTo) {
          const diff = from - source;
          updatedSeeds.push([dest + diff, dest + (to-from) + diff]);
        } else {
          const newFrom = Math.max(from, source);
          const newTo = Math.min(to, sourceTo);

          if (newFrom > from) {
            seeds.unshift([from, newFrom - 1]);
            s++;
          }
          if (newTo < to) {
            seeds.unshift([newTo + 1, to]);
            s++;
          }

          const diff = newFrom - source;
          updatedSeeds.push([dest + diff, dest + (newTo-newFrom) + diff]);
        }
      }
    }

    seeds = [...seeds, ...updatedSeeds];
    seeds.sort((a, b) => a[0] - b[0]);
  }

  console.log(seeds[0][0]);
}

// Day 6
const day6_races = fs.readFileSync('./2023/day6.txt', 'utf-8').split('\n');

function accelerateBoat(data, join = false) {
  let times = data[0].match(/-?[0-9]+/g).map(Number);
  let dist = data[1].match(/-?[0-9]+/g).map(Number);
  if (join) {
    times = [Number(times.join(''))];
    dist = [Number(dist.join(''))];
  }

  let mul = 1;
  for (let x = 0; x < times.length; x++) {
    let beat = 0;
    for (let hold = 1; hold < times[x]; hold++) {
      let res = hold * (times[x] - hold);
      if (res > dist[x]) beat++;
    }
    mul *= beat;
  }

  console.log(mul);
}

// Day 7
const day7_cards = fs.readFileSync('./2023/day7.txt', 'utf-8').split('\n');
const cardsOrder = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardsOrderPart2 = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];
const comboOrder = ['HighCard', 'OnePair', 'TwoPairs', 'ThreeOfAKind', 'FullHouse', 'FourOfAKind', 'FiveOfAKind'];

function findCombination(hand, withJoker = false) {
  const repetitions = {};
  hand.forEach(card => {
    if (!repetitions[card]) repetitions[card] = 1;
    else repetitions[card]++;
  });

  if (withJoker && repetitions['J'] && repetitions['J'] < 5) {
    const jokers = repetitions['J'];
    delete repetitions['J'];
    const max = Object.entries(repetitions).sort((a, b) => b[1] - a[1])[0];
    repetitions[max[0]] += jokers;
  }

  if (Object.values(repetitions).includes(5)) {
    return 'FiveOfAKind';
  } else if (Object.values(repetitions).includes(4)) {
    return 'FourOfAKind';
  } else if (Object.values(repetitions).includes(3)) {
    if (Object.values(repetitions).includes(2)) {
      return 'FullHouse';
    } else {
      return 'ThreeOfAKind';
    }
  } else if (Object.values(repetitions).includes(2)) {
    if (Object.values(repetitions).filter(v => v === 2).length === 2) {
      return 'TwoPairs';
    } else {
      return 'OnePair';
    }
  }

  return 'HighCard';
}

function rankPokerHands(pokerData, withJoker = false) {
  const combos = pokerData.map(deal => {
    const [cards, points] = deal.split(' ');
    const playerCombo = findCombination(cards.split(''), withJoker);
    return { combo: playerCombo, points: Number(points), cards: cards.split('') };
  });

  const correctOrder = withJoker ? cardsOrderPart2 : cardsOrder;
  
  combos.sort((a, b) => comboOrder.indexOf(a.combo) - comboOrder.indexOf(b.combo) || 
    correctOrder.indexOf(a.cards[0]) - correctOrder.indexOf(b.cards[0]) ||
    correctOrder.indexOf(a.cards[1]) - correctOrder.indexOf(b.cards[1]) ||
    correctOrder.indexOf(a.cards[2]) - correctOrder.indexOf(b.cards[2]) ||
    correctOrder.indexOf(a.cards[3]) - correctOrder.indexOf(b.cards[3]) ||
    correctOrder.indexOf(a.cards[4]) - correctOrder.indexOf(b.cards[4])
  );
  
  let sum = 0;
  combos.forEach((c, id) => {
    sum += c.points * (id+1);
  })
  console.log(sum);
}

// Day 8
const day8_network = fs.readFileSync('./2023/day8.txt', 'utf-8').split('\n\n');

function navigateThroughSandstorm(network, start) {
  const steps = network[0].split('');
  const nodes = network[1].split('\n');

  let node = start;
  let nodeId = nodes.findIndex(x => x.startsWith(node));
  let moves = 0;
  while (!node.endsWith('Z')) {
    const dirs = nodes[nodeId].match(/[A-Z]+/g);
    if (steps[moves % steps.length] === 'L') {
      node = dirs[1];
    } else {
      node = dirs[2];
    }
    nodeId = nodes.findIndex(x => x.startsWith(node));
    moves++;
  }

  return moves;
}

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

function moveLikeGhost(network) {
  const nodes = network[1].split('\n');
  const movesAll = [];

  nodes.forEach(node => {
    const dirs = node.match(/[A-Z]+/g);
    if (dirs[0].endsWith('A')) {
      movesAll.push(navigateThroughSandstorm(network, dirs[0]));
    }
  })

  console.log(lcm(...movesAll));
}

// Day 9
const day9_report = fs.readFileSync('./2023/day9.txt', 'utf-8').split('\n');

function extrapolateOasisHistory(report) {
  let sumOfLast = 0;
  let sumOfFirst = 0;
  for (let x = 0; x < report.length; x++) {
    const nums = [report[x].split(' ').map(Number)];
    while([...new Set(nums[nums.length-1])].toString() !== '0' && nums[nums.length-1].length > 0) {
      const newRow = []
      for (let a = 0; a < nums[nums.length-1].length-1; a++) {
        newRow.push(nums[nums.length-1][a+1] - nums[nums.length-1][a]);
      }
      nums.push(newRow);
    }
    
    for (let i = nums.length - 2; i >= 0; i--) {
      nums[i].push(nums[i][nums[i].length - 1] + nums[i+1][nums[i+1].length-1]);
      nums[i].unshift(nums[i][0] - nums[i+1][0]);
    }
    sumOfLast += nums[0][nums[0].length-1];
    sumOfFirst += nums[0][0];
  }

  console.log(sumOfLast);
  console.log(sumOfFirst);
}

// Day 10
const day10_pipes = fs.readFileSync('./2023/day10.txt', 'utf-8').split('\n').map(row => row.split(''));
const Graph = require('node-dijkstra');

function generateRoutesInPipes(pipes) {
  const routes = new Graph();
  let start;
  let end;

  for (let y = 0; y < pipes.length; y++) {
    for (let x = 0; x < pipes[0].length; x++) {
      if (pipes[y][x] === '.') continue;
      const from = `${x},${y}`;
      const to = new Map();

      if (pipes[y][x] === '|') {
        if (pipes[y-1] && ['|', '7', 'F'].includes(pipes[y-1][x])) to.set(`${x},${y-1}`, 1);
        if (pipes[y+1] && ['|', 'L', 'J'].includes(pipes[y+1][x])) to.set(`${x},${y+1}`, 1);
      } else if (pipes[y][x] === '-') {
        if (['-', 'J', '7'].includes(pipes[y][x+1])) to.set(`${x+1},${y}`, 1);
        if (['-', 'L', 'F'].includes(pipes[y][x-1])) to.set(`${x-1},${y}`, 1);
      } else if (pipes[y][x] === 'L') {
        if (pipes[y-1] && ['|', '7', 'F', 'S'].includes(pipes[y-1][x])) to.set(`${x},${y-1}`, 1);
        if (['-', 'J', '7'].includes(pipes[y][x+1])) to.set(`${x+1},${y}`, 1);
      } else if (pipes[y][x] === 'J') {
        if (pipes[y-1] && ['|', '7', 'F'].includes(pipes[y-1][x])) to.set(`${x},${y-1}`, 1);
        if (['-', 'L', 'F'].includes(pipes[y][x-1])) to.set(`${x-1},${y}`, 1);
      } else if (pipes[y][x] === '7') {
        if (pipes[y+1] && ['|', 'L', 'J'].includes(pipes[y+1][x])) to.set(`${x},${y+1}`, 1);
        if (['-', 'L', 'F'].includes(pipes[y][x-1])) to.set(`${x-1},${y}`, 1);
      } else if (pipes[y][x] === 'F') {
        if (pipes[y+1] && ['|', 'L', 'J'].includes(pipes[y+1][x])) to.set(`${x},${y+1}`, 1);
        if (['-', 'J', '7'].includes(pipes[y][x+1])) to.set(`${x+1},${y}`, 1);
      } else if (pipes[y][x] === 'S') {
        // Hardcoded looking at my input. It has "F" on the left, and "L" on the bottom
        start = [x-1, y].join(',');
        end = [x, y].join(',');
        pipes[y][x] = '7';
      }

      routes.addNode(from, to);
    }
  }

  return { start, end, routes };
}

function findFurthestPipe(pipes) {
  const { start, end, routes } = generateRoutesInPipes(pipes);

  const loop = routes.path(start, end, { cost: true, path: true });
  console.log((loop.cost + 1) / 2);
}

function squeezeBetweenPipes(pipes) {
  for (let y = 0; y < pipes.length; y += 2) {
    pipes.splice(y+1, 0, ' '.repeat(pipes[0].length).split(''));
  }

  for (let y = 0; y < pipes.length; y++) {
    for (let x = 0; x < pipes[y].length; x += 2) {
      pipes[y].splice(x+1, 0, ' ');
    }
    pipes[y].unshift(' ');
  }
  pipes.unshift(' '.repeat(pipes[0].length).split(''));

  // "S" works like "7" in my input
  for (let y = 1; y < pipes.length - 1; y++) {
    for (let x = 1; x < pipes[0].length - 1; x++) {
      if (pipes[y][x] !== ' ') continue;
      if (['-', 'F', 'L'].includes(pipes[y][x-1]) && ['-', 'J', '7', 'S'].includes(pipes[y][x+1])) {
        pipes[y][x] = '-';
      } else if (['|', 'F', '7', 'S'].includes(pipes[y-1][x]) && ['|', 'J', 'L'].includes(pipes[y+1][x])) {
        pipes[y][x] = '|';
      }
    }
  }

  const { start, end, routes } = generateRoutesInPipes(pipes);
  const loop = routes.path(start, end, { path: true });

  for (let y = 0; y < pipes.length; y++) {
    for (let x = 0; x < pipes[0].length; x++) {
      if (pipes[y][x] === '.' || pipes[y][x] === ' ') continue;
      if (!loop.includes(`${x},${y}`)) {
        // Replace unused pipes with empty spaces that could possibly be nests
        if (y % 2 === 0 || x % 2 === 0) {
          pipes[y][x] = ' '
        } else {
          pipes[y][x] = '.'
        }
      }
    }
  }

  const queue = [[0,0]];
  // Filling places connected with 0,0 with X to eliminate these that cannot be nests
  const checkPlace = (x, y) => {
    if (pipes[y][x] !== ' ' && pipes[y][x] !== '.') return;
    pipes[y][x] = 'X'

    if (pipes[y-1] && (pipes[y-1][x] === ' ' || pipes[y-1][x] === '.')) queue.push([x, y-1]);
    if (pipes[y+1] && (pipes[y+1][x] === ' ' || pipes[y+1][x] === '.')) queue.push([x, y+1]);
    if (pipes[y][x-1] === ' ' || pipes[y][x-1] === '.') queue.push([x-1, y]);
    if (pipes[y][x+1] === ' ' || pipes[y][x+1] === '.') queue.push([x+1, y]);
  }

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    checkPlace(x, y);
  }

  console.log(JSON.stringify(pipes).split('').filter(x => x === '.').length);
}

// Day 11
const day11_image = fs.readFileSync('./2023/day11.txt', 'utf-8').split('\n').map(row => row.split(''));

function sumDistancesBetweenGalaxies(image, expansion) {
  const emptyY = [];
  const emptyX = [];
  for (let y = 0; y < image.length; y++) {
    if (image[y].every(x => x === '.')) {
      emptyY.push(y);
    }
  }
  for (let x = 0; x < image[0].length; x++) {
    if (image.map(d => d[x]).every(y => y === '.')) {
      emptyX.push(x);
    }
  }

  const galaxies = [];
  let realY = 0;
  for (let y = 0; y < image.length; y++) {
    if (emptyY.includes(y)) {
      realY += expansion;
      continue;
    }
    let realX = 0;
    for (let x = 0; x < image[0].length; x++) {
      if (emptyX.includes(x)) {
        realX += expansion;
        continue;
      }

      if (image[y][x] === '#') galaxies.push([realX, realY]);

      realX++;
    }
    realY++;
  }

  let sum = 0;
  galaxies.forEach((g1, id1) => {
    galaxies.forEach((g2, id2) => {
      if (id2 < id1) return;
      sum += Math.abs(g1[0]-g2[0]) + Math.abs(g1[1]-g2[1]);
    });
  });

  console.log(sum)
}

// Day 12
const day12_hotSprings = fs.readFileSync('./2023/day12.txt', 'utf-8').split('\n');

function checkMask(spring) {
  const records = spring.split('.').filter(x => x);
  return records.map(r => r.length).join(',');
}

const canFitMask = (currentSpring, mask) => {
  if (!currentSpring.includes('?')) {
    if (checkMask(currentSpring) === mask) {
      return true;
    }
    return false;
  } else {
    const currentMask = checkMask(currentSpring.slice(0, currentSpring.indexOf('?')));
    if (!mask.startsWith(currentMask.slice(0, -1))) return false;
  }

  const canFit = canFitMask(currentSpring.replace('?', '#'), mask);
  if (canFit) return canFit;
  return canFitMask(currentSpring.replace('?', '.'), mask);
}

function countHotSpringsArrangements(hotSprings, part) {
  let sum = 0;

  for (const spring of hotSprings) {
    let thisSum = 0;

    const memo = {};
    const replaceUnknown = (currentSpring, maskLeft, minL) => {
      while (currentSpring.startsWith('.')) currentSpring = currentSpring.slice(1);
      if (currentSpring.length < minL) return 0;
      if (currentSpring.length === 0) {
        if (maskLeft.length === 0) {
          thisSum++;
          return 1;
        }
        return 0;
      }
      if (maskLeft.length === 0) {
        if (!currentSpring.includes('#')) {
          thisSum++;
          return 1;
        }
        return 0;
      }

      const id = `${currentSpring}x${JSON.stringify(maskLeft)}`;
      if (memo[id] !== undefined) {
        thisSum += memo[id];
        return memo[id];
      }

      const org = currentSpring;

      let thisPart = currentSpring.slice(0, Number(maskLeft[0]) + 1);
      currentSpring = currentSpring.slice(Number(maskLeft[0]) + 1);

      let truncateCount = 0;
      while (thisPart.endsWith('#') && currentSpring.length > 0) {
        thisPart += currentSpring[0];
        if (!thisPart.startsWith('#')) {
          truncateCount++;
          thisPart = thisPart.slice(1);
        }
        currentSpring = currentSpring.slice(1);
      }
      if (thisPart.split('').filter(x => x === '#').length > Number(maskLeft[0])) return 0; // No way of forming mask
      
      let c = 0;
      if (canFitMask(thisPart.slice(0, -1), maskLeft[0])) {
        c += replaceUnknown(currentSpring, maskLeft.slice(1), minL - Number(maskLeft[0]) - 1);
      } 
      else if (!org.startsWith('#')) {
        c += replaceUnknown(org.slice(1), maskLeft, minL);
        return memo[id] = c;
      }

      if (!org.slice(0, truncateCount+1).includes('#')) {
        const truncatedSpring = org.slice(truncateCount+1)
        c += replaceUnknown(truncatedSpring, maskLeft, minL);
      }

      return memo[id] = c;
    }

    const [s, m] = spring.split(' ');

    if (part === 1) {
      const mask = m.split(',');
      replaceUnknown(s + '.', mask, mask.map(Number).reduce((a, b) => a + b) + mask.length - 1);
    } else {
      const mask = `${m},${m},${m},${m},${m}`.split(',');
      replaceUnknown(`${s}?${s}?${s}?${s}?${s}.`, mask, mask.map(Number).reduce((a, b) => a + b) + mask.length - 1);
    }

    sum += thisSum;
  }

  console.log(sum);
}

// Day 13
const day13_terrains = fs.readFileSync('./2023/day13.txt', 'utf-8').split('\n\n');

function getReflectionLine(grid, skip = 0) {
  out: for (let x = 0; x < grid.length-1; x++) {
    if (skip === 100 * (x+1)) continue;
    if (grid[x] === grid[x+1]) {
      for (let diff = 1; diff <= x; diff++) {
        if (!grid[x+1+diff]) break;
        if (grid[x-diff] !== grid[x+1+diff]) continue out;
      }
      return 100 * (x+1);
    }
  }

  const gridSplitted = grid.map(row => row.split(''));
  out: for (let x = 0; x < gridSplitted[0].length-1; x++) {
    if (skip === x+1) continue;
    if (gridSplitted.map(i => i[x]).join('') === gridSplitted.map(i => i[x+1]).join('')) {
      for (let diff = 1; diff <= x; diff++) {
        if (!gridSplitted[0][x+1+diff]) break;
        if (gridSplitted.map(i => i[x-diff]).join('') !== gridSplitted.map(i => i[x+1+diff]).join('')) continue out;
      }
      return x+1;
    }
  }
  return 0;
}

function moveBetweenMirrors(terrain) {
  let sum = 0;
  terrain.forEach(image => {
    const grid = image.split('\n');
    sum += getReflectionLine(grid);
  });

  console.log(sum);
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function fixMirrors(terrain) {
  let sum = 0;

  terrain.forEach(image => {
    const grid = image.split('\n');
    const org = getReflectionLine(grid);
    out: for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const orgY = grid[y];
        grid[y] = grid[y].replaceAt(x, grid[y][x] === '.' ? '#' : '.');
        const newL = getReflectionLine(grid, org);
        if (newL > 0 && newL !== org) {
          sum += newL;
          break out;
        } else {
          grid[y] = orgY;
        }
      }
    }
  });

  console.log(sum);
}

// Day 14
const day14_rocks = fs.readFileSync('./2023/day14.txt', 'utf-8').split('\n').map(row => row.split(''));

function slideRocks(rocks) {
  let sum = 0;
  for (let x = 0; x < rocks[0].length; x++) {
    let points = rocks[x].length;
    let cap = 0;
    for (let y = 0; y < rocks.length; y++) {
      if (rocks[y][x] === '.') {
        cap++;
        continue;
      }
      if (rocks[y][x] === '#') {
        points -= cap + 1;
        cap = 0;
        continue;
      }
      sum += points;
      points--;
    }
  }
  console.log(sum);
}

function makeFullCycleOfRocks(ddata) {
  let data = JSON.parse(JSON.stringify(ddata))

  // A lot of repeated code here, but it's 7AM, I don't really want to DRY it xD
  for (let x = 0; x < data[0].length; x++) {
    let points = data[x].length;
    let cap = 0;
    for (let y = 0; y < data.length; y++) {
      if (data[y][x] === '.') {
        cap++;
        continue;
      }
      if (data[y][x] === '#') {
        points -= cap+1;
        cap = 0;
        continue;
      }
      data[y][x] = '.'; 
      data[data[x].length - points][x] = 'O'; 
      points--;
    }
  }
  for (let y = 0; y < data.length; y++) {
    let points = data.length;
    let cap = 0;
    for (let x = 0; x < data[0].length; x++) {
      if (data[y][x] === '.') {
        cap++;
        continue;
      }
      if (data[y][x] === '#') {
        points -= cap+1;
        cap = 0;
        continue;
      }
      data[y][x] = '.'; 
      data[y][data.length - points] = 'O'; 
      points--;
    }
  }
  for (let x = 0; x < data[0].length; x++) {
    let points = data[x].length;
    let cap = 0;
    for (let y = data.length-1; y >= 0; y--) {
      if (data[y][x] === '.') {
        cap++;
        continue;
      }
      if (data[y][x] === '#') {
        points -= cap+1;
        cap = 0;
        continue;
      }
      data[y][x] = '.'; 
      data[points - 1][x] = 'O'; 
      points--;
    }
  }
  for (let y = 0; y < data.length; y++) {
    let points = data.length;
    let cap = 0;
    for (let x = data[0].length - 1; x >= 0; x--) {
      if (data[y][x] === '.') {
        cap++;
        continue;
      }
      if (data[y][x] === '#') {
        points -= cap+1;
        cap = 0;
        continue;
      }
      data[y][x] = '.'; 
      data[y][points-1] = 'O'; 
      points--;
    }
  }
  return data;
}

function spinRocks(rocks) {
  const target = 10 ** 9;
  const history = [];
  for (let cycle = 1;; cycle++) {
    rocks = makeFullCycleOfRocks(rocks);
    let points = 0;
    for (let y = 0; y < rocks.length; y++) {
      for (let x = 0; x < rocks[0].length; x++) {
        if (rocks[y][x] === 'O') points += rocks.length - y;
      }
    }

    const lastAppear = history.lastIndexOf(points);
    if (lastAppear !== -1) {
      // Just 3 matching values are enough for the pattern to show up
      if (history[lastAppear-1] === history[history.length - 1] &&
        history[lastAppear-2] === history[history.length - 2]) {
          const pattern = history.slice(lastAppear);
          console.log(pattern[(target - cycle) % pattern.length]);
          return;
        }
    }
    history.push(points);
  }
}

// Day 15
const day15_sequence = fs.readFileSync('./2023/day15.txt', 'utf-8').split(',');

function sumHASHes(sequence) {
  let sum = 0;
  sequence.forEach(code => {
    let hash = 0;
    code.split('').forEach(l => {
      hash += l.charCodeAt(0);
      hash *= 17;
      hash %= 256;
    });
    sum += hash;
  })
  console.log(sum);
}

function prepareHASHMAP(sequence) {
  const boxes = new Array(256);
  sequence.forEach(code => {
    let hash = 0;
    let sign;
    for (let x = 0; x < code.length; x++) {
      if (code[x] === '-' || code[x] === '=') {
        sign = x;
        break;
      }
      hash += code[x].charCodeAt(0);
      hash *= 17;
      hash %= 256
    }
    if (!boxes[hash]) boxes[hash] = [];
    if (code[sign] === '-') {
      const id = boxes[hash].findIndex(a => a.startsWith(code.slice(0, sign)));
      if (id !== -1) boxes[hash].splice(id, 1);
    } else {
      const id = boxes[hash].findIndex(a => a.startsWith(code.slice(0, sign)));
      if (id !== -1) boxes[hash].splice(id, 1, code);
      else boxes[hash].push(code);
    }
  });

  let sum = 0;
  boxes.forEach((box, boxId) => {
    if (!box || box.length === 0) return;
    box.forEach((lens, lensId) => {
      sum += (boxId+1) * (lensId+1) * Number(lens.split('=')[1]);
    });
  });
  console.log(sum);
}

// Day 16
const day16_contraption = fs.readFileSync('./2023/day16.txt', 'utf-8').split('\n').map(row => row.split(''));

function countEnergizedTiles(contraption, startingConfiguration) {
  const energized = new Set();
  const queue = [startingConfiguration];

  const memo = {};
  const moveLight = (x, y, dir) => {
    if (x < 0 || x >= contraption[0].length || y < 0 || y >= contraption.length) return;
    if (memo[`${x},${y}x${dir}`]) return;
    memo[`${x},${y}x${dir}`] = true;
    energized.add(`${x},${y}`);

    if (contraption[y][x] === '.') {
      if (dir === '>') queue.push([x+1, y, dir]);
      if (dir === '<') queue.push([x-1, y, dir]);
      if (dir === 'v') queue.push([x, y+1, dir]);
      if (dir === '^') queue.push([x, y-1, dir]);
    } else if (contraption[y][x] === '-') {
      if (dir === '>') queue.push([x+1, y, dir]);
      if (dir === '<') queue.push([x-1, y, dir]);
      if (dir === 'v' || dir === '^') {
        queue.push([x-1, y, '<']);
        queue.push([x+1, y, '>']);
      }
    } else if (contraption[y][x] === '|') {
      if (dir === '>' || dir === '<') {
        queue.push([x, y-1, '^']);
        queue.push([x, y+1, 'v']);
      }
      if (dir === 'v') queue.push([x, y+1, dir]);
      if (dir === '^') queue.push([x, y-1, dir]);
    } else if (contraption[y][x] === '/') {
      if (dir === '>') queue.push([x, y-1, '^']);
      if (dir === '<') queue.push([x, y+1, 'v']);
      if (dir === 'v') queue.push([x-1, y, '<']);
      if (dir === '^') queue.push([x+1, y, '>']);
    } else { // '\'
      if (dir === '>') queue.push([x, y+1, 'v']);
      if (dir === '<') queue.push([x, y-1, '^']);
      if (dir === 'v') queue.push([x+1, y, '>']);
      if (dir === '^') queue.push([x-1, y, '<']);
    }
  }

  while (queue.length > 0) {
    moveLight(...queue.shift());
  }
  return energized.size;
}

function findBestSpotForLight(contraption) {
  let max = 0;
  for (let x = 0; x < contraption[0].length; x++) {
    const v1 = countEnergizedTiles(contraption, [x, 0, 'v']);
    const v2 = countEnergizedTiles(contraption, [x, contraption.length-1, '^']);
    max = Math.max(max, v1, v2);
  }
  for (let y = 0; y < contraption.length; y++) {
    const v1 = countEnergizedTiles(contraption, [0, y, '>']);
    const v2 = countEnergizedTiles(contraption, [contraption[0].length-1, y, '<']);
    max = Math.max(max, v1, v2);
  }
  console.log(max);
}

// Day 17
const day17_map = fs.readFileSync('./2023/day17.txt', 'utf-8').split('\n').map(row => row.split('').map(Number));

function navigateCrucibles(map, min, max) {
  const queue = { 0: [{ x: 0, y: 0, dir: max === 10 ? '>' : 'v', consecutive: 0 }] };
  let heat = 0;
  const dest = { x: map[0].length - 1, y: map.length - 1 };

  const clearQueue = () => {
    queue[heat].shift();
    if (queue[heat].length === 0) {
      delete queue[heat];
      heat++;
    }
  }

  const hist = {};
  while (true) {
    while (!queue[heat] || queue[heat].length === 0) {
      heat++;
    }

    const { x, y, dir, consecutive } = queue[heat][0];
    if (x === dest.x && y === dest.y && consecutive >= min) {
      console.log(heat);
      return;
    }
    const data = `${x}x${y}x${dir}x${consecutive}`;
    if (hist[data]) {
      clearQueue();
      continue;
    }
    hist[data] = true;

    if (x < dest.x && dir !== '<' && (consecutive < max || dir !== '>') && (consecutive >= min || dir === '>')) {
      const newId = `${x+1}x${y}x>x${dir === '>' ? consecutive+1 : 1}`
      if (!hist[newId]) {
        const newHeat = heat + map[y][x+1];
        if (!queue[newHeat]) queue[newHeat] = [];
        queue[newHeat].push({ x: x+1, y, dir: '>', consecutive: dir === '>' ? consecutive+1 : 1 });
      }
    }
    if (x > 0 && dir !== '>' && (consecutive < max || dir !== '<') && (consecutive >= min || dir === '<')) {
      const newId = `${x-1}x${y}x<x${dir === '<' ? consecutive+1 : 1}`
      if (!hist[newId]) {
        const newHeat = heat + map[y][x-1];
        if (!queue[newHeat]) queue[newHeat] = [];
        queue[newHeat].push({ x: x-1, y, dir: '<', consecutive: dir === '<' ? consecutive+1 : 1 });
      }
    }
    if (y < dest.y && dir !== '^' && (consecutive < max || dir !== 'v') && (consecutive >= min || dir === 'v')) {
      const newId = `${x}x${y+1}xvx${dir === 'v' ? consecutive+1 : 1}`
      if (!hist[newId]) {
        const newHeat = heat + map[y+1][x];
        if (!queue[newHeat]) queue[newHeat] = [];
        queue[newHeat].push({ x, y: y+1, dir: 'v', consecutive: dir === 'v' ? consecutive+1 : 1 });
      }
    }
    if (y > 0 && dir !== 'v' && (consecutive < max || dir !== '^') && (consecutive >= min || dir === '^')) {
      const newId = `${x}x${y-1}x^x${dir === '^' ? consecutive+1 : 1}`
      if (!hist[newId]) {
        const newHeat = heat + map[y-1][x];
        if (!queue[newHeat]) queue[newHeat] = [];
        queue[newHeat].push({ x, y: y-1, heat: heat + map[y-1][x], dir: '^', consecutive: dir === '^' ? consecutive+1 : 1 });
      }
    }

    clearQueue();
  }
}

// Day 18
const day18_digPlan = fs.readFileSync('./2023/day18.txt', 'utf-8').split('\n');

// I knew about Shoelace theorem, so with this knowledge it was trivial -> https://artofproblemsolving.com/wiki/index.php/Shoelace_Theorem
function digTheLagoon(plan, useHex) {
  let x = 0;
  let y = 0;

  let firstP = 0n;
  let secondP = 0n;
  let boundaryPoints = 0;
  const dirDict = { 0: 'R', 1: 'D', 2: 'L', 3: 'U' };

  plan.forEach(d => {
    let [dir, steps, hex] = d.split(' ');
    if (useHex) {
      steps = parseInt(hex.slice(2, -2), 16);
      dir = dirDict[hex.slice(-2, -1)];
    }
    let newX = x;
    let newY = y;
    if (dir === 'R') newX += Number(steps);
    if (dir === 'L') newX -= Number(steps);
    if (dir === 'U') newY -= Number(steps);
    if (dir === 'D') newY += Number(steps);
    boundaryPoints += Number(steps);

    firstP += BigInt(x * newY);
    secondP += BigInt(y * newX);
    x = newX;
    y = newY;
  });

  const area = (firstP - secondP) / 2n;
  console.log(Number(area) + (boundaryPoints+2) / 2)
}

// Day 19
const day19_partRatings = fs.readFileSync('./2023/day19.txt', 'utf-8').split('\n\n');

function sortParts(partRatings) {
  const sorters = partRatings[0].split('\n');
  const parts = partRatings[1].split('\n');

  const sortersData = {};
  sorters.forEach(s => {
    const [name, params] = s.split('{');
    sortersData[name] = params.slice(0, -1);
  });

  let accepted = 0;
  parts.forEach(part => {
    const nums = part.match(/-?[0-9]+/g).map(Number);
    const partData = { x: nums[0], m: nums[1], a: nums[2], s: nums[3] };
    const { x, m, a, s } = partData;

    let sorter = 'in';
    main: while (true) {
      const op = sortersData[sorter].split(',');
      for (const condition of op) {
        if (condition.includes(':')) {
          const [check, newSorter] = condition.split(':')
          if (eval(check)) {
            if (newSorter === 'A') {
              accepted += x + m + a + s;
              break main;
            } else if (newSorter === 'R') {
              break main;
            }
            sorter = newSorter;
            break;
          }
        } else {
          if (condition === 'A') {
            accepted += x + m + a + s;
            break main;
          } else if (condition === 'R') {
            break main;
          } else {
            sorter = condition;
          }
        }
      }
    }
  });

  console.log(accepted);
}

function countRatingsCombinations(partRatings) {
  const startingRules = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
  const sorters = partRatings[0].split('\n');
  const sortersData = {};
  sorters.forEach(s => {
    const [name, params] = s.split('{');
    sortersData[name] = params.slice(0, -1);
  });

  let accepted = 0;
  const sumRules = (rules) => {
    let mul = 1;
    Object.values(rules).forEach(([min, max]) => {
      mul *= max - min + 1;
    });
    accepted += mul;
  }

  const addRule = (sorterName, rulesSoFar) => {
    const sorter = sortersData[sorterName];
    const ops = sorter.split(',');
    let thisRules = { ...rulesSoFar };
    for (const condition of ops) {
      if (condition.includes(':')) {
        const letter = condition[0];
        const sign = condition[1];
        const num = condition.match(/-?[0-9]+/g).map(Number)[0];
        const newRule = { [letter]: sign === '<' ? [thisRules[letter][0], Math.min(thisRules[letter][1], num-1)] : [Math.max(thisRules[letter][0], num+1), thisRules[letter][1]] };
        const result = condition.split(':')[1];
        if (result === 'A') {
          sumRules({ ...thisRules, ...newRule });
        } else if (result === 'R') {
          // Rejected, do nothing
        } else {
          addRule(result, { ...thisRules, ...newRule });
        }
        const reversedRule = { [letter]: sign === '<' ? [Math.max(thisRules[letter][0], num), thisRules[letter][1]] : [thisRules[letter][0], Math.min(thisRules[letter][1], num)] };
        thisRules = { ...thisRules, ...reversedRule };
      } else if (condition === 'A') {
        sumRules(thisRules);
      } else if (condition === 'R') {
        // Rejected, do nothing
      } else {
        addRule(condition, thisRules);
      }
    }
  }
  addRule('in', startingRules);

  console.log(accepted);
}

// Day 20
const day20_configuration = fs.readFileSync('./2023/day20.txt', 'utf-8').split('\n');

function countPulsesInModules(configuration) {
  const modules = {};
  configuration.forEach(conf => {
    const [name, outputs] = conf.split(' -> ');
    if (name === 'broadcaster') modules.broadcaster = {
      type: 'broadcaster',
      outputs: outputs.split(', '),
    }
    else if (name.startsWith('%')) modules[name.slice(1)] = {
      type: 'flip-flop',
      outputs: outputs.split(', '),
      isOn: false,
    }
    else modules[name.slice(1)] = {
      type: 'conjunction',
      outputs: outputs.split(', '),
      memory: {}
    }
  });

  Object.entries(modules).forEach(([name, module]) => {
    module.outputs.forEach(out => {
      if (modules[out] && modules[out].type === 'conjunction') {
        modules[out].memory[name] = false;
      }
    })
  });

  const finalConjunction = Object.values(modules).find(m => m.outputs.includes('rx'));
  const subFinals = Object.keys(finalConjunction.memory);
  // Made a risky assumption that all conjunctions linked with the final one will have their own cycles and that I could use lcm just as in day 8
  const subFinalsCycles = [];

  let lows = 0;
  let highs = 0;
  let push = 0;
  while (subFinals.length !== subFinalsCycles.length) {
    push++;
    const queue = [{ pulse: 'low', target: 'broadcaster', source: 'button' }];
    while (queue.length > 0) {
      const { pulse, target, source } = queue.shift();
      if (pulse === 'low') lows++;
      else highs++;
      if (!modules[target]) continue;

      if (modules[target].type === 'broadcaster') {
        modules[target].outputs.forEach(out => {
          queue.push({ pulse, target: out, source: target });
        });
      } else if (modules[target].type === 'flip-flop') {
        if (pulse === 'high') continue;
        if (modules[target].isOn) {
          modules[target].outputs.forEach(out => {
          queue.push({ pulse: 'low', target: out, source: target });
          });
        } else {
          modules[target].outputs.forEach(out => {
            queue.push({ pulse: 'high', target: out, source: target });
          });
        }
        modules[target].isOn = !modules[target].isOn;
      } else { // conjunction
        modules[target].memory[source] = pulse === 'low' ? false : true;
        modules[target].outputs.forEach(out => {
          queue.push({ pulse: Object.values(modules[target].memory).every(x => x) ? 'low' : 'high', target: out, source: target });
        });
      }

      if (subFinals.includes(target) && Object.values(modules[target].memory).every(x => !x)) subFinalsCycles.push(push);
    }

    if (push === 1000) console.log(lows * highs); // Part 1
  }

  console.log(lcm(...subFinalsCycles));
}

// Day 21
const day21_garden = fs.readFileSync('./2023/day21.txt', 'utf-8').split('\n');

function countPlacesAfter64Steps(gardenRaw) {
  const garden = gardenRaw.map(row => row.split(''));
  const places = new Set();
  let startX, startY;
  out: for (let y = 0; y < garden.length; y++) {
    for (let x = 0; x < garden[0].length; x++) {
      if (garden[y][x] === 'S') {
        startX = x;
        startY = y;
        break out;
      }
    }
  }

  const memo = {};
  const takeStep = (x,y, step) => {
    if (memo[`${x}x${y}x${step}`]) return;
    memo[`${x}x${y}x${step}`] = true;

    if (step === 64) {
      places.add(`${x}x${y}`);
      return;
    }

    if (garden[y-1][x] !== '#') takeStep(x, y-1, step+1);
    if (garden[y+1][x] !== '#') takeStep(x, y+1, step+1);
    if (garden[y][x-1] !== '#') takeStep(x-1, y, step+1);
    if (garden[y][x+1] !== '#') takeStep(x+1, y, step+1);
  }
  takeStep(startX, startY, 0);

  console.log(places.size);
}

// For this part, I realized that a pattern should show up after some time and I was right. It appears after moving 2 copies of gardens away.
function countPlacesAfter26501365Steps(gardenRaw) {
  const gardenSize = gardenRaw.length;
  // Creating 2 copies of garden in each direction
  for (let y = 0; y < gardenRaw.length; y++) {
    gardenRaw[y] = gardenRaw[y].repeat(5).split('');
  }
  const garden = [];
  for (let copy = 1; copy <= 5; copy++) {
    garden.push(...gardenRaw);
  }

  let startX, startY;
  let startsFound = 0;
  out: for (let y = 0; y < garden.length; y++) {
    for (let x = 0; x < garden[0].length; x++) {
      if (garden[y][x] === 'S') {
        startsFound++;
        if (startsFound === 13) { // Found the middle point
          startX = x;
          startY = y;
          break out;
        }
      }
    }
  }

  const target = 26501365;
  const targetMod = target % gardenSize;

  const places = [];
  // JS can't handle big objects properly, so I had to split memo into smaller pieces. It's ugly but works well.
  const memos = [{},{},{},{},{},{},{},{},{},{}];

  const takeStep = (x,y, step) => {
    if (memos[Math.floor(y/100)][`${x}x${y}x${step}`]) return;
    memos[Math.floor(y/100)][`${x}x${y}x${step}`] = true;

    if (step % gardenSize === targetMod) {
      if (!places[step]) places[step] = new Set();
      places[step].add(`${x}x${y}`);
    }
    if (step === 2 * gardenSize + targetMod) return; // That's enough to get the pattern

    if (garden[y-1][x] !== '#') takeStep(x, y-1, step+1);
    if (garden[y+1][x] !== '#') takeStep(x, y+1, step+1);
    if (garden[y][x-1] !== '#') takeStep(x-1, y, step+1);
    if (garden[y][x+1] !== '#') takeStep(x+1, y, step+1);
  }
  takeStep(startX, startY, 0);

  let lastStep = 0;
  let lastPlaces = 0;
  let lastDiff = 0;
  let pattern = 0;
  // Figuring out the pattern
  for (let step = targetMod; step < places.length; step += gardenSize) {
    const x = places[step].size;
    lastStep = step;
    pattern = x - lastPlaces - lastDiff;
    lastDiff = x - lastPlaces;
    lastPlaces = x;
  }

  let finalPlaces = lastPlaces;
  let additions = lastDiff;
  // Using pattern to quickly get the answer
  for (let step = lastStep + gardenSize; step <= target; step += gardenSize) {
    additions += pattern;
    finalPlaces += additions;
  }
  console.log(finalPlaces);
}

// Day 22
const day22_bricks = fs.readFileSync('./2023/day22.txt', 'utf-8').split('\n').map(row => row.split('~'));

function disintegrateBricks(bricksRaw) {
   const bricks = [];
   const space = [];
   let maxX = 0, maxY = 0, maxZ = 0;
   bricksRaw.forEach(([brickStart, brickEnd], id) => {
    const [xStart, yStart, zStart] = brickStart.split(',').map(Number);
    const [xEnd, yEnd, zEnd] = brickEnd.split(',').map(Number);
    maxX = Math.max(maxX, xEnd);
    maxY = Math.max(maxY, yEnd);
    maxZ = Math.max(maxZ, zEnd);

    bricks.push({ xStart, yStart, zStart, xEnd, yEnd, zEnd, id: id+1, supports: [] });
    for (let z = zStart; z <= zEnd; z++) {
      if (!space[z]) space[z] = [];
      for (let y = yStart; y <= yEnd; y++) {
        if (!space[z][y]) space[z][y] = [];
        for (let x = xStart; x <= xEnd; x++) {
          space[z][y][x] = id+1;
        }
      }
    }
  });
  
  for (let z = 1; z <= maxZ; z++) {
    if (!space[z]) space[z] = [];
    for (let y = 0; y <= maxY; y++) {
      if (!space[z][y]) space[z][y] = [];
      for (let x = 0; x <= maxX; x++) {
        if (!space[z][y][x]) space[z][y][x] = '.';
      }
    }
  }

  bricks.sort((a, b) => a.zStart - b.zStart);
  bricks.forEach((brick) => {
    support = [];

    if (brick.xStart !== brick.xEnd) {
      const y = brick.yStart;
      for (let z = brick.zStart-1; z >= 1; z--) {
        if (support.length > 0) break;
        for (let x = brick.xStart; x <= brick.xEnd; x++) {
          if (space[z][y][x] !== '.') {
            support.push(space[z][y][x]);
          }
        }
        if (support.length === 0) {
          for (let x = brick.xStart; x <= brick.xEnd; x++) {
            space[z][y][x] = brick.id;
            space[z+1][y][x] = '.';
          }
          brick.zStart--;
          brick.zEnd--;
        }
      }
    } else if (brick.yStart !== brick.yEnd) {
      const x = brick.xStart;
      for (let z = brick.zStart-1; z >= 1; z--) {
        if (support.length > 0) break;
        for (let y = brick.yStart; y <= brick.yEnd; y++) {
          if (space[z][y][x] !== '.') {
            support.push(space[z][y][x]);
          }
        }
        if (support.length === 0) {
          for (let y = brick.yStart; y <= brick.yEnd; y++) {
            space[z][y][x] = brick.id;
            space[z+1][y][x] = '.';
          }
          brick.zStart--;
          brick.zEnd--;
        }
      }
    } else { // z is changing
      const x = brick.xStart;
      const y = brick.yStart;
      for (let z = brick.zStart-1; z >= 1; z--) {
        if (support.length > 0) break;
        if (space[z][y][x] !== '.') {
          support.push(space[z][y][x]);
        }
        if (support.length === 0) {
          space[z][y][x] = brick.id;
          space[brick.zEnd][y][x] = '.';
          brick.zStart--;
          brick.zEnd--;
        }
      }
    }

    support.forEach(s => {
      const bb = bricks.find(b => b.id === s);
      bb.supports.push(brick.id);
    });
    brick.hasSupportOf = support;
  });

  let countSafe = 0;
  bricks.forEach(b => {
    if (b.supports.length === 0) countSafe++;
    else {
      for (const sup of b.supports) {
        const other = bricks.find(br => br.id !== b.id && br.supports.includes(sup));
        if (!other) return;
      }
      countSafe++;
    }
  });

  console.log(countSafe); // Part 1

  let countFalling = 0;
  bricks.forEach(brick => {
    const falling = new Set();
    const fallingQueue = [brick.id];
    while (fallingQueue.length > 0) {
      const fId = fallingQueue.shift();
      const fBrick = bricks.find(b => b.id === fId);
      if (fId === brick.id || fBrick.hasSupportOf.every(sup => falling.has(sup))) {
        falling.add(fId);
        fBrick.supports.forEach(sup => {
          if (!fallingQueue.includes(sup)) fallingQueue.push(sup);
        })
      }
    }
    countFalling += falling.size - 1;
  })

  console.log(countFalling);
}

// Day 23
const day23_txt = fs.readFileSync('./2023/day23.txt', 'utf-8').split('\n').map(row => row.split(''));

function findLongestPathOnSlopes(map) {
  const queue = { 0: [{ x: 1, y: 0, visited: { '1x0': true } }] };

  let step = 0;
  const clearQueue = () => {
    queue[step].shift();
    if (queue[step].length === 0) {
      delete queue[step];
      step++;
    }
  }

  let max = 0;

  while (queue[step] && queue[step][0]) {
    const { x, y, visited } = queue[step][0];

    if (y === map.length-1 && x === map[0].length -2) {
      max = step;
      clearQueue();
      continue;
    }

    if (!queue[step+1]) queue[step+1] = [];

    if (map[y][x] === '.' || map[y][x] === 'v') {
      if (map[y+1] && (map[y+1][x] === '.' || map[y+1][x] === 'v')) {
        if (!visited[`${x}x${y+1}`]) {
          queue[step+1].push({ y: y+1, x, visited: {...visited, [`${x}x${y+1}`]: true} });
        }
      }
    }
    if (map[y][x] === '.' || map[y][x] === '^') {
      if (map[y-1] && (map[y-1][x] === '.' || map[y-1][x] === '^')) {
        if (!visited[`${x}x${y-1}`]) {
          queue[step+1].push({ y: y-1, x, visited: {...visited, [`${x}x${y-1}`]: true} });
        }
      }
    }
    if (map[y][x] === '.' || map[y][x] === '>') {
      if (map[y][x+1] === '.' || map[y][x+1] === '>') {
        if (!visited[`${x+1}x${y}`]) {
          queue[step+1].push({ y, x: x+1, visited: {...visited, [`${x+1}x${y}`]: true} });
        }
      }
    }
    if (map[y][x] === '.' || map[y][x] === '<') {
      if (map[y][x-1] === '.' || map[y][x-1] === '<') {
        if (!visited[`${x-1}x${y}`]) {
          queue[step+1].push({ y, x: x-1, visited: {...visited, [`${x-1}x${y}`]: true} });
        }
      }
    }

    clearQueue();
  }

  console.log(max);
}

function findTunnel(startX, startY, map) {
  const queue = { 0: [{ x: startX, y: startY, visited: { [`${startX}x${startY}`]: true }, lastX: undefined, lastY: undefined }] };

  let step = 0;
  const clearQueue = () => {
    queue[step].shift();
    if (queue[step].length === 0) {
      delete queue[step];
      step++;
    }
  }

  const endings = [];

  while (queue[step] && queue[step][0]) {
    const { x, y, visited, lastX, lastY } = queue[step][0];

    if (step > 0 && map[y][x] !== '.') {
      endings.push({ x, y, steps: step, visited: [`${lastX}x${lastY}`] });
      clearQueue();
      continue;
    }

    if (!queue[step+1]) queue[step+1] = [];

    if (map[y][x] === '.' || (step === 0 && map[y][x] === 'v')) {
      if (map[y+1] && map[y+1][x] !== '#') {
        if (!visited[`${x}x${y+1}`]) {
          queue[step+1].push({ y: y+1, x, visited: {...visited, [`${x}x${y+1}`]: true}, lastX: x, lastY: y });
        }
      }
    }
    if (map[y][x] === '.' || (step === 0 && map[y][x] === '^')) {
      if (map[y-1] && map[y-1][x] !== '#') {
        if (!visited[`${x}x${y-1}`]) {
          queue[step+1].push({ y: y-1, x, visited: {...visited, [`${x}x${y-1}`]: true}, lastX: x, lastY: y });
        }
      }
    }
    if (map[y][x] === '.' || (step === 0 && map[y][x] === '>')) {
      if (map[y][x+1] !== '#') {
        if (!visited[`${x+1}x${y}`]) {
          queue[step+1].push({ y, x: x+1, visited: {...visited, [`${x+1}x${y}`]: true}, lastX: x, lastY: y });
        }
      }
    }
    if (map[y][x] === '.' || (step === 0 && map[y][x] === '<')) {
      if (map[y][x-1] !== '#') {
        if (!visited[`${x-1}x${y}`]) {
          queue[step+1].push({ y, x: x-1, visited: {...visited, [`${x-1}x${y}`]: true}, lastX: x, lastY: y });
        }
      }
    }

    clearQueue();
  }

  return endings;
}

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.findIndex(item2 => item2.x === item.x && item2.y === item.y) === index);
}

function findLongestPathOverall(map) {
  map[0][1] = 'v';
  map[map.length-1][map[0].length-2] = 'v';

  const tunnels = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] !== '.' && map[y][x] !== '#') {
        const newT = findTunnel(x, y, map);
        if (!tunnels[`${x}x${y}`]) tunnels[`${x}x${y}`] = [];
        tunnels[`${x}x${y}`] = [ ...tunnels[`${x}x${y}`], ...newT ];
        newT.forEach((t, id) => {
          const altered = JSON.parse(JSON.stringify(newT));
          const endX = altered[id].x;
          const endY = altered[id].y;
          altered[id].x = x;
          altered[id].y = y;
          if (!tunnels[`${endX}x${endY}`]) tunnels[`${endX}x${endY}`] = [];
          tunnels[`${endX}x${endY}`] = [...tunnels[`${endX}x${endY}`], ...altered];
        });
      }
    }
  }
  Object.keys(tunnels).forEach(tun => {
    tunnels[tun] = removeDuplicates(tunnels[tun]);
  })

  const queue = { 0: [{ x: 1, y: 0, visited: { '1x0': true }, hist: ['1,0'] }] };
  let step = 0;
  let eee = {};

  const clearQueue = () => {
    queue[step].shift();
    if (queue[step].length === 0) {
      delete queue[step];
      step = Math.min(...Object.keys(queue).map(Number));
      eee = {};
    }
  }

  let max = 0;

  while (queue[step] && queue[step][0]) {
    const { x, y, visited, hist } = queue[step][0];
    const id = `${x}x${y}x${step}x${hist.slice(-15)}`;
    if (eee[id]) {
      clearQueue();
      continue;
    }
    eee[id] = true;

    if (y === map.length-1 && x === map[0].length-2) {
      if (step > max) {
        max = step;
      }
      clearQueue();
      continue;
    }

    let possibleWays = tunnels[`${x}x${y}`];
    if ((x === 136 && y === 131) || (x === 137 && y === 130)) {
      // This is specific to my input. At those coordinates, only this path reaches the end.
      possibleWays = possibleWays.filter(way => way.x === 137 && way.y === 132);
    }

    possibleWays.forEach(way => {
      if (way.visited.every(v => v === `${x}x${y}` || !visited[v])) {
        if (!queue[step+way.steps]) queue[step+way.steps] = [];
        const newVisited = { ...visited };
        way.visited.forEach(v => {
          newVisited[v] = true;
        });
        queue[step+way.steps].push({ y: way.y, x: way.x, visited: newVisited, hist: [...hist, `${way.x}x${way.y}`] });
      }
    });
  
    clearQueue();
  }

  console.log(max);
}

// Day 24
const day24_hailstones = fs.readFileSync('./2023/day24.txt', 'utf-8').split('\n');
const Fraction = require("./fraction");

function formHailstones(data) {
  const hailstones = [];
  data.forEach(h => {
    const [px, py, pz, vx, vy, vz] = h.match(/-?[0-9]+/g).map(Number);
    hailstones.push({ px, py, pz, vx, vy, vz });
  });
  return hailstones;
}

function findIntersections(hailstones, min, max, retVals) {
  // This function and the Fraction class are just copied from my Project Euler library that I made while solving problem #165 there.
  const lines = [];
  hailstones.forEach(h => {
    const line = [h.px, h.py];
    let t = 0;
    if (h.px > min && h.vx < 0) {
      t = Math.max(t, (min - h.px) / h.vx + 1);
    } else if (h.px < max && h.vx > 0) {
      t = Math.max(t, (max - h.px) / h.vx + 1);
    } else {
      return // point will never fall into this area
    }
    if (h.py > min && h.vy < 0) {
      t = Math.max(t, (min - h.py) / h.vy + 1);
    } else if (h.py < max && h.vy > 0) {
      t = Math.max(t, (max - h.py) / h.vy + 1);
    } else {
      return // point will never fall into this area
    }
    t = Math.ceil(t);
    line.push(h.px + t*h.vx);
    line.push(h.py + t*h.vy);

    const a = new Fraction(line[1] - line[3], line[0] - line[2]);
    a.reduce();
    
    const b = a.copy;
    b.mul(line[0] * -1);
    b.plus(line[1]);
    line.push(a, b);

    lines.push(line);
  });

  let count = 0;
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j]
    for (let i = j + 1; i < lines.length; i++) {
      const line2 = lines[i];
      if (line[4].denominator !== 0n && line[4].decimalValue === line2[4].decimalValue) continue; // parallel lines

      let xDec, yDec;

      if (line[4].denominator === 0n) {
        if (line2[4].denominator === 0n) continue;

        xDec = line[0];
        y = line2[4].copy;
        y.mul(xDec);
        y.plusFraction(line2[5].copy); 
        yDec = y.decimalValue;
      } else if (line2[4].denominator === 0n) {
        xDec = line2[0];
        y = line[4].copy;
        y.mul(xDec);
        y.plusFraction(line[5].copy); 
        yDec = y.decimalValue;
      } else {
        const x = line2[5].copy;
        x.minusFraction(line[5].copy);
        const xDenom = line[4].copy;
        xDenom.minusFraction(line2[4].copy);
        x.divFraction(xDenom);
        
        const y = x.copy;
        y.mulFraction(line[4].copy);
        y.plusFraction(line[5].copy);
        xDec = x.decimalValue;
        yDec = y.decimalValue;
      }
      if (retVals) return `${xDec},${yDec}`;
      
      if (xDec < 0 || yDec < 0) continue;

      if (line[0] !== line[2]) {
        const line1X = [line[0], line[2]].sort((a, b) => a - b);
        if (line1X[0] >= xDec || line1X[1] <= xDec) continue;
      } else if (line[1] !== line[3]) {
        const line1Y = [line[1], line[3]].sort((a, b) => a - b);
        if (line1Y[0] >= yDec || line1Y[1] <= yDec) continue;
      }

      if (line2[0] !== line2[2]) {
        const line2X = [line2[0], line2[2]].sort((a, b) => a - b);
        if (line2X[0] >= xDec || line2X[1] <= xDec) continue;
      } else if (line2[1] !== line2[3]) {
        const line2Y = [line2[1], line2[3]].sort((a, b) => a - b);
        if (line2Y[0] >= yDec || line2Y[1] <= yDec) continue;
      }

      if (xDec > min && xDec < max && yDec > min && yDec < max) {
        count++;
      }
    }
  };
  if (retVals) return null;
  console.log(count);
}

function countIntersections(data) {
  const hailstones = formHailstones(data);
  findIntersections(hailstones, 200000000000000, 400000000000000);
}

/* 
  Part 2 was veery hard and required a lot of calculations beforehand.
  I realized that I don't really have to check every hailstone from the input. Instead, if I find a line that crosses 3 hailstones, I can be sure that all other will also be crossed.
  
  Values that I need to find are marked as a, b, c and their velocities are: va, vb, vc
  The best trick here that saves a lot of time is to use solution from part1 to brute-force values of va and vb by finding intersections on X and Y axis and then calculate values for axis Z.
  Afterwards, I can solve the system of those 6 equations:
  ```
    stone1.px + stone1.vx * t0 == a + va * t0
    stone1.py + stone1.vy * t0 == b + vb * t0
    stone1.pz + stone1.vz * t0 == c + vc * t0

    stone2.px + stone2.vx * t1 == a + va * t1
    stone2.py + stone2.vy * t1 == b + vb * t1
    stone2.pz + stone2.vz * t1 == c + vc * t1
  ```
  t0 and t1 are collision times with corresponding stones. Now, using values from the example given in task:
  From brute-force we get:
  va = -3 vc = 1, with intersections at a = 24 and b = 13

  First stone, first equation:
  24 - 3t0 = 19 - 2t0 => t0 = 5;
  Knowing t0, third equation becomes:
  30 - 2*5 = c + 5vc => c + 5vc = 20;

  Second stone, fourth equation:
  24 - 3t1 = 18 - t1 => t1 = 3;
  Knowing t1, sixth equation becomes:
  22 - 2*3 = c + 3vc => c + 3vc = 16;

  Combining third and sixth:
  c + 5vc = 20
  c + 3vc = 16

  2vc = 4;
  vc = 2; Thus:
  c = 10;
*/

function hitHailstones(data) {
  const hailstones = formHailstones(data);

  for (let va = -500; va < 500; va++) { // Velocities in input oscilate at those values, so I assumed that I'll be the same with the rock
    for (let vb = -500; vb < 500; vb++) {
      const alteredH = [{ ...hailstones[0] }, { ...hailstones[1] }, { ...hailstones[2] }];
      // We can simulate that our rock has 0 velocity, and instead, the rocks are moving with added va & vb to check at which point they fall into a rock
      for (let i = 0; i < 3; i++) {
        alteredH[i].vx -= va;
        alteredH[i].vy -= vb;
      }
      
      const answers = [
        findIntersections([alteredH[0], alteredH[1]], 0, 700000000000000, true), 
        findIntersections([alteredH[0], alteredH[2]], 0, 700000000000000, true), 
        findIntersections([alteredH[1], alteredH[2]], 0, 700000000000000, true)
      ];
      
      // If all 3 hailstones collide at the same (x,y) point, then this is the position from where the rock needs to be thrown.
      if (new Set(answers).size === 1 && answers[0] !== null && answers[0].split(',').every(x => Number.isInteger(Number(x)))) {
        const a = Number(answers[0].split(',')[0]);
        const b = Number(answers[0].split(',')[1]);

        const t0 = (hailstones[0].px - a) / (va - hailstones[0].vx);
        const t1 = (hailstones[1].px - a) / (va - hailstones[1].vx);
        if (Number.isInteger(t0) && Number.isInteger(t1)) {

          const colisionZ0 = hailstones[0].pz + hailstones[0].vz * t0;
          const colisionZ1 = hailstones[1].pz + hailstones[1].vz * t1;
          const vc = (colisionZ0 - colisionZ1) / (t0 - t1);
          const c = colisionZ0 - t0 * vc;

          console.log(a+b+c);
          return;
        }
      }
    }
  }
}

// Day 25
const day25_diagram = fs.readFileSync('./2023/day25.txt', 'utf-8').split('\n');

/* 
  Not happy about this solution. I had no idea how to find correct wires with code, so I wrote `generateDotFile` function, which prepares a file that with the help of graphviz, can generate an SVG with graph.
  The SVG is not very readable, but we can clearly see there, that there are indeed 3 wires that connect 2 groups. By inspecting the HTML code, I manually found the 3 wires that need to be removed:
  gqr <-> vbk, klj <-> scr, sdv <-> mxv
  With this information being hardcoded, `disconnectWires` easily handles grouping.
*/
function generateDotFile() {
  // Using https://graphviz.org/doc/info/command.html
  const data = day25_diagram;

  let dot = "digraph G {\n";
  data.forEach(node => {
    const [from, to] = node.split(': ');
    dot += `  ${from}`;
    dot += ` -> ${to.replaceAll(' ', ',')}`;
    dot += "\n";
  });
  dot += "}";
  
  fs.writeFileSync('./2023/day25_graph.dot', dot);
  console.log('File generated!');

  // After generating .dot file, run this in terminal:
  // dot -Tsvg ./2023/day25_graph.dot -o ./2023/day25_graph.svg
}

function disconnectWires() {
  const data = day25_diagram;
  const routes = new Graph();
  const toCut = {
    gqr: 'vbk',
    klj: 'scr',
    sdv: 'mxv',
  };
  
  const comps = {};
  data.forEach(d => {
    const cut = toCut[d.slice(0, 3)];
    if (cut) d = d.replace(` ${cut}`, '');
    d.match(/[a-z]+/g).forEach((x, id) => {
      if (!comps[x]) comps[x] = [];
      if (id === 0) {
        comps[x].push(...d.match(/[a-z]+/g).slice(1));
      } else {
        comps[x].push(d.match(/[a-z]+/g)[0])
      }
    });
  });
  
  Object.entries(comps).forEach(([from, to]) => {
    const toMap = new Map();
    to.forEach(t => toMap.set(t, 1));
    routes.addNode(from, toMap);
  });

  const group1 = ['crt'];
  const group2 = ['qmz']; // Those "roots" were also taken from the SVG file

  Object.keys(comps).forEach(c => {
    if (c === 'crt' || c === 'qmz') return;
    if (routes.path('qmz', c)) {
      group2.push(c);
    } else {
      group1.push(c);
    }
  });

  console.log(group1.length * group2.length);
}


// -----Answers for solved days-----
// Uncomment proper lines to get them
// Total runtime: 407.7 sec

// console.log('Day 1, part 1:');
// getCalibrationValues(day1_calibration);
// console.log('Day 1, part 2:');
// getRealCalibrationValues(day1_calibration);

// console.log('Day 2, part 1 & 2:');
// checkCubeGames(day2_games);

// console.log('Day 3, part 1 & 2:');
// fixTheEngine(day3_engine);

// console.log('Day 4, part 1:');
// scratchSomeCards(day4_scratchcards);
// console.log('Day 4, part 2:');
// countWonCards(day4_scratchcards);

// console.log('Day 5, part 1:');
// placeSeeds([...day5_almanac]);
// console.log('Day 5, part 2:');
// placeRangesOfSeeds([...day5_almanac]);

// console.log('Day 6, part 1:');
// accelerateBoat(day6_races);
// console.log('Day 6, part 2:');
// accelerateBoat(day6_races, true);

// console.log('Day 7, part 1:');
// rankPokerHands(day7_cards);
// console.log('Day 7, part 2:');
// rankPokerHands(day7_cards, true);

// console.log('Day 8, part 1:');
// console.log(navigateThroughSandstorm(day8_network, 'AAA'));
// console.log('Day 8, part 2:');
// moveLikeGhost(day8_network);

// console.log('Day 9, part 1 & 2:');
// extrapolateOasisHistory(day9_report);

// console.log('Day 10, part 1:');
// findFurthestPipe(JSON.parse(JSON.stringify(day10_pipes)));
// console.log('Day 10, part 2:');
// squeezeBetweenPipes(day10_pipes);

// console.log('Day 11, part 1:');
// sumDistancesBetweenGalaxies(day11_image, 2);
// console.log('Day 11, part 2:');
// sumDistancesBetweenGalaxies(day11_image, 1000000);

// console.log('Day 12, part 1:');
// countHotSpringsArrangements(day12_hotSprings, 1);
// console.log('Day 12, part 2:');
// countHotSpringsArrangements(day12_hotSprings, 2);

// console.log('Day 13, part 1:');
// moveBetweenMirrors(day13_terrains);
// console.log('Day 13, part 2:');
// fixMirrors(day13_terrains);

// console.log('Day 14, part 1:');
// slideRocks(day14_rocks);
// console.log('Day 14, part 2:');
// spinRocks(day14_rocks);

// console.log('Day 15, part 1:');
// sumHASHes(day15_sequence);
// console.log('Day 15, part 2:');
// prepareHASHMAP(day15_sequence);

// console.log('Day 16, part 1:');
// console.log(countEnergizedTiles(day16_contraption, [0, 0, '>']));
// console.log('Day 16, part 2:');
// findBestSpotForLight(day16_contraption);

// console.log('Day 17, part 1:');
// navigateCrucibles(day17_map, 1, 3);
// console.log('Day 17, part 2:');
// navigateCrucibles(day17_map, 4, 10);

// console.log('Day 18, part 1:');
// digTheLagoon(day18_digPlan);
// console.log('Day 18, part 2:');
// digTheLagoon(day18_digPlan, true);

// console.log('Day 19, part 1:');
// sortParts(day19_partRatings);
// console.log('Day 19, part 2:');
// countRatingsCombinations(day19_partRatings);

// console.log('Day 20, part 1 & 2:');
// countPulsesInModules(day20_configuration);

// console.log('Day 21, part 1:');
// countPlacesAfter64Steps(day21_garden);
// console.log('Day 21, part 2:');
// countPlacesAfter26501365Steps(day21_garden);

// console.log('Day 22, part 1 & 2:');
// disintegrateBricks(day22_bricks);

// console.log('Day 23, part 1 (this will take a few seconds):');
// findLongestPathOnSlopes(day23_txt);
// console.log('Day 23, part 2 (this will take about 5-6 minutes): ');
// findLongestPathOverall(day23_txt);

// console.log('Day 24, part 1:');
// countIntersections(day24_hailstones);
// console.log('Day 24, part 2:');
// hitHailstones(day24_hailstones);

// console.log('Day 25:');
// disconnectWires(day25_diagram);

// Use this to generate graph (it's already present in the 2023 folder, so no need to do this)
// generateDotFile(); 
