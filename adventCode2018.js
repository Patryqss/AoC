const fs = require("fs");

//Day 1
const day1_operations = fs.readFileSync('./2018/day1.txt', 'utf-8');

function getFrequency(operations) {
  const toEval = '0' + operations;
  console.log(eval(toEval));
}

function findDuplicateInFreq(operations) {
  const freq = [0];
  let foundDuplicate = false;
  let dupAt;
  let round = 0;

  while (!foundDuplicate) {
    operations.forEach(o => {
      freq.push(eval(`${freq[freq.length-1]}${o}`));
    })

    if (round % 100 === 0) { //check only every 100 rounds so the function will give results much quicker
      foundDuplicate = freq.some((f, index) => {
        if (freq.indexOf(f) !== index && !dupAt) dupAt = index;
        return freq.indexOf(f) !== index
      });
    }
    round++
  }
  console.log(freq[dupAt])
}

//Day 2
const day2_ids = fs.readFileSync('./2018/day2.txt', 'utf-8').split('\n');

function getChecksumFromIds(ids) {
  let twos = 0;
  let threes = 0;
  ids.forEach(id => {
    const letters = {};
    id.split('').forEach(letter => {
      if (!letters[letter]) letters[letter] = 1;
      else letters[letter]++;
    });
    if (Object.values(letters).includes(2)) twos++;
    if (Object.values(letters).includes(3)) threes++;
  });
  console.log(twos * threes);
}

function findSimilarIds(ids) {
  const similar = [];
  for (let id of ids) {
    let theSame = 0;
    ids.forEach(idToCompare => {
      if (theSame !== id.length-1) {
        theSame = 0;
        for (let x = 0; x < id.length; x++) {
          if (id[x] === idToCompare[x]) theSame++
        }
        if (theSame === id.length-1) similar.push(idToCompare)
      }
    })
    if (similar.length > 0) {
      similar.push(id);
      break;
    }
  }

  let code = '';
  for (let x = 0; x < similar[0].length; x++) {
    if (similar[0][x] === similar[1][x]) code += similar[0][x];
  }
  console.log(code);
}

//Day 3
const day3_claims = fs.readFileSync('./2018/day3.txt', 'utf-8').split('\n');

function countOverlapingClaims(claims) {
  const NUMS_REGEX = /[0-9]+/g;
  const fabricSize = 1000;
  const fabric = Array(fabricSize).fill('.').map(() => Array(fabricSize).fill('.'));
  for (let i = 0; i < fabricSize; i++) {
    for (let j = 0; j < fabricSize; j++) {
      fabric[i][j] = '.';
    }
  }
  claims.forEach(claim => {
    const inst = claim.substring(claim.indexOf('@') + 2);
    const coords = inst.match(NUMS_REGEX).map(Number);
    for (let i = coords[1]; i < coords[1] + coords[3]; i++) {
      for (let j = coords[0]; j < coords[0] + coords[2]; j++) {
        fabric[i][j] = fabric[i][j] === '.' ? '#' : 'X'
      }
    }
  });

  let count = 0;
  for (let i = 0; i < fabricSize; i++) {
    for (let j = 0; j < fabricSize; j++) {
      if (fabric[i][j] === 'X') count++;
    }
  }

  console.log(count);
}

function findNiceClaim(claims) {
  const NUMS_REGEX = /[0-9]+/g;
  const fabricSize = 1000;
  const properSizes = [null]; //adding null as 0, so arr id will be eqal to claim id
  const fabric = Array(fabricSize).fill('.').map(() => Array(fabricSize).fill('.'));
  for (let i = 0; i < fabricSize; i++) {
    for (let j = 0; j < fabricSize; j++) {
      fabric[i][j] = '.';
    }
  }
  claims.forEach(claim => {
    const id = Number(claim.substring(1, claim.indexOf('@') - 1));
    const inst = claim.substring(claim.indexOf('@') + 2);
    const coords = inst.match(NUMS_REGEX).map(Number);
    properSizes.push(coords[2] * coords[3]);
    for (let i = coords[1]; i < coords[1] + coords[3]; i++) {
      for (let j = coords[0]; j < coords[0] + coords[2]; j++) {
        fabric[i][j] = fabric[i][j] === '.' ? id : 'X'
      }
    }
  });

  let niceClaim;
  for (let x = 1; x <= claims.length; x++) {
    let count = 0;
    for (let i = 0; i < fabricSize; i++) {
      for (let j = 0; j < fabricSize; j++) {
        if (fabric[i][j] === x) count++;
      }
    }
    if (count === properSizes[x]) {
      niceClaim = x;
      break;
    }
  }

  console.log(niceClaim);
}

//Day 4
const day4_report = fs.readFileSync('./2018/day4.txt', 'utf-8').split('\n');

function prepareSleepSummary(rawReport) {
  const NUMS_REGEX = /[0-9]+/g;
  const reportSorted = rawReport.sort((a, b) => {
    a = new Date(a.substring(1, 17))
    b = new Date(b.substring(1, 17))
    return a - b;
  })
  const sleepingGuards = {};
  let currentGuard;
  let sleepFrom;
  reportSorted.forEach(report => {
    const date = new Date(report.substring(1, 17));
    const info = report.substring(19);
    if (info.includes('begins shift')) {
      currentGuard = info.match(NUMS_REGEX)[0];
    } else if (info.includes('falls asleep')) {
      sleepFrom = date.getMinutes();
    } else {
      const now = date.getMinutes();
      if (sleepingGuards[currentGuard]) {
        sleepingGuards[currentGuard].timeSlept += now - sleepFrom;
        for (let i = sleepFrom; i < now; i++) {
          sleepingGuards[currentGuard].sleptMinutes.push(i);
        }
      } else {
        sleepingGuards[currentGuard] = {};
        sleepingGuards[currentGuard].timeSlept = now - sleepFrom;
        sleepingGuards[currentGuard].sleptMinutes = [sleepFrom];
        for (let i = sleepFrom + 1; i < now; i++) {
          sleepingGuards[currentGuard].sleptMinutes.push(i);
        }
      }
    }
  });
  return sleepingGuards;
}

function findMostSleepingGuard(report) {
  const sleepingGuards = prepareSleepSummary(report);
  const maxSlept = Math.max(...Object.values(sleepingGuards).map(g => g.timeSlept));
  const mostSleepingGuard = Object.keys(sleepingGuards).find(id => sleepingGuards[id].timeSlept === maxSlept);
  const mostCommonMinute = sleepingGuards[mostSleepingGuard].sleptMinutes.reduce((a,b,i,arr) =>
    (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b),
    null);

  console.log(mostSleepingGuard * mostCommonMinute);
}

function findMostCommonSleepGuard(report) {
  const sleepingGuards = prepareSleepSummary(report);
  let biggestFrequency = 0;
  let chosenGuard;
  let chosenMinute;
  Object.values(sleepingGuards).forEach(guard => {
    const mostCommonMinute = guard.sleptMinutes.reduce((a,b,i,arr) =>
      (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b),
      null);
    const frequency = guard.sleptMinutes.filter(m => m === mostCommonMinute).length;
    if (frequency > biggestFrequency) {
      biggestFrequency = frequency;
      chosenMinute = mostCommonMinute;
      chosenGuard = Object.keys(sleepingGuards).find(id => sleepingGuards[id].timeSlept === guard.timeSlept);
    }
  });

  console.log(chosenGuard * chosenMinute);
}

//Day 5
const day5_polymer = fs.readFileSync('./2018/day5.txt', 'utf-8');

function removePolymerUnit(polymer) {
  let polymerAfterReaction = polymer;
  let wasReaction = false
  for (let i = 1; i < polymer.length; i++) {
    if (polymer[i-1] !== polymer[i] && polymer[i-1].toUpperCase() === polymer[i].toUpperCase()) {
      if (i === 1) {
        polymerAfterReaction = polymer.substring(2);
      } else {
        polymerAfterReaction = polymer.substring(0, i - 1) + polymer.substring(i + 1);
      }
      wasReaction = true;
      break;
    }
  }
  return { polymerAfterReaction, wasReaction };
}

function squeezePolymer(day5_polymer) {
  let wasReaction = true;
  let finalPolymer = day5_polymer;
  while (wasReaction) {
    const afterReact = removePolymerUnit(finalPolymer);
    finalPolymer = afterReact.polymerAfterReaction;
    wasReaction = afterReact.wasReaction;
  }

  console.log(finalPolymer.length);
}

function improveAndFullySqueezePolymer(day5_polymer) {
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const polymerLengths = [];
  alphabet.forEach(letter => {
    let finalPolymer = day5_polymer.split('').filter(l => l.toLowerCase() !== letter).join('');
    let wasReaction = true;
    while (wasReaction) {
      const afterReact = removePolymerUnit(finalPolymer);
      finalPolymer = afterReact.polymerAfterReaction;
      wasReaction = afterReact.wasReaction;
    }
    polymerLengths.push(finalPolymer.length)
  })

  console.log(Math.min(...polymerLengths));
}

//Day 6
const day6_coords = fs.readFileSync('./2018/day6.txt', 'utf-8').split('\n').map(c => c.split(', ').map(Number));

function getBiggestFiniteArea(coordinates) {
  const gridWidth = Math.max(...coordinates.map(c => c[0])) + 1;
  const gridHeight = Math.max(...coordinates.map(c => c[1])) + 1;
  const grid = Array(gridHeight).fill('.').map(() => Array(gridWidth).fill('.'));
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      grid[i][j] = '.';
    }
  }
  coordinates.forEach((c, id) => {
    grid[c[1]][c[0]] = id;
  })

  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (typeof grid[i][j] !== 'number') {
        const distances = [];
        coordinates.forEach(c => {
          distances.push(Math.abs(c[0]-j) + Math.abs(c[1]-i));
        });
        const lowestDist = Math.min(...distances);
        if (distances.filter(d => d === lowestDist).length === 1) {
          grid[i][j] = distances.indexOf(Math.min(...distances));
        }
      }
    }
  }

  //Exclude infinite areas
  const infiniteCoords = [];
  for (let i = 0; i < gridHeight; i++) {
    if (typeof grid[i][0] === 'number' && !infiniteCoords.includes(grid[i][0])) infiniteCoords.push(grid[i][0])
    if (typeof grid[i][gridWidth - 1] === 'number' && !infiniteCoords.includes(grid[i][gridWidth - 1])) infiniteCoords.push(grid[i][gridWidth - 1])
  }
  for (let j = 0; j < gridWidth; j++) {
    if (typeof grid[0][j] === 'number' && !infiniteCoords.includes(grid[0][j])) infiniteCoords.push(grid[0][j])
    if (typeof grid[gridHeight - 1][j] === 'number' && !infiniteCoords.includes(grid[gridHeight - 1][j])) infiniteCoords.push(grid[gridHeight - 1][j])
  }
  const finiteCoords = coordinates.map((_, id) => id).filter(i => !infiniteCoords.includes(i));
  const finiteCoordsSizes = {};

  finiteCoords.forEach(c => {
    for (let i = 0; i < gridHeight; i++) {
      for (let j = 0; j < gridWidth; j++) {
        if (typeof grid[i][j] === 'number' && grid[i][j] === c) {
          finiteCoordsSizes[c] ? finiteCoordsSizes[c]++ : finiteCoordsSizes[c] = 1;
        }
      }
    }
  })

  console.log(Math.max(...Object.values(finiteCoordsSizes)));
}

function getNearRegion(coordinates) {
  const gridWidth = Math.max(...coordinates.map(c => c[0])) + 1;
  const gridHeight = Math.max(...coordinates.map(c => c[1])) + 1;
  const grid = Array(gridHeight).fill('.').map(() => Array(gridWidth).fill('.'));
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      grid[i][j] = '.';
    }
  }
  coordinates.forEach((c, id) => {
    grid[c[1]][c[0]] = id;
  });

  let count = 0;

  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      let totalDistance = 0;
      coordinates.forEach(c => {
        totalDistance += Math.abs(c[0]-j) + Math.abs(c[1]-i);
      });
      if (totalDistance < 10000) {
        count++;
      }
    }
  }

  console.log(count);
}

//Day 7
const day7_instructions = fs.readFileSync('./2018/day7.txt', 'utf-8').split('\n');

function prepareSteps(instructions) {
  const allSteps = [];
  instructions.forEach(inst => {
    const step1 = inst.split(' ')[1];
    const step2 = inst.split(' ')[7];
    if (!allSteps.find(step => step.name === step1)) allSteps.push({name: step1, blockedBy: []});
    if (!allSteps.find(step => step.name === step2)) allSteps.push({name: step2, blockedBy: [step1]});
    else allSteps.find(step => step.name === step2).blockedBy.push(step1);
  });
  return allSteps;
}

function findRightOrder(instructions) {
  const allSteps = prepareSteps(instructions);
  const completed = [];
  let ready = allSteps.filter(step => step.blockedBy.length === 0).map(step => step.name);

  while (completed.length !== allSteps.length) {
    if (ready.length === 0) {
      console.log('Something went wrong');
      break;
    }
    const stepInProgress = ready.sort()[0];

    instructions.forEach(inst => {
      const step1 = inst.split(' ')[1];
      const step2 = inst.split(' ')[7];

      if (stepInProgress === step1) {
        const blockedStep = allSteps.find(step => step.name === step2);
        blockedStep.blockedBy = blockedStep.blockedBy.filter(step => step !== step1);
        if (blockedStep.blockedBy.length === 0) ready.push(step2);
      }
    })
    ready = ready.filter(step => step !== stepInProgress);
    completed.push(stepInProgress);
  }

  console.log(completed.join(''));
}

function calcWorktimeWith5Workers(instructions) {
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const allSteps = prepareSteps(instructions);
  const completed = [];
  let ready = allSteps.filter(step => step.blockedBy.length === 0).map(step => step.name);
  const workers = [{ step: '', remaining: 0 }, { step: '', remaining: 0 }, { step: '', remaining: 0 }, { step: '', remaining: 0 }, { step: '', remaining: 0 }]
  let second = -1; // second 0 must be counted too, so we're starting from -1

  while (completed.length !== allSteps.length) {
    workers.forEach(worker => {
      if (worker.step) {
        worker.remaining--;
        if (worker.remaining === 0 && worker.step) {
          ready = ready.filter(s => s !== worker.step);
          completed.push(worker.step);
          allSteps.forEach(step => {
            if (step.blockedBy.includes(worker.step)) {
              step.blockedBy = step.blockedBy.filter(s => s !== worker.step)
            }
            if (step.blockedBy.length === 0 && !ready.includes(step.name) && !completed.includes(step.name) && !workers.map(w => w.step).includes(step.name)) {
              ready.push(step.name);
            }
          })
          worker.step = '';
        }
      }
    })

    if (ready.length === 0) second++;
    else {
      ready.sort().forEach(step => {
        const freeWorker = workers.find(worker => worker.step === '');
        if (freeWorker) {
          freeWorker.step = step;
          freeWorker.remaining = 60 + alphabet.indexOf(step.toLowerCase()) + 1;
          ready = ready.filter(s => s !== step);
        }
      })
      second++;
    };

  }
  console.log(second);
}

//Day 8
const day8_numbers = fs.readFileSync('./2018/day8.txt', 'utf-8').split(' ').map(Number);

function checkLicenseFile(numbers) {
  let metadataSum = 0;
  const nodes = {};
  let position = 'header1';
  let currentStructure = [];
  numbers.forEach(num => {
    if (position === 'header1') {
      if (currentStructure.length === 0) {
        nodes[Object.values(nodes).length] = { childrenToAdd: num, value: 0 };
      } else {
        const node = currentStructure.reduce((val, key) => val.children ? val.children[key] : val[key], nodes);
        node.children[Object.values(node.children).length] = { childrenToAdd: num, value: 0 }
      }
      position = 'header2';
    } else if (position === 'header2') {
      let node, newNode;
      if (currentStructure.length === 0) {
        node = nodes[Object.values(nodes).length - 1]
        node.metaToAdd = num;
        newNode = node;
      } else {
        node = currentStructure.reduce((val, key) => val.children ? val.children[key] : val[key], nodes);
        newNode = node.children[Object.values(node.children).length - 1];
        newNode.metaToAdd = num;
      }

      if (newNode.childrenToAdd > 0) {
        if (!newNode.children) newNode.children = {};
        if (currentStructure.length === 0) {
          currentStructure.push(Object.values(node.children).length)
        } else {
          currentStructure.push(Object.values(node.children).length - 1)
        }
        newNode.childrenToAdd--;
        position = 'header1';
      } else if (newNode.metaToAdd > 0) {
        position = 'metadata'
      } else {
        position = 'header1';
        currentStructure.pop();
      }
    } else if (position === 'metadata') {
      metadataSum += num;
      let node, newNode;
      if (currentStructure.length === 0) {
        node = nodes[Object.values(nodes).length - 1]
        newNode = node;
      } else {
        node = currentStructure.reduce((val, key) => val.children ? val.children[key] : val[key], nodes);
        newNode = node.children[Object.values(node.children).length - 1];
      }

      newNode.metaToAdd--;
      if (newNode.metaToAdd === 0) {
        if (node.childrenToAdd === 0) {
          position = 'metadata'
          currentStructure.pop();
        } else {
          node.childrenToAdd--;
          position = 'header1';
        }
      }

      if (newNode.children && Object.values(newNode.children).length > 0) {
        newNode.value += newNode.children[num-1] ? newNode.children[num-1].value : 0
      } else {
        newNode.value += num;
      }
    }
  });
  console.log(metadataSum);
  console.log(nodes[0].value);
}

//Day 9
const day9_rules = fs.readFileSync('./2018/day9.txt', 'utf-8');

function playMarbles(rules) {
  const NUMS_REGEX = /[0-9]+/g;
  let [players, marbles] = rules.match(NUMS_REGEX);
  const playerPoints = Array(Number(players)).fill(0);

  let circle = [0, 2, 1]; //Starting from round 3, cause it's easier xD
  let currentMarble = 3;
  let currentPlayer = 3;
  let currentPosition = 1;
  while (currentMarble <= (Number(marbles) + 1)) {
    if (currentMarble % 23 === 0) {
      playerPoints[currentPlayer - 1] += Number(currentMarble);
      currentPosition -= 7;
      if (currentPosition < 0) currentPosition = circle.length + currentPosition;
      const removed = circle.splice(currentPosition, 1);
      playerPoints[currentPlayer - 1] += Number(removed);
    } else {
      let toAdd = (currentPosition + 2) % circle.length;
      if (toAdd === 0) toAdd = circle.length
      circle.splice(toAdd, 0, currentMarble);
      currentPosition = toAdd;
    }

    currentMarble++;
    currentPlayer = (currentPlayer + 1) % Number(players);
    if (currentMarble % 100000 === 0) console.log(currentMarble) //logging progress once every 100k
  }

  console.log(Math.max(...playerPoints));
}

/*
The function below is waaay too slow, and probably the worst that could possibly be ran.
I had to save the data in files which I called "saving progress",
and then run it several times which ended up in taking about 5-6 hours to finally complete xD
*/
// Run those if there's a "save". If you want to get an answer,
// you can download a "save" with 7150000 marbles already included from
// https://drive.google.com/drive/folders/1iTXpY7rTi_iZgHDDbElq1Vs2suyq8Adm?usp=sharing
// This will still take a few minutes, but it's better than few hours xD
/*
const c = fs.readFileSync('./2018/day9_circle.txt', 'utf-8').split(',').map(Number);
const p = fs.readFileSync('./2018/day9_points.txt', 'utf-8').split(',').map(Number);
const o = fs.readFileSync('./2018/day9_otherInfo.txt', 'utf-8').split(',').map(Number);
playMarblesAndSave(day9_rules, c, p, o[0], o[1], o[2]);
*/

function playMarblesAndSave(rules, circ, points, marble, player, position) {
  const NUMS_REGEX = /[0-9]+/g;
  let [players, marbles] = rules.match(NUMS_REGEX);
  marbles = Number(marbles) * 100;
  const playerPoints = points;

  let circle = circ;
  let currentMarble = marble;
  let currentPlayer = player;
  let currentPosition = position;
  while (currentMarble <= (Number(marbles) + 1)) {
    if (currentMarble % 23 === 0) {
      playerPoints[currentPlayer - 1] += Number(currentMarble);
      currentPosition -= 7;
      if (currentPosition < 0) currentPosition = circle.length + currentPosition;
      const removed = circle.splice(currentPosition, 1);
      playerPoints[currentPlayer - 1] += Number(removed);
    } else {
      let toAdd = (currentPosition + 2) % circle.length;
      if (toAdd === 0) toAdd = circle.length
      circle.splice(toAdd, 0, currentMarble);
      currentPosition = toAdd;
    }

    currentMarble++;
    currentPlayer = (currentPlayer + 1) % Number(players);
    if (currentMarble % 100000 === 0) {
      //saving progress once every 100k
      console.log('saving at '+ currentMarble)
      fs.writeFileSync('./2018/day9_circle.txt', circle.join(','));
      fs.writeFileSync('./2018/day9_points.txt', playerPoints.join(','));
      fs.writeFileSync('./2018/day9_otherInfo.txt', [currentMarble, currentPlayer, currentPosition].join(','));
    }
  }

  console.log(Math.max(...playerPoints));
}

//Day 10
const day10_stars = fs.readFileSync('./2018/day10.txt', 'utf-8').split('\n');

function getStarsMessage(stars) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const starsInitialPositions = stars.map(star => {
    const [x, y, velX, velY] = star.match(NUMBER_REGEX);
    return { x: Number(x), y: Number(y), velX: Number(velX), velY: Number(velY) }
  });
  const starPositions = [starsInitialPositions];
  const differences = starPositions.map(sky => {
      const xMaxDiff = Math.max(...sky.map(star => star.x)) - Math.min(...sky.map(star => star.x));
      const yMaxDiff = Math.max(...sky.map(star => star.y)) - Math.min(...sky.map(star => star.y));
      return xMaxDiff + yMaxDiff;
    });;

  for (let sec = 1; sec <= 15000; sec++) {
    const newPos = starPositions[sec - 1].map(star => ({
      ...star,
      x: star.x + star.velX,
      y: star.y + star.velY,
    }));
    starPositions.push(newPos);

    const xMaxDiff = Math.max(...newPos.map(star => star.x)) - Math.min(...newPos.map(star => star.x));
    const yMaxDiff = Math.max(...newPos.map(star => star.y)) - Math.min(...newPos.map(star => star.y));
    differences.push(xMaxDiff + yMaxDiff);
  }

  const alignSecond = differences.indexOf(Math.min(...differences));
  //draw sky
  const skyToDraw = starPositions[alignSecond];
  const smallestX = Math.min(...skyToDraw.map(s => s.x))
  const biggestX = Math.max(...skyToDraw.map(s => s.x))
  const smallestY = Math.min(...skyToDraw.map(s => s.y))
  const biggestY = Math.max(...skyToDraw.map(s => s.y))
  const skyWidth = biggestX - smallestX + 1;
  const skyHeight = biggestY - smallestY + 1;
  const sky = Array(skyHeight).fill('.').map(() => Array(skyWidth).fill('.'));
  for (let i = 0; i < skyHeight; i++) {
    for (let j = 0; j < skyWidth; j++) {
      sky[i][j] = '.';
    }
  }

  skyToDraw.forEach(star => {
    sky[star.y - smallestY][star.x - smallestX] = '#';
  })
  console.log(JSON.stringify(sky));
  console.log(alignSecond);
}

//Day 11
const day11_serial_number = Number(fs.readFileSync('./2018/day11.txt', 'utf-8'));

function prepareFuelGrid(gridSize, serial_number) {
  const grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
  for (let i = 1; i < gridSize; i++) {
    for (let j = 1; j < gridSize; j++) {
      const rackID = j + 10;
      let powerLevel = rackID * i + serial_number;
      powerLevel *= rackID;
      powerLevel = Number(Math.trunc(powerLevel / 100).toString().slice(-1))
      powerLevel -= 5;
      grid[i][j] = powerLevel;
    }
  }
  return grid;
}

function findMostFueled3x3Square(serial_number) {
  const gridSize = 301;
  const grid = prepareFuelGrid(gridSize, serial_number);

  const powerLevels = [];
  for (let i = 1; i < gridSize - 2; i++) {
    for (let j = 1; j < gridSize - 2; j++) {
      let totalPower = 0;
      for (let x = 0; x < 3; x ++) {
        for (let y = 0; y < 3; y++) {
          totalPower += grid[i+x][j+y]
        }
      }
      powerLevels.push({x: j, y: i, power: totalPower});
    }
  }

  const mostFueled = powerLevels.find(square => square.power === Math.max(...powerLevels.map(sq => sq.power)))
  console.log(mostFueled.x+','+mostFueled.y);
}

function findMostFueledSquare(serial_number) {
  const gridSize = 301;
  const grid = prepareFuelGrid(gridSize, serial_number);

  const powerLevels = [];
  for (let i = 1; i < gridSize - 2; i++) {
    for (let j = 1; j < gridSize - 2; j++) {
      for (let square = 1; square <= gridSize - Math.max(i,j); square++) {
        let totalPower = 0;
        for (let x = 0; x < square; x ++) {
          for (let y = 0; y < square; y++) {
            totalPower += grid[i+x][j+y]
          }
        }
        powerLevels.push({x: j, y: i, squareSize: square, power: totalPower});
      }
    }
    if (i % 50 === 0) console.log('reached row '+i+'/300');
  }
  console.log('Got to end, searching biggest');

  //got error: Maximum call stack size exceeded. Had to split array into 1000 parts to avoid it
  const partSize = Math.trunc(powerLevels.length / 1000);
  const mostFueledParts = [];
  for (let i = 0; i <= powerLevels.length; i += partSize) {
    const slicedPowerLevels = powerLevels.slice(i, i + partSize);
    const mostFueledPart = slicedPowerLevels.find(square => square.power === Math.max(...slicedPowerLevels.map(sq => sq.power)))
    mostFueledParts.push(mostFueledPart);
  }

  const mostFueled = mostFueledParts.find(square => square.power === Math.max(...mostFueledParts.map(sq => sq.power)));
  console.log('Answer: ' + mostFueled.x + ',' + mostFueled.y + ',' + mostFueled.squareSize);
}

//Day 12
const [day12_plants, day12_spread] = fs.readFileSync('./2018/day12.txt', 'utf-8').split('\n\n');

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function growPlants(plants, spread, generations) {
  const spreadConfig = spread.split('\n').map(sp => {
    const [pattern, outcome] = sp.split(' => ');
    return { pattern, outcome };
  })
  let plantsReadyState = '...' + plants.substring(15) + '...';
  let plantsTempState = plantsReadyState;
  let positionZero = 3;

  /*
  For part 2 I had to find a pattern in which plants are growing.
  For my input, a pattern starts to show up somewhere after 100th generation and it's growing by 23 with every gen
  */
  const generationsWithoutPattern = 115;
  const genToProduce = Math.min(generations, generationsWithoutPattern);

  for (let gen = 1; gen <= genToProduce; gen++) {
    for (let p = 2; p < plantsReadyState.length - 2; p++) {
      const currentPattern = plantsReadyState.substring(p-2, p+3);
      plantsTempState = plantsTempState.replaceAt(p, spreadConfig.find(spread => spread.pattern === currentPattern).outcome);
    }
    if (plantsTempState[2] === '#') {
      plantsTempState = '.' + plantsTempState;
      positionZero++;
    }
    if (plantsTempState[plantsTempState.length - 3] === '#') plantsTempState = plantsTempState + '.';
    plantsReadyState = plantsTempState;
  }

  let potSum = 0;
  plantsReadyState.split('').forEach((pot, id) => {
    if (pot === '#') {
      potSum += id - positionZero;
    }
  })

  if (generations > 115) {
    const gensToAdd = generations - generationsWithoutPattern;
    potSum = potSum + 23 * gensToAdd;
  }
  console.log(potSum);
}

//Day 13
const day13_tracks = fs.readFileSync('./2018/day13.txt', 'utf-8').split('\n').map(row => row.split(''));

function predictCartsCrashes(tracks) {
  let carts = [];
  const directions = ['U', 'R', 'D', 'L', 'U'];
  let firstCrashPosition = null;
  for (let i = 0; i < tracks.length; i++) {
    for (let j = 0; j < tracks[0].length; j++) {
      if (tracks[i][j] === '^') carts.push({ id: `${j}${i}`, x: j, y: i, direction: 'U', nextTurn: 'L' });
      if (tracks[i][j] === '<') carts.push({ id: `${j}${i}`, x: j, y: i, direction: 'L', nextTurn: 'L' });
      if (tracks[i][j] === '>') carts.push({ id: `${j}${i}`, x: j, y: i, direction: 'R', nextTurn: 'L' });
      if (tracks[i][j] === 'v') carts.push({ id: `${j}${i}`, x: j, y: i, direction: 'D', nextTurn: 'L' });
    }
  }

  while (carts.length > 1) {
    let cartsYetToMove = [...carts];
    while (cartsYetToMove.length > 0) {
      const minY = Math.min(...cartsYetToMove.map(c => c.y));
      const matchingCarts = cartsYetToMove.filter(c => c.y === minY);
      let movingCart;
      if (matchingCarts.length > 1) {
        const minX = Math.min(...matchingCarts.map(c => c.x));
        movingCart = {...matchingCarts.find(c => c.x === minX)};
      } else {
        movingCart = {...matchingCarts[0]};
      }
      if (movingCart.direction === 'U') movingCart.y -= 1;
      if (movingCart.direction === 'L') movingCart.x -= 1;
      if (movingCart.direction === 'R') movingCart.x += 1;
      if (movingCart.direction === 'D') movingCart.y += 1;

      const possiblyCollidedCart = carts.find(c => c.x === movingCart.x && c.y === movingCart.y);
      if (possiblyCollidedCart) {
        if (!firstCrashPosition) firstCrashPosition = `${movingCart.x},${movingCart.y}`;
        carts = carts.filter(c => c.id !== movingCart.id && c.id !== possiblyCollidedCart.id);
        cartsYetToMove = cartsYetToMove.filter(c => carts.map(cc => cc.id).includes(c.id));
      }

      if (tracks[movingCart.y][movingCart.x] === "+") {
        if (movingCart.nextTurn === 'L') {
          movingCart = {
            ...movingCart,
            nextTurn: 'S',
            direction: directions[directions.lastIndexOf(movingCart.direction) - 1]
          };
        } else if (movingCart.nextTurn === 'S') {
          movingCart.nextTurn = 'R';
        } else {
          movingCart = {
            ...movingCart,
            nextTurn: 'L',
            direction: directions[directions.indexOf(movingCart.direction) + 1]
          };
        }
      } else if (tracks[movingCart.y][movingCart.x] === '/') {
        if (movingCart.direction === 'U') movingCart.direction = 'R';
        else if (movingCart.direction === 'L') movingCart.direction = 'D';
        else if (movingCart.direction === 'R') movingCart.direction = 'U';
        else movingCart.direction = 'L';
      } else if (tracks[movingCart.y][movingCart.x] === '\\') {
        if (movingCart.direction === 'U') movingCart.direction = 'L';
        else if (movingCart.direction === 'L') movingCart.direction = 'U';
        else if (movingCart.direction === 'R') movingCart.direction = 'D';
        else movingCart.direction = 'R';
      }

      carts = carts.map(c => c.id === movingCart.id ? movingCart : c);
      cartsYetToMove = cartsYetToMove.filter(c => c.id !== movingCart.id);
    }
  }

  console.log(firstCrashPosition);
  console.log(`${carts[0].x},${carts[0].y}`);
}

//Day 14
const day14_number = Number(fs.readFileSync('./2018/day14.txt', 'utf-8'));

function produceRecipesAndFindSequence(sequence) {
  let recipes = '37'.split('');
  let elf1Recipe = 3;
  let elf2Recipe = 7;
  let elf1Position = 0;
  let elf2Position = 1;
  while (recipes.length < sequence + 10 || !recipes.slice(recipes.length - 8).join('').includes(sequence)) {
    const newRecipes = (elf1Recipe + elf2Recipe).toString().split('');
    recipes.push(...newRecipes);
    elf1Position = (elf1Position + 1 + elf1Recipe) % recipes.length;
    elf2Position = (elf2Position + 1 + elf2Recipe) % recipes.length;
    elf1Recipe = Number(recipes[elf1Position]);
    elf2Recipe = Number(recipes[elf2Position]);
  }

  console.log(recipes.slice(sequence, sequence + 10).join(''));
  console.log(recipes.slice(0, recipes.join('').indexOf(sequence)).length);
}

//Day 15
const day15_battlefield = fs.readFileSync('./2018/day15.txt', 'utf-8').split('\n').map(row => row.split(''));
const Graph = require('node-dijkstra');

function generateRoutesInBattlefield(battlefield) {
  const route = new Graph();
  for (let y = 0; y < battlefield.length; y++) {
    for (let x = 0; x < battlefield[0].length; x++) {
      if (battlefield[y][x] !== '#') {
        const from = `${x},${y}`;
        const to = new Map();
        if (battlefield[y-1][x] === '.') to.set(`${x},${y-1}`, 1);
        if (battlefield[y][x-1] === '.') to.set(`${x-1},${y}`, 1);
        if (battlefield[y][x+1] === '.') to.set(`${x+1},${y}`, 1);
        if (battlefield[y+1][x] === '.') to.set(`${x},${y+1}`, 1);

        route.addNode(from, to);
      }
    }
  }
  return route;
}

function simulateBattle(battlefield, elves_power = 3) {
  const battle = JSON.parse(JSON.stringify(battlefield));
  const elvesAtStart = JSON.stringify(battle).split('').filter(x => x === 'E').length;
  let rounds = 0;
  let units = [];
  for (let y = 0; y < battle.length; y++) {
    for (let x = 0; x < battle[0].length; x++) {
      if (battle[y][x] === 'G') {
        units.push({id: `${x}${y}`, unit: battle[y][x], x, y, hp: 200, atk: 3})
      } else if (battle[y][x] === 'E') {
        units.push({id: `${x}${y}`, unit: battle[y][x], x, y, hp: 200, atk: elves_power})
      }
    }
  }
  let battleOngoing = true;

  while (battleOngoing) {
    let unitsYetToMove = [...units];
    let fullRound;
    while (unitsYetToMove.length > 0) {
      fullRound = true;
      //choosing moving unit
      const minY = Math.min(...unitsYetToMove.map(c => c.y));
      const matchingUnits = unitsYetToMove.filter(c => c.y === minY);
      let movingUnit;
      if (matchingUnits.length > 1) {
        const minX = Math.min(...matchingUnits.map(c => c.x));
        movingUnit = {...matchingUnits.find(c => c.x === minX)};
      } else {
        movingUnit = {...matchingUnits[0]};
      }

      //check if there is still any opponent
      if (movingUnit.unit === 'E' && !JSON.stringify(battle).includes('G') ||
      movingUnit.unit === 'G' && !JSON.stringify(battle).includes('E')) {
        fullRound = false;
        break;
      }

      //choosing unit's target
      let target, shouldMove;
      const routes = generateRoutesInBattlefield(battle);
      let possibleTargets = [];
      units.forEach(u => {
        if ((movingUnit.unit === 'E' && u.unit === 'G') || (movingUnit.unit === 'G' && u.unit === 'E')) {
          if (battle[u.y-1][u.x] === '.') possibleTargets.push({x: u.x, y: u.y-1});
          if (battle[u.y][u.x-1] === '.') possibleTargets.push({x: u.x-1, y: u.y});
          if (battle[u.y][u.x+1] === '.') possibleTargets.push({x: u.x+1, y: u.y});
          if (battle[u.y+1][u.x] === '.') possibleTargets.push({x: u.x, y: u.y+1});
        }
      });
      let neighbourTarget;
      if (movingUnit.unit === 'E') {
        neighbourTarget = units.find(u => u.unit === 'G' && Math.abs(u.x - movingUnit.x) + Math.abs(u.y - movingUnit.y) === 1);
      } else {
        neighbourTarget = units.find(u => u.unit === 'E' && Math.abs(u.x - movingUnit.x) + Math.abs(u.y - movingUnit.y) === 1);
      }
      if (neighbourTarget) {
        target = neighbourTarget;
        shouldMove = false;
      } else {
        possibleTargets = possibleTargets.map(t => {
          const r = routes.path(`${movingUnit.x},${movingUnit.y}`, `${t.x},${t.y}`, { cost: true });
          return r.cost ? {...t, distance: r.cost} : null;
        }).filter(t => t !== null);
        if (possibleTargets.length === 0) {
          unitsYetToMove = unitsYetToMove.filter(u => u.id !== movingUnit.id);
          continue;
        }
        const minDistance = Math.min(...possibleTargets.map(t => t.distance));
        possibleTargets = possibleTargets.filter(t => t.distance === minDistance);

        if (possibleTargets.length === 1) {
          target = possibleTargets[0];
        } else {
          const minTargetY = Math.min(...possibleTargets.map(t => t.y));
          possibleTargets = possibleTargets.filter(t => t.y === minTargetY);
          if (possibleTargets.length === 1) {
            target = possibleTargets[0];
          } else {
            const minX = Math.min(...possibleTargets.map(t => t.x));
            target = possibleTargets.find(t => t.x === minX);
          }
        }
        shouldMove = true;
      }

      //moving to target (if needed)
      if (shouldMove) {
        const targetCoords = `${target.x},${target.y}`
        const possibleWays = [];

        const up = `${movingUnit.x},${movingUnit.y-1}`;
        const rUP = routes.path(up, targetCoords, { cost: true });
        if (up === targetCoords) possibleWays.push(0);
        else if (battle[up.split(',')[1]][up.split(',')[0]] !== '.') possibleWays.push(99999);
        else possibleWays.push(rUP.cost ? rUP.cost : 99999);

        const left = `${movingUnit.x-1},${movingUnit.y}`;
        const rLEFT = routes.path(left, targetCoords, { cost: true });
        if (left === targetCoords) possibleWays.push(0);
        else if (battle[left.split(',')[1]][left.split(',')[0]] !== '.') possibleWays.push(99999);
        else possibleWays.push(rLEFT.cost ? rLEFT.cost : 99999);

        const right = `${movingUnit.x+1},${movingUnit.y}`;
        const rRIGHT = routes.path(right, targetCoords, { cost: true });
        if (right === targetCoords) possibleWays.push(0);
        else if (battle[right.split(',')[1]][right.split(',')[0]] !== '.') possibleWays.push(99999);
        else possibleWays.push(rRIGHT.cost ? rRIGHT.cost : 99999);

        const down = `${movingUnit.x},${movingUnit.y+1}`;
        const rDOWN = routes.path(down, targetCoords, { cost: true });
        if (down === targetCoords) possibleWays.push(0);
        else if (battle[down.split(',')[1]][down.split(',')[0]] !== '.') possibleWays.push(99999);
        else possibleWays.push(rDOWN.cost ? rDOWN.cost : 99999);

        const dir = possibleWays.indexOf(Math.min(...possibleWays));
        if (dir === 0) { //UP
          battle[movingUnit.y][movingUnit.x] = ".";
          battle[movingUnit.y-1][movingUnit.x] = movingUnit.unit;
          movingUnit.y -= 1;
        } else if (dir === 1) { //LEFT
          battle[movingUnit.y][movingUnit.x] = ".";
          battle[movingUnit.y][movingUnit.x-1] = movingUnit.unit;
          movingUnit.x -= 1;
        } else if (dir === 2) { //RIGHT
          battle[movingUnit.y][movingUnit.x] = ".";
          battle[movingUnit.y][movingUnit.x+1] = movingUnit.unit;
          movingUnit.x += 1;
        } else { //DOWN
          battle[movingUnit.y][movingUnit.x] = ".";
          battle[movingUnit.y+1][movingUnit.x] = movingUnit.unit;
          movingUnit.y += 1;
        }
        units = units.map(u => u.id === movingUnit.id ? movingUnit : u);
      }

      //attack if possible
      let possibleToAttack = [];
      let toAttack;
      if (movingUnit.unit === 'E') {
        possibleToAttack = units.filter(u => u.unit === 'G' && Math.abs(u.x - movingUnit.x) + Math.abs(u.y - movingUnit.y) === 1);
      } else {
        possibleToAttack = units.filter(u => u.unit === 'E' && Math.abs(u.x - movingUnit.x) + Math.abs(u.y - movingUnit.y) === 1);
      }
      if (possibleToAttack.length === 1) {
        toAttack = possibleToAttack[0].id;
      } else if (possibleToAttack.length > 1) {
        const minHP = Math.min(...possibleToAttack.map(t => t.hp))
        possibleToAttack = possibleToAttack.filter(t => t.hp === minHP);
        if (possibleToAttack.length === 1) {
          toAttack = possibleToAttack[0].id;
        } else {
          const minTargetY = Math.min(...possibleToAttack.map(t => t.y));
          possibleToAttack = possibleToAttack.filter(t => t.y === minTargetY);
          if (possibleToAttack.length === 1) {
            toAttack = possibleToAttack[0].id;
          } else {
            const minX = Math.min(...possibleToAttack.map(t => t.x));
            toAttack = possibleToAttack.find(t => t.x === minX).id;
          }
        }
      }

      if (toAttack) {
        units = units.map(u => u.id === toAttack ? {...u, hp: u.hp - movingUnit.atk} : u);
        unitsYetToMove = unitsYetToMove.map(u => u.id === toAttack ? {...u, hp: u.hp - movingUnit.atk} : u)
        const attacked = units.find(u => u.id === toAttack);
        if (attacked.hp <= 0) {
          battle[attacked.y][attacked.x] = '.';
          units = units.filter(u => u.id !== attacked.id);
          unitsYetToMove = unitsYetToMove.filter(u => u.id !== attacked.id);
        }
      }

      unitsYetToMove = unitsYetToMove.filter(u => u.id !== movingUnit.id);
    }
    if (fullRound) rounds++;
    if (!JSON.stringify(battle).includes('E') || !JSON.stringify(battle).includes('G')) {
      battleOngoing = false;
    }
  }

  const hpSum = units.reduce((a,b) => a + b.hp, 0);
  if (elves_power === 3) {
    //Part 1
    console.log(hpSum * rounds);
    console.log(units)
  } else {
    const elvesAfterFight = JSON.stringify(battle).split('').filter(x => x === 'E').length;
    return { elfLost: elvesAtStart - elvesAfterFight, score: hpSum * rounds, units, rounds, hpSum }
  }
}

function findOptimalAtkPower(battlefield) {
  let score;
  for (let i = 4; !score; i++) {
    const battleResults = simulateBattle(battlefield, i);
    if (battleResults.elfLost === 0) {
      score = battleResults.score;
    }
  }
  console.log(score);
}





// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1:')
// getFrequency(day1_operations.split('\n').join(''));
// console.log('Day 1, part 2 (it may take a while): ')
// findDuplicateInFreq(day1_operations.split('\n'));

// console.log('Day 2, part 1:')
// getChecksumFromIds(day2_ids);
// console.log('Day 2, part 2:')
// findSimilarIds(day2_ids);

// console.log('Day 3, part 1:')
// countOverlapingClaims(day3_claims);
// console.log('Day 3, part 2:')
// findNiceClaim(day3_claims);

// console.log('Day 4, part 1:')
// findMostSleepingGuard(day4_report);
// console.log('Day 4, part 2:')
// findMostCommonSleepGuard(day4_report);

// console.log('Day 5, part 1:')
// squeezePolymer(day5_polymer);
// console.log('Day 5, part 2 (this will take a while):')
// improveAndFullySqueezePolymer(day5_polymer);

// console.log('Day 6, part 1:')
// getBiggestFiniteArea(day6_coords);
// console.log('Day 6, part 2:')
// getNearRegion(day6_coords);

// console.log('Day 7, part 1:')
// findRightOrder(day7_instructions);
// console.log('Day 7, part 2:')
// calcWorktimeWith5Workers(day7_instructions);

// console.log('Day 8, part 1 & 2:')
// checkLicenseFile(day8_numbers);

// console.log('Day 9, part 1:')
// playMarbles(day9_rules);
// console.log('Day 9, part 2 (read comment above the function, you probably don\'t want to run it):')
// playMarblesAndSave(day9_rules, [0,2,1], Array(465).fill(0), 3, 3, 1);

// console.log('Day 10, part 1 & 2:')
// console.log('For part 1 you have to adjust your console size to see drawn letters')
// getStarsMessage(day10_stars)

// console.log('Day 11, part 1:')
// findMostFueled3x3Square(day11_serial_number);
// console.log('Day 11, part 2 (this will take a while):')
// findMostFueledSquare(day11_serial_number);

// console.log('Day 12, part 1:')
// growPlants(day12_plants, day12_spread, 20);
// console.log('Day 12, part 2:')
// growPlants(day12_plants, day12_spread, 50000000000);

// console.log('Day 13, part 1 & 2:')
// predictCartsCrashes(day13_tracks);

// console.log('Day 14, part 1 & 2 (this will take a while):')
// produceRecipesAndFindSequence(day14_number);

// console.log('Day 15, part 1 (this will take a while):');
// simulateBattle(day15_battlefield);
// console.log('Day 15, part 2 (this will take a bigger while):');
// findOptimalAtkPower(day15_battlefield);