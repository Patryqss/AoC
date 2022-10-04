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

//Day 16
let [day16_samples, day16_opcodes] = fs.readFileSync('./2018/day16.txt', 'utf-8').split('\n\n\n\n');
day16_samples = day16_samples.split('\n\n');
day16_opcodes = day16_opcodes.split('\n');

class RegisterProgram {
  // Used in Days: 16, 19 & 21
  constructor(instruction, input, expectedOutput) {
    this.instruction = instruction;
    this.input = input;
    this.expectedOutput = expectedOutput;
    this.matching = 0;
    this.lastMatched = null;
  }

  getMatching() {
    return { count: this.matching, last: this.lastMatched };
  }
  setInput(newInput) {
    this.input = newInput;
  }
  setInstruction(newInst) {
    this.instruction = newInst;
  }
  op0() { //addr
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] + output[this.instruction[2]];
    return output;
  }
  op1() { //addi
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] + this.instruction[2];
    return output;
  }
  op2() { //mulr
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] * output[this.instruction[2]];
    return output;
  }
  op3() { //muli
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] * this.instruction[2];
    return output;
  }
  op4() { //banr
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] & output[this.instruction[2]];
    return output;
  }
  op5() { //bani
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] & this.instruction[2];
    return output;
  }
  op6() { //borr
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] | output[this.instruction[2]];
    return output;
  }
  op7() { //bori
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] | this.instruction[2];
    return output;
  }
  op8() { //setr
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]];
    return output;
  }
  op9() { //seti
    const output = [...this.input];
    output[this.instruction[3]] = this.instruction[1];
    return output;
  }
  op10() { //gtir
    const output = [...this.input];
    output[this.instruction[3]] = this.instruction[1] > output[this.instruction[2]] ? 1 : 0;
    return output;
  }
  op11() { //gtri
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] > this.instruction[2] ? 1 : 0;
    return output;
  }
  op12() { //gtrr
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] > output[this.instruction[2]] ? 1 : 0;
    return output;
  }
  op13() { //eqir
    const output = [...this.input];
    output[this.instruction[3]] = this.instruction[1] === output[this.instruction[2]] ? 1 : 0;
    return output;
  }
  op14() { //eqri
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] === this.instruction[2] ? 1 : 0;
    return output;
  }
  op15() { //eqrr
    const output = [...this.input];
    output[this.instruction[3]] = output[this.instruction[1]] === output[this.instruction[2]] ? 1 : 0;
    return output;
  }
  runOpByName(name) {
    const ops = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];
    const opNum = ops.indexOf(name);
    return this[`op${opNum}`]();
  }
  updateInstructionPointer(pointerIndex) {
    this.input[pointerIndex]++;
    return this.input[pointerIndex];
  }
  checkMatchingInstructions(exclude = []) {
    for (let i = 0; i < 16; i++) {
      if (!exclude.includes(i) && this[`op${i}`]().join(',') === this.expectedOutput.join(',')) {
        this.matching++;
        this.lastMatched = i;
      }
    }
  }
}

function checkSamples(samples) {
  const NUMBER_REGEX = /[0-9]+/g;
  let matchin3OrMore = 0;
  samples.forEach(s => {
    const [input, instruction, output] = s.split('\n').map(x => x.match(NUMBER_REGEX).map(Number));
    const compareMachine = new RegisterProgram(instruction, input, output);
    compareMachine.checkMatchingInstructions();
    if (compareMachine.getMatching().count >= 3) matchin3OrMore++;
  })
  console.log(matchin3OrMore);
}

function workoutRegistersAndExecuteProgram(samples, opcodes) {
  const NUMBER_REGEX = /[0-9]+/g;
  const decodedOps = {};
  while (Object.keys(decodedOps).length < 15) {
    samples.forEach(s => {
      const [input, instruction, output] = s.split('\n').map(x => x.match(NUMBER_REGEX).map(Number));
      const compareMachine = new RegisterProgram(instruction, input, output);
      compareMachine.checkMatchingInstructions(Object.values(decodedOps).map(Number));
      if (compareMachine.getMatching().count === 1) {
        decodedOps[instruction[0]] = compareMachine.getMatching().last
      }
    })
  }

  let output;
  const register = new RegisterProgram(null, [0, 0, 0, 0], null);
  opcodes.forEach(opcode => {
    const inst = opcode.match(NUMBER_REGEX).map(Number);
    const operation = decodedOps[inst[0]];
    register.setInstruction(inst);
    output = register[`op${operation}`]();
    register.setInput(output);
  })
  console.log(output[0]);
}

//Day 17
const day17_clay = fs.readFileSync('./2018/day17.txt', 'utf-8').split('\n');

function findPockets(coords) {
  let c = [...coords];
  const pockets = [];
  while (c.length > 0) {
    let possiblePocket = [c[0].split('x').map(Number)];
    let toRemove = false;
    if (c.includes(`${possiblePocket[0][0]}x${possiblePocket[0][1] + 1}`)) {
      // going down, then right/left, then up
      possiblePocket.push([possiblePocket[0][0], possiblePocket[0][1] + 1]);
      while (c.includes(`${possiblePocket[possiblePocket.length - 1][0]}x${possiblePocket[possiblePocket.length - 1][1] + 1}`)) {
        //go down
        possiblePocket.push([possiblePocket[possiblePocket.length - 1][0], possiblePocket[possiblePocket.length - 1][1] + 1]);
      }

      if (c.includes(`${possiblePocket[possiblePocket.length - 1][0] + 1}x${possiblePocket[possiblePocket.length - 1][1]}`)) {
        //go right
        possiblePocket.push([possiblePocket[possiblePocket.length - 1][0] + 1, possiblePocket[possiblePocket.length - 1][1]]);
        while (c.includes(`${possiblePocket[possiblePocket.length - 1][0] + 1}x${possiblePocket[possiblePocket.length - 1][1]}`)) {
          possiblePocket.push([possiblePocket[possiblePocket.length - 1][0] + 1, possiblePocket[possiblePocket.length - 1][1]]);
        }
      } else if (c.includes(`${possiblePocket[possiblePocket.length - 1][0] - 1}x${possiblePocket[possiblePocket.length - 1][1]}`)) {
        //go left
        possiblePocket.push([possiblePocket[possiblePocket.length - 1][0] - 1, possiblePocket[possiblePocket.length - 1][1]]);
        while (c.includes(`${possiblePocket[possiblePocket.length - 1][0] - 1}x${possiblePocket[possiblePocket.length - 1][1]}`)) {
          possiblePocket.push([possiblePocket[possiblePocket.length - 1][0] - 1, possiblePocket[possiblePocket.length - 1][1]]);
        }
      } else {
        //no bottom, remove
        toRemove = true
      }

      if (!toRemove && c.includes(`${possiblePocket[possiblePocket.length - 1][0]}x${possiblePocket[possiblePocket.length - 1][1] - 1}`)) {
        //go up
        possiblePocket.push([possiblePocket[possiblePocket.length - 1][0], possiblePocket[possiblePocket.length - 1][1] -1]);
        while (c.includes(`${possiblePocket[possiblePocket.length - 1][0]}x${possiblePocket[possiblePocket.length - 1][1] - 1}`)) {
          possiblePocket.push([possiblePocket[possiblePocket.length - 1][0], possiblePocket[possiblePocket.length - 1][1] - 1]);
        }
      } else {
        //no up, remove
        toRemove = true
      }

    } else if (c.includes(`${possiblePocket[0][0]}x${possiblePocket[0][1] - 1}`)) {
      // going up then come back, go right/left, then up

      possiblePocket.push([possiblePocket[0][0], possiblePocket[0][1] - 1]);
      while (c.includes(`${possiblePocket[possiblePocket.length - 1][0]}x${possiblePocket[possiblePocket.length - 1][1] - 1}`)) {
        //go up
        possiblePocket.push([possiblePocket[possiblePocket.length - 1][0], possiblePocket[possiblePocket.length - 1][1] - 1]);
      }

      if (c.includes(`${possiblePocket[0][0] + 1}x${possiblePocket[0][1]}`)) {
        //go right
        possiblePocket.push([possiblePocket[0][0] + 1, possiblePocket[0][1]]);
        while (c.includes(`${possiblePocket[possiblePocket.length - 1][0] + 1}x${possiblePocket[possiblePocket.length - 1][1]}`)) {
          possiblePocket.push([possiblePocket[possiblePocket.length - 1][0] + 1, possiblePocket[possiblePocket.length - 1][1]]);
        }
      } else if (c.includes(`${possiblePocket[0][0] - 1}x${possiblePocket[0][1]}`)) {
        //go left
        possiblePocket.push([possiblePocket[0][0] - 1, possiblePocket[0][1]]);
        while (c.includes(`${possiblePocket[possiblePocket.length - 1][0] - 1}x${possiblePocket[possiblePocket.length - 1][1]}`)) {
          possiblePocket.push([possiblePocket[possiblePocket.length - 1][0] - 1, possiblePocket[possiblePocket.length - 1][1]]);
        }
      } else {
        //no bottom, remove
        toRemove = true
      }

      if (!toRemove && c.includes(`${possiblePocket[possiblePocket.length - 1][0]}x${possiblePocket[possiblePocket.length - 1][1] - 1}`)) {
        //go up
        possiblePocket.push([possiblePocket[possiblePocket.length - 1][0], possiblePocket[possiblePocket.length - 1][1] -1]);
        while (c.includes(`${possiblePocket[possiblePocket.length - 1][0]}x${possiblePocket[possiblePocket.length - 1][1] - 1}`)) {
          possiblePocket.push([possiblePocket[possiblePocket.length - 1][0], possiblePocket[possiblePocket.length - 1][1] - 1]);
        }
      } else {
        //no up, remove
        toRemove = true
      }

    } else {
      c.shift();
      toRemove = true;
    }

    if (!toRemove) {
      const maxX = Math.max(...possiblePocket.map(p => p[0]));
      const minX = Math.min(...possiblePocket.map(p => p[0]));
      const maxY = Math.max(...possiblePocket.map(p => p[1]));
      let minY = Math.min(...possiblePocket.map(p => p[1]));
      while (possiblePocket.map(p => p[1]).filter(y => y === minY).length !== 2) {
        minY++;
      }
      const pocket = {minX, minY, maxX, maxY, id: pockets.length};
      pockets.push(pocket);
    }

    c = c.filter(coord => {
      const coordsInPocket = possiblePocket.map(cc => cc.join('x'))
      return !coordsInPocket.includes(coord)
    });
  }
  return pockets;
}

function simulateWaterFlow(clays) {
  const NUMS_REGEX = /[0-9]+/g;
  let waterY = 1;
  let waterX = [500];
  const clayPositions = [];
  const waterReached = ['500x1'];
  const waterSettled = [];
  let biggestY = 0;
  let biggestX = 0;
  let smallestX = 99999;
  clays.forEach(clay => {
    const coords = clay.match(NUMS_REGEX).map(Number);
    if (clay[0] === 'x') {
      if (coords[0] > biggestX) biggestX = coords[0];
      if (coords[0] < smallestX) smallestX = coords[0];
      for (let y = coords[1]; y <= coords[2]; y++) {
        if (y > biggestY) biggestY = y;
        clayPositions.push(`${coords[0]}x${y}`);
      }
    } else {
      if (coords[0] > biggestY) biggestY = coords[0];
      for (let x = coords[1]; x <= coords[2]; x++) {
        if (x > biggestX) biggestX = x;
        if (x < smallestX) smallestX = x;
        clayPositions.push(`${x}x${coords[0]}`);
      }
    }
  });

  const pockets = findPockets(clayPositions);

  while (waterY < biggestY) {
    const xInNextCheck = [];
    waterX.forEach(x => {
      const pocketBelow = pockets.find(pocket => pocket.minY === waterY + 1 && pocket.minX < x && pocket.maxX > x);
      if (!clayPositions.includes(`${x}x${waterY + 1}`) && !pocketBelow) {
        waterReached.push(`${x}x${waterY + 1}`);
        xInNextCheck.push(x);
      }
      else if (pocketBelow) {
        //fill pocket
        let y = pocketBelow.maxY - 1
        while (y >= pocketBelow.minY) {
          waterReached.push(`${x}x${y}`);
          waterSettled.push(`${x}x${y}`);
          for (let currX = x - 1; currX > pocketBelow.minX; currX--) {
            if (!clayPositions.includes(`${currX}x${y}`)) {
              waterReached.push(`${currX}x${y}`);
              waterSettled.push(`${currX}x${y}`);
            } else {
              break;
            }
          }
          for (let currX = x + 1; currX < pocketBelow.maxX; currX++) {
            if (!clayPositions.includes(`${currX}x${y}`)) {
              waterReached.push(`${currX}x${y}`);
              waterSettled.push(`${currX}x${y}`);
            } else {
              break;
            }
          }
          y--;
        }

        let splitted = 0
        const splittedWater = [];
        //split to left
        let currX = x;
        while(currX >= pocketBelow.minX || (currX < pocketBelow.minX && clayPositions.includes(`${currX}x${waterY + 1}`))) {
          if (!clayPositions.includes(`${currX - 1}x${waterY}`)) {
            currX--;
            splittedWater.push(`${currX}x${waterY}`);
          } else {
            break;
          }
        }
        if (currX < pocketBelow.minX && !clayPositions.includes(`${currX}x${waterY + 1}`)) {
          xInNextCheck.push(currX);
          waterReached.push(`${currX}x${waterY + 1}`);
          splitted++;
        }
        //split to right
        currX = x;
        while(currX <= pocketBelow.maxX || (currX > pocketBelow.maxX && clayPositions.includes(`${currX}x${waterY + 1}`))) {
          if (!clayPositions.includes(`${currX + 1}x${waterY}`)) {
            currX++;
            splittedWater.push(`${currX}x${waterY}`);
          } else {
            break;
          }
        }
        if (currX > pocketBelow.maxX && !clayPositions.includes(`${currX}x${waterY + 1}`)) {
          xInNextCheck.push(currX);
          waterReached.push(`${currX}x${waterY + 1}`);
          splitted++;
        }

        if (splitted === 0) {
          waterReached.push(...splittedWater);
          waterSettled.push(...splittedWater);
          waterSettled.push(`${x}x${waterY}`);
          const newY = waterY - 1;
            //split to left
          let currX = x;
          while(currX >= pocketBelow.minX || (currX < pocketBelow.minX && clayPositions.includes(`${currX}x${newY + 1}`))) {
            if (!clayPositions.includes(`${currX - 1}x${newY}`)) {
              currX--;
              waterReached.push(`${currX}x${newY}`);
            } else {
              break;
            }
          }
          if (currX < pocketBelow.minX && !clayPositions.includes(`${currX}x${newY + 1}`)) {
            xInNextCheck.push(currX);
            waterReached.push(`${currX}x${newY + 1}`);
            waterReached.push(`${currX}x${newY + 2}`); //not safe for edge cases, but they're not in my input
            splitted++;
          }
          //split to right
          currX = x;
          while(currX <= pocketBelow.maxX || (currX > pocketBelow.maxX && clayPositions.includes(`${currX}x${newY + 1}`))) {
            if (!clayPositions.includes(`${currX + 1}x${newY}`)) {
              currX++;
              waterReached.push(`${currX}x${newY}`);
            } else {
              break;
            }
          }
          if (currX > pocketBelow.maxX && !clayPositions.includes(`${currX}x${newY + 1}`)) {
            xInNextCheck.push(currX);
            waterReached.push(`${currX}x${newY + 1}`);
            waterReached.push(`${currX}x${newY + 2}`); //same as above
            splitted++;
          }
        } else {
          waterReached.push(...splittedWater);
        }

      } else {
        //found clay, has to split
        //split to left
        let currX = x;
        while(clayPositions.includes(`${currX}x${waterY + 1}`)) {
          if (!clayPositions.includes(`${currX - 1}x${waterY}`)) {
            currX--;
            waterReached.push(`${currX}x${waterY}`);
          } else {
            break;
          }
        }
        if (!clayPositions.includes(`${currX}x${waterY + 1}`)) {
          xInNextCheck.push(currX);
          waterReached.push(`${currX}x${waterY + 1}`);
        }
        //split to right
        currX = x;
        while(clayPositions.includes(`${currX}x${waterY + 1}`)) {
          if (!clayPositions.includes(`${currX + 1}x${waterY}`)) {
            currX++;
            waterReached.push(`${currX}x${waterY}`);
          } else {
            break;
          }
        }
        if (!clayPositions.includes(`${currX}x${waterY + 1}`)) {
          xInNextCheck.push(currX);
          waterReached.push(`${currX}x${waterY + 1}`);
        }
      }
    });
    waterX = [...new Set(xInNextCheck)];
    waterY++;
  }

  // Creating a visualisation
  const lights = Array(biggestY+1).fill('.').map(() => Array(biggestX - smallestX + 1).fill(''));
  for (let i = 0; i < biggestY+1; i++) {
    for (let j = 0; j < biggestX - smallestX+1; j++) {
      lights[i][j] = '.';
    }
  }
  waterReached.forEach(p => {
    const d = p.split('x').map(Number);
    lights[d[1]][d[0] - smallestX] = '|';
  })
  waterSettled.forEach(p => {
    const d = p.split('x').map(Number);
    lights[d[1]][d[0] - smallestX] = '~';
  })
  clayPositions.forEach(p => {
    const d = p.split('x').map(Number);
    lights[d[1]][d[0] - smallestX] = '#';
  })

  console.log(JSON.stringify(lights).replaceAll('"', '').replaceAll(',', ''));
}

// After getting a massive amount of wrong answers, I created a visualisation and realised
// that there are so many edge cases, that it will take me less time to fix them manually than thinking how to do it in code xD
// I've had enough of this task so here we are xD
const day17_visualisation = fs.readFileSync('./2018/day17_visualisation.txt', 'utf-8');
function countWaterSigns(visualisation) {
  const waterAsText = visualisation.split('');
  const watterReached = waterAsText.filter(x => x === '|').length;
  const watterSettled = waterAsText.filter(x => x === '~').length;
  // Part 1
  console.log(watterReached + watterSettled);
  // Part 2
  console.log(watterSettled);
}

// Day 18
const day18_area = fs.readFileSync('./2018/day18.txt', 'utf-8').split('\n').map(row => row.split(''));

function simulateLumberCollection(area, steps) {
  let currentArea = JSON.parse(JSON.stringify(area));
  let tempArea = JSON.parse(JSON.stringify(area));

  for (let step = 1; step <= Math.min(steps, 1000); step++) {
    for (let i = 0; i < area.length; i++) {
      for (let j = 0; j < area[0].length; j++) {
        let trees = 0;
        let lumberyards = 0;
        if (currentArea[i-1] && currentArea[i-1][j-1] === '|') trees++;
        if (currentArea[i-1] && currentArea[i-1][j] === '|') trees++;
        if (currentArea[i-1] && currentArea[i-1][j+1] === '|') trees++;
        if (currentArea[i][j-1] === '|') trees++;
        if (currentArea[i][j+1] === '|') trees++;
        if (currentArea[i+1] && currentArea[i+1][j-1] === '|') trees++;
        if (currentArea[i+1] && currentArea[i+1][j] === '|') trees++;
        if (currentArea[i+1] && currentArea[i+1][j+1] === '|') trees++;

        if (currentArea[i-1] && currentArea[i-1][j-1] === '#') lumberyards++;
        if (currentArea[i-1] && currentArea[i-1][j] === '#') lumberyards++;
        if (currentArea[i-1] && currentArea[i-1][j+1] === '#') lumberyards++;
        if (currentArea[i][j-1] === '#') lumberyards++;
        if (currentArea[i][j+1] === '#') lumberyards++;
        if (currentArea[i+1] && currentArea[i+1][j-1] === '#') lumberyards++;
        if (currentArea[i+1] && currentArea[i+1][j] === '#') lumberyards++;
        if (currentArea[i+1] && currentArea[i+1][j+1] === '#') lumberyards++;

        if (currentArea[i][j] === '.') {
          if (trees >= 3) tempArea[i][j] = '|';
        }

        if (currentArea[i][j] === '|') {
          if (lumberyards >= 3) tempArea[i][j] = '#';
        }

        if (currentArea[i][j] === '#') {
          if (trees >= 1 && lumberyards >= 1) {
            tempArea[i][j] = '#'
          } else {
            tempArea[i][j] = '.'
          }
        }
      }
    }
    currentArea = JSON.parse(JSON.stringify(tempArea));
  }

  // Very similar case to day 12
  // After 1000 steps, there's already a pattern in quantity: lumberyards are not changing and trees follow this order:
  const treesPattern = [3,2,2,2,0,-2,-1,-2,-3,-1,-2,-1,0,-1,-2,-2,-3,-3,-1,-1,1,1,3,2,3,2,3,1];

  let allTrees = JSON.stringify(currentArea).split('').filter(x => x === '|').length;
  const allLumberyards = JSON.stringify(currentArea).split('').filter(x => x === '#').length;

  if (steps > 1000) {
    // Full cycle in pattern gives 0 change in quantity, so we can ignore that and move to the remains
    const remainingSteps = (steps - 1000) % treesPattern.length;
    if (remainingSteps > 0) {
      const sumOfRemaining = treesPattern.slice(0, remainingSteps).reduce((a,b) => a + b);
      allTrees += sumOfRemaining;
    }
  }

  console.log(allTrees * allLumberyards);
}

// Day 19
const day19_instructions = fs.readFileSync('./2018/day19.txt', 'utf-8').split('\n');

function runRegisterProgram(instructions) {
  const NUMBER_REGEX = /[0-9]+/g;

  let ip = instructions.shift();
  ip = Number(ip.match(NUMBER_REGEX)[0]);
  const pointerIndex = ip;
  ip = 0;
  const register = new RegisterProgram(null, [0, 0, 0, 0, 0, 0], null);

  let output;
  while (ip >= 0 && ip < instructions.length) {
    const inst = instructions[ip].match(NUMBER_REGEX).map(Number);
    inst.unshift(0);
    const operation = instructions[ip].substring(0, 4);
    register.setInstruction(inst);
    output = register.runOpByName(operation);
    register.setInput(output);
    ip = register.updateInstructionPointer(pointerIndex);
  }
  console.log(output[0]);
}

/*
Part 2 was tricky. It would work on the function above but it would take ages to complete.
I had to reverse-engineer it and see what's going on inside.
Turned out it required around 10551330^2 operations. I ran some loops, and found a solution which can be found in a function below
*/

function simulateRegisterWork() {
  /*
  let A = 0;
  let B = 2;
  let C = 0;
  const BIG = 10551330;
  let F = 1;

  while (F <= BIG) {
    C = B * F;
    if (C === BIG) {
      A += F;
    }
    B++;
    if (B > BIG) {
      F++;
      if (F <= BIG) {
        B = 1;
      }
    }
  }
  */

  // Above is explanation about what's going on inside register.
  // It's still taking too long, so below is simpler solution that will give the same result.
  // It's easy to find out that the register is summing up all divisors of BIG number. So here it is:

  const BIG = 10551330;
  let A = 0;
  for (let i = 1; i <= BIG; i++) {
    if (BIG % i === 0) {
      A += i;
    }
  }
  console.log(A);
}

// Day 20
const day20_regex = fs.readFileSync('./2018/day20.txt', 'utf-8');
const DIR_REGEX = /N|E|S|W/;

function getRoomsAndDoorsFromRegex(fullRegex) {
  const routes = {};
  const regex = fullRegex.substring(1, fullRegex.length - 1);
  const position = [0, 0];

  resolveParenthesis(regex, position, routes);

  const dijkstra = new Graph();
  const xs = new Set(), ys = new Set();

  Object.entries(routes).forEach(([from, to]) => {
    dijkstra.addNode(from, to);

    xs.add(Number(from.split('x')[0]));
    ys.add(Number(from.split('x')[1]));
    Object.keys(to).forEach(dest => {
      const [x, y] = dest.split('x');
      xs.add(Number(x));
      ys.add(Number(y));
    })
  });

  const smallestX = Math.min(...xs);
  const biggestX = Math.max(...xs);
  const smallestY = Math.min(...ys);
  const biggestY = Math.max(...ys);

  let furthestRoom = 0;
  let over1000 = 0;

  for(let x = smallestX; x <= biggestX; x++) {
    for (let y = smallestY; y <= biggestY; y++) {
      const distance = dijkstra.path('0x0', `${x}x${y}`, { cost: true }).cost;
      if (distance > furthestRoom) furthestRoom = distance
      if (distance >= 1000) over1000++;
    }
  }

  console.log(furthestRoom);
  console.log(over1000);
}

function updatePositionAndRoute(pos, dir, routes) {
  const newPos = [...pos];
  if (dir === 'N') newPos[1]--;
  if (dir === 'E') newPos[0]++;
  if (dir === 'S') newPos[1]++;
  if (dir === 'W') newPos[0]--;

  if(routes[pos.join('x')]) {
    routes[pos.join('x')] = {...routes[pos.join('x')], [newPos.join('x')]: 1}
  } else {
    routes[pos.join('x')] = {[newPos.join('x')]: 1}
  }
  return newPos;
}

function findContentOfParenthesis(regex) {
  let openings = 0;
  let content;
  for (let i = 0; i < regex.length; i++) {
    if (regex[i] === '(') openings++;
    if (regex[i] === ')') openings--;
    if (openings === 0) {
      content = regex.substring(1, i);
      break;
    }
  }
  return content;
}

function resolveParenthesis(content, position, routes) {
  let endPositions = [];
  let currentPosition = position;
  let multiplePositions = null;
  let wasOR = false;
  let regex = content;
  let finished = false;

  while (!finished) {
    if (!multiplePositions) {
      if (regex[0] && regex[0].match(DIR_REGEX)) {
        currentPosition = updatePositionAndRoute(currentPosition, regex[0], routes);
        regex = regex.substring(1);
        wasOR = false;
      } else if (regex[0] === '|') {
        endPositions.push(currentPosition);
        currentPosition = position;
        regex = regex.substring(1);
        wasOR = true;
      } else if (regex[0] === '(') {
        const inside = findContentOfParenthesis(regex);
        regex = regex.replace(`(${inside})`, '');
        const newPositions = resolveParenthesis(inside, currentPosition, routes);
        multiplePositions = newPositions;
        currentPosition = position;
        wasOR = false;
      } else {
        // nothing more
        endPositions.push(currentPosition);
        finished = true;
      }
    } else {
      if (regex[0] && regex[0].match(DIR_REGEX)) {
        multiplePositions = multiplePositions.map(p => updatePositionAndRoute(p, regex[0], routes));
        regex = regex.substring(1);
        wasOR = false;
      } else if (regex[0] === '|') {
        endPositions.push(...multiplePositions);
        multiplePositions = null;
        regex = regex.substring(1);
        wasOR = true;
      } else if (regex[0] === '(') {
        const inside = findContentOfParenthesis(regex);
        regex = regex.replace(`(${inside})`, '');
        let newPositions = [];
        multiplePositions.forEach(p => {
          const pos = resolveParenthesis(inside, p, routes);
          newPositions.push(...pos);
        })
        multiplePositions = newPositions;
        wasOR = false;
      } else {
        // nothing more
        endPositions.push(...multiplePositions);
        if (wasOR) {
          console.log('Unexpected content');
        }
        finished = true;
      }
    }
  }

  const endJoined = endPositions.map(p => p.join('x'));
  const endNoRepeats = new Set(endJoined);
  return [...endNoRepeats].map(p => p.split('x').map(Number));
}

// Day 21
const day21_instructions = fs.readFileSync('./2018/day21.txt', 'utf-8').split('\n');

// The task was to figure out how the program works and see what number depends on changing register 0.
// Turned out that I have to wait for the instruction 'eqrr 5 0 3' and check what's inside last register.
// At first, I used the same function as in Day 19 with a few modifications, but turned out that it runs for a very long time before getting the answer, so I didn't use it in the end but left it here cause why not.
function findHaltingRegisters_TooLong(instructions) {
  const answers = [];
  let repeats;
  const NUMBER_REGEX = /[0-9]+/g;

  let ip = instructions.shift();
  ip = Number(ip.match(NUMBER_REGEX)[0]);
  const pointerIndex = ip;
  ip = 0;
  const register = new RegisterProgram(null, [ 0, 0, 0, 0, 0, 0 ], null);

  let output;
  while (!repeats) {
    const inst = instructions[ip].match(NUMBER_REGEX).map(Number);
    inst.unshift(0);
    const operation = instructions[ip].substring(0, 4);
    register.setInstruction(inst);
    output = register.runOpByName(operation);
    if (instructions[ip] === 'eqrr 5 0 3') {
      const ans = output[5];
      if (answers.length === 0) {
        console.log('Part 1:');
        console.log(ans);
      }
      if (answers.includes(ans)) {
        const repeatAt = answers.indexOf(ans);
        repeats = answers.slice(repeatAt);
        break;
      }
      answers.push(ans);
    }
    register.setInput(output);
    ip = register.updateInstructionPointer(pointerIndex);
  }

  console.log(repeats[repeats.length - 1]);
}

// This function was created by reverse-engineering the original register program from my input. It executes things much much faster but won't work with any other input.
function findHaltingRegisters() {
  const answers = [];
  let repeats;

  let registerD = 65536;
  let registerE = 12249547;
  registerD = Math.floor(registerD / 256);

  while (!repeats) {
    let registerC = registerD & 255;
    registerE += registerC;
    registerE = ((registerE & 16777215) * 65899) & 16777215;
    if (256 > registerD) {
      if (answers.length === 0) {
        console.log(registerE);
      }

      if (answers.includes(registerE)) {
        const repeatAt = answers.indexOf(registerE);
        repeats = answers.slice(repeatAt);
        repeatPatternFound = true;
      }

      answers.push(registerE)
      registerD = registerE | 65536;
      registerE = 13431073;
    } else {
      registerD = Math.floor(registerD / 256)
    }
  }

  console.log(repeats[repeats.length - 1]);
}

// Day 22
const day22_caveData = fs.readFileSync('./2018/day22.txt', 'utf-8');

function calculateRiskLevelInCave(caveData, addXToCave = 0, addYToCave = 0) {
  const [depth, targetX, targetY] = caveData.match(/[0-9]+/g).map(Number);
  const cave = Array(targetY + 1 + addYToCave).fill(0).map(() => Array(targetX + 1 + addXToCave).fill(0));
  const caveWithRisk = Array(targetY + 1 + addYToCave).fill(0).map(() => Array(targetX + 1 + addXToCave).fill(0));
  let totalRisk = 0;

  for (let y = 0; y <= targetY + addYToCave; y++) {
    for (let x = 0; x <= targetX + addXToCave; x++) {
      let geologicIndex;
      if ((x === 0 && y === 0) || (x === targetX && y === targetY)) {
        geologicIndex = 0;
      } else if (y === 0) {
        geologicIndex = x * 16807;
      } else if (x === 0) {
        geologicIndex = y * 48271;
      } else {
        geologicIndex = cave[y-1][x] * cave[y][x-1];
      }

      const erosionLevel = ((geologicIndex + depth) % 20183);
      cave[y][x] = erosionLevel;
      caveWithRisk[y][x] = erosionLevel % 3;
      totalRisk += erosionLevel % 3;
    }
  }

  if (addXToCave || addYToCave) return caveWithRisk;
  console.log(totalRisk);
}

function findFastestWayInCave(caveData) {
  const [depth, targetX, targetY] = caveData.match(/[0-9]+/g).map(Number);
  const expandCave = 50; // a way may lead outside primary rectangle
  const cave = calculateRiskLevelInCave(caveData, (targetX+expandCave - targetX%expandCave) - targetX, (targetY+expandCave - targetY%expandCave) - targetY);
  const neededTools = {
    0: ['climb', 'torch'],
    1: ['climb', 'nothing'],
    2: ['torch', 'nothing'],
  }
  const recordPlaces = {};

  let fastestWay;
  let currentTime = 0;
  const goal = `${targetX}x${targetY}`;
  const queue = { 0: [{
    position: '0x0',
    tool: 'torch',
  }]}; // time: data

  const clearQueue = () => {
    queue[currentTime].shift();
    if (queue[currentTime].length === 0) {
      delete queue[currentTime];
      currentTime++;
    }
  }

  // BFS
  while (!fastestWay || fastestWay + 7 > currentTime) {
    while (!queue[currentTime]) {
      currentTime++;
    }
    const { position, tool } = queue[currentTime][0];
    if (position === goal) {
      let timeSpent = currentTime;
      if (tool !== 'torch') timeSpent += 7;
      if (!fastestWay || fastestWay > timeSpent) {
        fastestWay = timeSpent
      }
      clearQueue();
      continue;
    }

    const placeMark = `${position}x${tool}`;
    if (recordPlaces[placeMark] && recordPlaces[placeMark] <= currentTime) {
      clearQueue(); // There was a faster way here and already is somewhere in queue
      continue;
    } else {
      recordPlaces[placeMark] = currentTime;
    }

    const possibleLocations = {};
    const [x, y] = position.split('x').map(Number);
    if (y > 0) possibleLocations[`${x}x${y - 1}`] = cave[y-1][x];
    if (y < cave.length - 1) possibleLocations[`${x}x${y + 1}`] = cave[y+1][x];
    if (x > 0) possibleLocations[`${x - 1}x${y}`] = cave[y][x-1];
    if (x < cave[0].length - 1) possibleLocations[`${x + 1}x${y}`] = cave[y][x+1];

    Object.entries(possibleLocations).forEach(([loc, structure]) => {
      if (neededTools[structure].includes(tool)) {
        const newLocObj = { position: loc, tool };
        if (!queue[currentTime + 1]) {
          queue[currentTime + 1] = [newLocObj];
        } else {
          queue[currentTime + 1].push(newLocObj);
        }
      } else {
        const possibleTools = neededTools[structure];
        possibleTools.forEach(newTool => {
          const currentStructure = cave[y][x];
          if (!neededTools[currentStructure].includes(newTool)) return;

          const newLocObj = { position: loc, tool: newTool };
          if (!queue[currentTime + 8]) {
            queue[currentTime + 8] = [newLocObj];
          } else {
            queue[currentTime + 8].push(newLocObj);
          }
        })
      }
    });
    clearQueue();
  }
  console.log(fastestWay);
}

// Day 23
const day23_nanobots = fs.readFileSync('./2018/day23.txt', 'utf-8').split('\n');

function countBotsInRadius(nanobot, neighbours) {
  const [x, y, z, r] = nanobot.match(/-?[0-9]+/g).map(Number);
  let inRange = 0;
  neighbours.forEach(n => {
    const [nx, ny, nz, nr] = n.match(/-?[0-9]+/g).map(Number);
    const distance = Math.abs(x - nx) + Math.abs(y - ny) + Math.abs(z - nz);
    if (distance <= r) inRange++;
  })
  return inRange;
}

function findStrongestNanobotRange(nanobots) {
  let strongestBot = 0;
  let strongestBotData;

  nanobots.forEach(bot => {
    const data = bot.match(/-?[0-9]+/g).map(Number);
    if (data[3] > strongestBot) {
      strongestBot = data[3];
      strongestBotData = bot;
    }
  })
  console.log(countBotsInRadius(strongestBotData, nanobots));
}

function countBotsInRange(location, bots) {
  const [x, y, z] = location.match(/-?[0-9]+/g).map(Number);
  let inRange = 0;
  bots.forEach(n => {
    const [nx, ny, nz, nr] = n.match(/-?[0-9]+/g).map(Number);
    const distance = Math.abs(x - nx) + Math.abs(y - ny) + Math.abs(z - nz);
    if (distance <= nr) inRange++;
  })
  return inRange;
}

function findBestLocationForTeleport(nanobots) {
  let biggestRange = 0;
  let bestLocation;
  nanobots.forEach(bot => {
    // First, find the bot that is detected by the most amount of other bots (reverse of part 1)
    // This should approximately show the best area to look
    const botRange = countBotsInRange(bot, nanobots);
    if (botRange > biggestRange) {
      biggestRange = botRange;
      bestLocation = bot;
    }
  });

  const checkArea = 50 // How much to go in each dimension to check for even beter location
  let [x, y, z] = bestLocation.match(/-?[0-9]+/g).map(Number);
  let smallestDistance = x + y + z;

  for (let a = x - checkArea; a <= x + checkArea; a++) {
    for (let b = y - checkArea; b <= y + checkArea; b++) {
      for (let c = z - checkArea; c <= z + checkArea; c++) {
        const range = countBotsInRange(`${a},${b},${c}`, nanobots);
        if (range > biggestRange) {
          biggestRange = range;
          bestLocation = `${a},${b},${c}`;
        } if (range === biggestRange) {
          const dist = a + b + c;
          if (dist < smallestDistance) {
            bestLocation = `${a},${b},${c}`;
            smallestDistance = dist;
          }
        }
      }
    }
  }

  console.log(biggestRange);
  console.log(bestLocation);
  const [bestX, bestY, bestZ] = bestLocation.match(/[0-9]+/g).map(Number);
  console.log(bestX + bestY + bestZ);
}

const test = `pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5`.split('\n');

// Not finished yet. Takes too long :(((
findBestLocationForTeleport(day23_nanobots)






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

// console.log('Day 16, part 1:');
// checkSamples(day16_samples);
// console.log('Day 16, part 2:');
// workoutRegistersAndExecuteProgram(day16_samples, day16_opcodes);

// This function only counts signs in a prepared visualisation. Read more above in day 17
// console.log('Day 17, part 1 & 2:')
// countWaterSigns(day17_visualisation);

// console.log('Day 18, part 1:');
// simulateLumberCollection(day18_area, 10);
// console.log('Day 18, part 2:');
// simulateLumberCollection(day18_area, 1000000000);

// console.log('Day 19, part 1 (this will take a while):');
// runRegisterProgram(day19_instructions);
// console.log('Day 19, part 2:');
// simulateRegisterWork();

// console.log('Day 20, part 1 & 2 (this will take a while):')
// getRoomsAndDoorsFromRegex(day20_regex);

// console.log('Day 21, part 1 & 2:');
// findHaltingRegisters();

// console.log('Day 22, part 1:');
// calculateRiskLevelInCave(day22_caveData);
// console.log('Day 22, part 2:');
// findFastestWayInCave(day22_caveData);

// console.log('Day 23, part 1:');
// findStrongestNanobotRange(day23_nanobots);
