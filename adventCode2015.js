const fs = require("fs");
const MD5 = require("./md5");
const permutations = require("./permutations");

//Day 1
const day1_instructions = fs.readFileSync('./2015/day1.txt', 'utf-8');

function getFloor(inst) {
  let position = 0;
  for (let i = 0; i < inst.length; i++) {
    if (inst[i] === "(") position++;
    if (inst[i] === ")") position--;
  }
  console.log(position);
}

function getFirstBasementEntering(inst) {
  let position = 0;
  let index = 0;
  for (let i = 0; i < inst.length; i++) {
    if (inst[i] === "(") position++;
    if (inst[i] === ")") position--;
    if (position < 0) {
      index = i + 1;
      break;
    }
  }
  console.log(index);
}

//Day2
const day2_dimensions = fs.readFileSync('./2015/day2.txt', 'utf-8').split('\n');

function getPaperArea(presents) {
  let paperArea = 0;
  presents.forEach(present => {
    const [l, w, h] = present.split('x');
    const sidesArea = [Number(l * w), Number(w * h), Number(l * h)];
    const smallestSide = Math.min(...sidesArea);
    const presentArea = 2 * (sidesArea[0] + sidesArea[1] + sidesArea[2]) + smallestSide;
    paperArea += presentArea;
  })
  console.log(paperArea);
}

function getRibbonLength(presents) {
  let ribbon = 0;
  presents.forEach(present => {
    const sides = present.split('x').map(s => Number(s));
    const bow = sides[0] * sides[1] * sides[2];
    const biggestSide = Math.max(...sides);
    const index = sides.indexOf(biggestSide);
    sides.splice(index, 1);
    const len = sides[0] * 2 + sides[1] * 2 + bow;
    ribbon += len;
  })
  console.log(ribbon);
}

//Day3
const day3_navs = fs.readFileSync('./2015/day3.txt', 'utf-8').split('');

function getUniqueHouses(navs) {
  let currentCoordinates = [0, 0];
  const visitedHouses = ['0x0'];
  navs.forEach(nav => {
    switch (nav) {
      case '<':
        currentCoordinates[0] -= 1;
        break;
      case '>':
        currentCoordinates[0] += 1;
        break;
      case '^':
        currentCoordinates[1] -= 1;
        break;
      case 'v':
        currentCoordinates[1] += 1;
        break;
      default:
        break;
    }
    const coords = currentCoordinates.join('x');
    if (!visitedHouses.includes(coords)) visitedHouses.push(coords);
  });
  console.log(visitedHouses.length);
}

function getUniqueHousesWithRoboSanta(navs) {
  let currentSantaCoordinates = [0, 0];
  let currentRoboSantaCoordinates = [0, 0];
  const visitedHouses = ['0x0'];
  navs.forEach((nav, id) => {
    switch (nav) {
      case '<':
        id % 2 === 1 ? currentSantaCoordinates[0] -= 1 : currentRoboSantaCoordinates[0] -= 1;
        break;
      case '>':
        id % 2 === 1 ? currentSantaCoordinates[0] += 1 : currentRoboSantaCoordinates[0] += 1;
        break;
      case '^':
        id % 2 === 1 ? currentSantaCoordinates[1] -= 1 : currentRoboSantaCoordinates[1] -= 1;
        break;
      case 'v':
        id % 2 === 1 ? currentSantaCoordinates[1] += 1 : currentRoboSantaCoordinates[1] += 1;
        break;
      default:
        break;
    }
    const santaCoords = currentSantaCoordinates.join('x');
    const roboSantaCoords = currentRoboSantaCoordinates.join('x');
    if (!visitedHouses.includes(santaCoords)) visitedHouses.push(santaCoords);
    if (!visitedHouses.includes(roboSantaCoords)) visitedHouses.push(roboSantaCoords);
  });
  console.log(visitedHouses.length);
}

//Day4
const day4_secretKey = fs.readFileSync('./2015/day4.txt', 'utf-8');

function mineAdventCoin(puzzle) {
  let firstSecretKey = 0;
  let secondSecretKey = 0;
  for (let i = 1; i < 9999999; i++) {
    const hash = MD5(puzzle + i);
    if (hash.substring(0, 5) === '00000' && !firstSecretKey) {
      firstSecretKey = i;
    }
    if (hash.substring(0, 6) === '000000') {
      secondSecretKey = i;
      break;
    }
  }
  console.log(firstSecretKey)
  console.log(secondSecretKey)
}

//Day5
const day5_strings = fs.readFileSync('./2015/day5.txt', 'utf-8').split('\n');

function countNiceStrings(strings) {
  let count = 0;
  strings.forEach(s => {
    sArray = s.split('');
    const vowels = sArray.filter(letter => letter === "a" || letter === "e" || letter === "i" || letter === "o" || letter === "u")
    if (vowels.length >= 3) {
      if (!s.includes('ab') && !s.includes('cd') && !s.includes('pq') && !s.includes('xy')) {
        let check = false;
        for (let i = 1; i < sArray.length; i++) {
          if (sArray[i] === sArray[i - 1]) {
            check = true;
          }
        }
        if (check) count++
      }
    }
  })
  console.log(count);
}

function countNiceStrings2(strings) {
  const firstTestPass = [];
  strings.forEach(s => {
    let check = false;
    for (let i = 2; i < s.length; i++) {
      if (s[i] === s[i - 2]) check = true;
    }
    if (check) firstTestPass.push(s);
  });
  const secondTestPass = [];
  firstTestPass.forEach(s => {
    const sArray = s.split('');
    const pairs = sArray.map((letter, id) => {
      if (id + 1 === sArray.length) return null;
      return letter + sArray[id + 1]
    })
    pairs.pop();
    let check = pairs.some((pair, id) =>
      pairs.indexOf(pair) !== id && pairs.indexOf(pair) + 1 !== id
    )
    if (check) secondTestPass.push(s)
  })
  console.log(secondTestPass.length);
}

//Day 6
const day6_instructions = fs.readFileSync('./2015/day6.txt', 'utf-8').split('\n');

function setAndCountLights(instructions) {
  const gridSize = 1000;
  const lights = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      lights[i][j] = 0;
    }
  }
  instructions.forEach(inst => {
    const [firstPart, endLight] = inst.split(' through ');
    const spaceId = firstPart.lastIndexOf(" ")
    const command = firstPart.substring(0, spaceId);
    const startLight = firstPart.substring(spaceId + 1);
    let [startLightX, startLightY] = startLight.split(',')
    let [endLightX, endLightY] = endLight.split(',')
    startLightX = Number(startLightX)
    startLightY = Number(startLightY)
    endLightX = Number(endLightX)
    endLightY = Number(endLightY)

    if (command === "turn on") {
      for (let i = startLightX; i <= endLightX; i++) {
        for (let j = startLightY; j <= endLightY; j++) {
          lights[j][i] = 1;
        }
      }
    } else if (command === "turn off") {
      for (let i = startLightX; i <= endLightX; i++) {
        for (let j = startLightY; j <= endLightY; j++) {
          lights[j][i] = 0;
        }
      }
    } else {
      for (let i = startLightX; i <= endLightX; i++) {
        for (let j = startLightY; j <= endLightY; j++) {
          lights[j][i] = lights[j][i] === 0 ? 1 : 0;
        }
      }
    }
  });
  let count = 0;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (lights[i][j] === 1) count++
    }
  }
  console.log(count);
}

function setAndCountBrightness(instructions) {
  const gridSize = 1000;
  const lights = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      lights[i][j] = 0;
    }
  }
  instructions.forEach(inst => {
    const [firstPart, endLight] = inst.split(' through ');
    const spaceId = firstPart.lastIndexOf(" ")
    const command = firstPart.substring(0, spaceId);
    const startLight = firstPart.substring(spaceId + 1);
    let [startLightX, startLightY] = startLight.split(',')
    let [endLightX, endLightY] = endLight.split(',')
    startLightX = Number(startLightX)
    startLightY = Number(startLightY)
    endLightX = Number(endLightX)
    endLightY = Number(endLightY)

    if (command === "turn on") {
      for (let i = startLightX; i <= endLightX; i++) {
        for (let j = startLightY; j <= endLightY; j++) {
          lights[j][i] += 1;
        }
      }
    } else if (command === "turn off") {
      for (let i = startLightX; i <= endLightX; i++) {
        for (let j = startLightY; j <= endLightY; j++) {
          if (lights[j][i] > 0) lights[j][i] -= 1;
        }
      }
    } else {
      for (let i = startLightX; i <= endLightX; i++) {
        for (let j = startLightY; j <= endLightY; j++) {
          lights[j][i] += 2;
        }
      }
    }
  });
  let count = 0;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      count += lights[i][j]
    }
  }
  console.log(count);
}

//Day 7
const day7_circuit = fs.readFileSync('./2015/day7.txt', 'utf-8').split('\n');

function uint16 (n) {
  return n & 0xFFFF;
}

function emulateCircuit(instructions, wirres) {
  const COMMAND_REGEX = /[A-Z]+/g;
  const ARGUMENTS_REGEX = /[a-z0-9]+/g;
  const bitwiseMethods = {
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    NOT: a => ~a,
    LSHIFT: (a, b) => a << b,
    RSHIFT: (a, b) => a >> b
  };
  const wires = wirres ? wirres : {};
  let missedInst = 0;
  instructions.forEach(instruction => {
    const command = instruction.match(COMMAND_REGEX);
    const args = instruction.match(ARGUMENTS_REGEX);
    const destination = args.pop();
    if (!command) {
      const value = !isNaN(args[0]) ? Number(args[0]) : wires[args[0]];
      if (wires[destination] === undefined && value !== undefined) {
        wires[destination] = value
      }
    } else if ((command[0] === 'OR' || command[0] === 'AND')) {
      const a = !isNaN(args[0]) ? Number(args[0]) : wires[args[0]];
      const b = !isNaN(args[1]) ? Number(args[1]) : wires[args[1]];
      if (a !== undefined && b !== undefined) wires[destination] = uint16(bitwiseMethods[command[0]](a, b));
    } else if (command[0] === 'NOT') {
      const a = !isNaN(args[0]) ? Number(args[0]) : wires[args[0]];
      if (a !== undefined) wires[destination] = uint16(bitwiseMethods['NOT'](a));
    } else if ((command[0] === 'LSHIFT' || command[0] === 'RSHIFT')) {
      const a = !isNaN(args[0]) ? Number(args[0]) : wires[args[0]];
      const b = Number(args[1]);
      if (a !== undefined && b !== undefined) wires[destination] = uint16(bitwiseMethods[command[0]](a, b));
    } else {
      missedInst++;
    }
  });

  return wires;
}

function getWire(instructions, name) {
  let wires = {}; // Part 1
  let wiresWithDefaul = {b: 3176}; // Part 2
  while (!wires[name]) {
    wires = emulateCircuit(instructions, wires);
  }
  console.log(wires[name]);

  while (!wiresWithDefaul[name]) {
    wiresWithDefaul = emulateCircuit(instructions, wiresWithDefaul);
  }
  console.log(wiresWithDefaul[name])
}

//Day 8
const day8_strings = fs.readFileSync('./2015/day8.txt', 'utf-8').split('\n');

//For part 1, select all in day8.txt in any text editor and check for number of chars, substract number of lines
//Result is: 6309

function countStringChars(strings) {
  let length = 0;
  strings.forEach(str => {
    length+= str.length;
    length-= 2; //because of ""
  })
  return length - 1; //dunno why "-1" tbh, but it had sense to me when I wrote this xD
}
//Also, for some reason this doesn't give right answer in the VS Code, so this function needs to be copied to the browser and ran there
//Proper result is: 4976

/*
Part 2: Have to manage input in text editor, no code here :c
Change all \ -> \\
Change all \" -> \\"
Watch out for traps, so remove slashes from all `\"\n"`
Add 4 * number of lines
Select all and check for number of chars
Result is: 8655
Don't substract number of lines from day8.txt this time: 6609
*/

//Day 9
const day9_routes = fs.readFileSync('./2015/day9.txt', 'utf-8').split('\n');

function findPathsByBruteForce(routes) {
  const CITIES_REGEX = /[a-zA-Z]+/g;
  const DISTANCE_REGEX = /[0-9]+/g;
  const allCities = [];
  const allRoutes = {};
  routes.forEach(r => {
    const distance = Number(r.match(DISTANCE_REGEX)[0]);
    const cities = r.match(CITIES_REGEX);
    if (!allCities.includes(cities[0])) allCities.push(cities[0])
    if (!allCities.includes(cities[2])) allCities.push(cities[2])

    allRoutes[`${allCities.indexOf(cities[0])}x${allCities.indexOf(cities[2])}`] = distance;
    allRoutes[`${allCities.indexOf(cities[2])}x${allCities.indexOf(cities[0])}`] = distance;
  })

  const distances = [];

  //Probably one of the worst possible ways to solve this, but at least works xD
  //Getting all possible combinations
  for (let a = 0; a < allCities.length; a++) {
    for (let b = 0; b < allCities.length; b++) {
      for (let c = 0; c < allCities.length; c++) {
        if (a === b) break;
        for (let d = 0; d < allCities.length; d++) {
          if (b === c || a === c) break;
          for (let e = 0; e < allCities.length; e++) {
            if (c === d || a === d || b === d) break;
            for (let f = 0; f < allCities.length; f++) {
              if (d === e || a === e || a === e) break;
              for (let g = 0; g < allCities.length; g++) {
                if (e === f) break;
                for (let h = 0; h < allCities.length; h++) {
                  const paths = [a, b, c, d, e, f, g, h];
                  if ((new Set(paths)).size === paths.length) {
                    let distance = 0;
                    distance += allRoutes[`${a}x${b}`];
                    distance += allRoutes[`${b}x${c}`];
                    distance += allRoutes[`${c}x${d}`];
                    distance += allRoutes[`${d}x${e}`];
                    distance += allRoutes[`${e}x${f}`];
                    distance += allRoutes[`${f}x${g}`];
                    distance += allRoutes[`${g}x${h}`];
                    distances.push(distance)
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(Math.min(...distances))
  console.log(Math.max(...distances))
}

//Day 10
const day10_number = fs.readFileSync('./2015/day10.txt', 'utf-8');

function lookAndSay(number, repeats) {
  let currentNum = number.split('').map(Number);
  let newNum = [];
  let currentDigit, repeated;
  for (let i = 1; i <= repeats; i++) {
    currentNum.forEach((digit, id) => {
      if (id === 0) {
        currentDigit = digit;
        repeated = 1;
      } else {
        if (digit === currentDigit) {
          repeated++;
        } else {
          newNum.push(repeated, currentDigit);
          currentDigit = digit;
          repeated = 1;
        }
      }
    });
    newNum.push(repeated, currentDigit);
    currentNum = [...newNum];
    newNum = [];
  };
  console.log(currentNum.length);
}

//Day 11
const day11_password = fs.readFileSync('./2015/day11.txt', 'utf-8');
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b'];

function getNextPassword(oldPass) {
  let newPass = oldPass.split('');
  let currentPos = oldPass.length
  while (newPass[currentPos - 1] === 'z') {
    newPass[currentPos - 1] = 'a'
    currentPos--;
  }
  if (newPass[currentPos] === 'a') newPass[currentPos - 1] = alphabet[alphabet.indexOf(newPass[currentPos - 1]) + 1];
  if (!newPass[currentPos]) newPass[currentPos - 1] = alphabet[alphabet.indexOf(newPass[currentPos - 1]) + 1];
  return newPass.join('');
}

function hasIncreasingLetters(string) {
  return string.split('').some((letter, id) =>
    string[id + 1] === alphabet[alphabet.indexOf(letter) + 1] &&
    string[id + 2] === alphabet[alphabet.indexOf(letter) + 2] &&
    string[id + 1] !== 'a' && string[id + 2] !== 'a'
  );
}

function hasForbiddenChars(string) {
  return string.includes('i') || string.includes('o') || string.includes('l');
}

function hasTwoDifferentPairs(string) {
  const pairs = string.split('').filter((letter, id) => letter === string[id+1]);
  return (new Set(pairs)).size > 1
}

function findNextValidPassword(oldPass) {
  let currentPass = getNextPassword(oldPass);
  while (!hasIncreasingLetters(currentPass) || hasForbiddenChars(currentPass) || !hasTwoDifferentPairs(currentPass)) {
    currentPass = getNextPassword(currentPass);
  }
  console.log(currentPass);
  return currentPass;
}

//Day 12
const day12_JSON = fs.readFileSync('./2015/day12.txt', 'utf-8');
const day12_JSON_trimmed = fs.readFileSync('./2015/day12.json', 'utf-8');

function sumNumbersFromJson(json) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const nums = json.match(NUMBER_REGEX);
  const sum = nums.reduce((a,b) => Number(a) + Number(b))
  console.log(sum)
}

//Day 13
const day13_guests = fs.readFileSync('./2015/day13.txt', 'utf-8').split('\n');

function countHappiness(guests, include_me) {
  const people = [];
  const happiness = {};
  guests.forEach(g => {
    const inst = g.split(' ');
    if (!people.includes(inst[0])) people.push(inst[0]);

    const connection = `${inst[0]}_${inst[10].replace('.', '')}`;
    points = Number(`${inst[2] === 'gain' ? '' : '-'}${inst[3]}`);
    happiness[connection] = points;
  })
  if (include_me) {
    people.forEach(p => {
      happiness[`${p}_me`] = 0;
      happiness[`me_${p}`] = 0;
    })
    people.push('me');
  }

  const possibleArrangements = permutations(people);
  const happinessScores = [];

  possibleArrangements.forEach(arr => {
    arr.push(arr[0]); //Adding first person to last position so we get circle
    let happy = 0;
    for (let i = 1; i < arr.length; i++) {
      happy += happiness[`${arr[i-1]}_${arr[i]}`];
      happy += happiness[`${arr[i]}_${arr[i-1]}`];
    }
    happinessScores.push(happy);
  })

  if (!include_me) {
    console.log(Math.max(...happinessScores));
  } else {
    // got RangeError: Maximum call stack size exceeded,
    // so I assumed that the answer will be larger than 200 and shortened the list
    console.log(Math.max(...happinessScores.filter(h => h > 200)))
  }
}

//Day 14
const day14_reindeers = fs.readFileSync('./2015/day14.txt', 'utf-8').split('\n');

function findFastestReindeer(reindeers, time) {
  const NUMBER_REGEX = /[0-9]+/g;
  const reindeersDistances = [];
  reindeers.forEach(r => {
    const values = r.match(NUMBER_REGEX).map(Number);
    let timeLeft = time;
    let flyLeft = values[1];
    let distance = 0;
    while (timeLeft > 0) {
      if (flyLeft > 0) {
        distance += values[0];
        flyLeft--;
        timeLeft--;
      } else {
        timeLeft -= values[2];
        flyLeft = values[1];
      }
    }
    reindeersDistances.push(distance);
  })

  console.log(Math.max(...reindeersDistances));
}

function findReindeerOnLead(reindeers, time) {
  const NUMBER_REGEX = /[0-9]+/g;
  const reindeersDetails = [];
  reindeers.forEach((r, id) => {
    const values = r.match(NUMBER_REGEX).map(Number);
    reindeersDetails.push({
      values,
      distance: 0,
      points: 0,
      flyLeft: values[1],
      restLeft: 0,
      id
    });
  })

  let timeLeft = time;
  while (timeLeft > 0) {
    reindeersDetails.forEach(r => {
      if (r.flyLeft > 0) {
        r.distance += r.values[0];
        r.flyLeft--;
        if (r.flyLeft === 0) r.restLeft = r.values[2];
      } else {
        r.restLeft--;
        if (r.restLeft === 0) r.flyLeft = r.values[1]
      }
    });
    const biggestDistance = Math.max(...reindeersDetails.map(r => r.distance));
    reindeersDetails.forEach(r => {
      if (r.distance === biggestDistance) r.points++;
    });
    timeLeft--;
  }

  console.log(Math.max(...reindeersDetails.map(r => r.points)));
}

//Day 15
const day15_ingredients = fs.readFileSync('./2015/day15.txt', 'utf-8').split('\n');

function calcRecipeScore(values, spoons) {
  const scores = values[0].map(() => 0);
  for (let i = 0; i < values[0].length; i++) {
    for (let j = 0; j < values.length; j++) {
      scores[i] += spoons[j] * values[j][i]
    }
  }
  const finalScore = scores.reduce((a,b) => a * b);
  return finalScore > 0 ? finalScore : 0;
}

function createRecipe(ingredients) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const values = ingredients.map(i => i.match(NUMBER_REGEX).map(Number).slice(0,4));
  const spoons = values.map(() => 1);
  let availableSpoons = 100 - values.length;

  while (availableSpoons > 0) {
    let possibleScores = [];
    for (let i = 0; i < values.length; i++) {
      possibleScores.push(calcRecipeScore(values, spoons.map((s, id) => i === id ? s + 1 : s)));
    }
    const bestAt = possibleScores.indexOf(Math.max(...possibleScores));
    spoons[bestAt]++;
    availableSpoons--;
  }

  console.log(calcRecipeScore(values, spoons));
}

function createRecipeWith500Calories(ingredients) {
  const NUMBER_REGEX = /-?[0-9]+/g;
  const values = ingredients.map(i => i.match(NUMBER_REGEX).map(Number).slice(0,4));
  const calories = ingredients.map(i => i.match(NUMBER_REGEX).map(Number).pop());
  const possibleSpoons = [];

  // Don't really like it (similar like on day 9) but it's the only thing that came to my mind
  for (a = 1; a <= 100; a++) {
    for (b = 1; b <= 100 - a; b++) {
      for (c = 1; c <= 100 - a - b; c++) {
        for (d = 1; d <= 100 - a - b - c; d++) {
          if (a + b + c + d === 100) {
            if (calories[0] * a + calories[1] * b + calories[2] * c + calories[3] * d === 500) {
              possibleSpoons.push([a, b, c, d]);
            }
          }
        }
      }
    }
  }

  let highestScore = 0;
  possibleSpoons.forEach(spoons => {
    const score = calcRecipeScore(values, spoons);
    if (score > highestScore) highestScore = score;
  })
  console.log(highestScore)
}

//Day 16
const day16_aunts = fs.readFileSync('./2015/day16.txt', 'utf-8').split('\n');
const targetAunt = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}

function findAunt(aunts) {
  let foundAunt;
  aunts.forEach((aunt, id) => {
    let allGood = true;
    Object.entries(targetAunt).forEach(([property, amount]) => {
      if (aunt.includes(property)) {
        if (Number(aunt[aunt.indexOf(property) + property.length + 2]) !== amount) {
          allGood = false;
        }
      }
    })
    if (allGood === true) {
      foundAunt = id + 1;
    }
  })

  console.log(foundAunt);
}

function findAunt2(aunts) {
  let foundAunt;
  aunts.forEach((aunt, id) => {
    let allGood = true;
    Object.entries(targetAunt).forEach(([property, amount]) => {
      if (aunt.includes(property)) {
        const propAmount = Number(aunt[aunt.indexOf(property) + property.length + 2]);
        if (property === 'cats' || property === 'trees') {
          if (propAmount <= amount) allGood = false;
        }
        else if (property === 'pomeranians' || property === 'goldfish') {
          if (propAmount >= amount) allGood = false;
        }
        else if (propAmount !== amount) {
          allGood = false
        }
      }
    })
    if (allGood === true) {
      foundAunt = id + 1;
    }
  })

  console.log(foundAunt);
}

//Day 17
const day17_containers = fs.readFileSync('./2015/day17.txt', 'utf-8').split('\n').map(Number);

function findCombinations(containers, target) {
  const check = [0];
  combinations = [];

  while (check[0] <= containers.length - 1) {
    let sum = 0;
    for (let i = 0; i < check.length; i++) {
      sum += containers[check[i]];
    }
    if (sum < target) {
      if (check[check.length - 1] < containers.length - 1) {
        check.push(check[check.length - 1] + 1);
      } else {
        check.pop();
        check[check.length - 1]++;
      }
    }
    else {
      if (sum === target) combinations.push([...check.map(c => containers[c])]);
      if (check[check.length - 1] < containers.length - 1) {
        check[check.length - 1]++;
      } else {
        check.pop();
        check[check.length - 1]++;
      }
    }
  }

  //Part 1
  console.log(combinations.length);

  //Part 2
  const usedContainers = combinations.map(c => c.length);
  const minUsed = Math.min(...usedContainers);
  console.log(usedContainers.filter(num => num === minUsed).length);
}

//Day 18
const day18_lights = fs.readFileSync('./2015/day18.txt', 'utf-8').split('\n').map(row => row.split(''));

function playLightAnimation(lights, stuckCorners = false) {
  if (stuckCorners) {
    lights[0][0] = '#';
    lights[0][99] = '#';
    lights[99][0] = '#';
    lights[99][99] = '#';
  }
  let currentSetting = JSON.parse(JSON.stringify(lights));
  let tempSetting = JSON.parse(JSON.stringify(lights));

  for (let step = 1; step <= 100; step++) {
    for (let i = 0; i < lights.length; i++) {
      for (let j = 0; j < lights[0].length; j++) {
        let neighboursOn = 0;
        if (currentSetting[i-1] && currentSetting[i-1][j-1] === '#') neighboursOn++;
        if (currentSetting[i-1] && currentSetting[i-1][j] === '#') neighboursOn++;
        if (currentSetting[i-1] && currentSetting[i-1][j+1] === '#') neighboursOn++;
        if (currentSetting[i][j-1] === '#') neighboursOn++;
        if (currentSetting[i][j+1] === '#') neighboursOn++;
        if (currentSetting[i+1] && currentSetting[i+1][j-1] === '#') neighboursOn++;
        if (currentSetting[i+1] && currentSetting[i+1][j] === '#') neighboursOn++;
        if (currentSetting[i+1] && currentSetting[i+1][j+1] === '#') neighboursOn++;

        if (currentSetting[i][j] === '#') {
          neighboursOn === 2 || neighboursOn === 3 ? tempSetting[i][j] = '#' : tempSetting[i][j] = '.';
        }

        if (currentSetting[i][j] === '.') {
          neighboursOn === 3 ? tempSetting[i][j] = '#' : tempSetting[i][j] = '.';
        }
      }
    }
    if (stuckCorners) {
      tempSetting[0][0] = '#';
      tempSetting[0][99] = '#';
      tempSetting[99][0] = '#';
      tempSetting[99][99] = '#';
    }
    currentSetting = JSON.parse(JSON.stringify(tempSetting));
  }
  console.log(JSON.stringify(currentSetting).split('').filter(x => x === '#').length);
}

//Day 19
const [day19_replacements, day19_medicine] = fs.readFileSync('./2015/day19.txt', 'utf-8').split('\n\n');

function findDistinctMolecules(replacements, medicine) {
  const reps = replacements.split('\n').map(row => row.match(/[A-Za-z]+/g))
  const molecules = [];

  reps.forEach(([from, to]) => {
    let startAt = 0;
    while (medicine.indexOf(from, startAt) !== -1) {
      const toReplace = medicine.indexOf(from, startAt);
      const molecule = medicine.split('');
      molecule.splice(toReplace, from.length, to);
      molecules.push(molecule.join(''));
      startAt = toReplace + 1;
    }
  });

  console.log(new Set(molecules).size)
}

//Part 2
// ?????



// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1:')
// getFloor(day1_instructions);
// console.log('Day 1, part 2:')
// getFirstBasementEntering(day1_instructions);

// console.log('Day 2, part 1:')
// getPaperArea(day2_dimensions);
// console.log('Day 2, part 2:')
// getRibbonLength(day2_dimensions);

// console.log('Day 3, part 1:')
// getUniqueHouses(day3_navs);
// console.log('Day 3, part 2:')
// getUniqueHousesWithRoboSanta(day3_navs);

// console.log('Day 4, part 1 & 2 (this will take a while):')
// mineAdventCoin(day4_secretKey);

// console.log('Day 5, part 1:')
// countNiceStrings(day5_strings);
// console.log('Day 5, part 2:')
// countNiceStrings2(day5_strings);

// console.log('Day 6, part 1:')
// setAndCountLights(day6_instructions);
// console.log('Day 6, part 2:')
// setAndCountBrightness(day6_instructions);

// console.log('Day 7, part 1 & 2:')
// getWire(day7_circuit, 'a')

// console.log('Day 8, part 1:');
// console.log(6309 - 4976);
// console.log('Day 8, part 2:');
// console.log(8655 - 6609);

// console.log('Day 9, part 1 & 2:')
// findPathsByBruteForce(day9_routes)

// console.log('Day 10, part 1:')
// lookAndSay(day10_number, 40);
// console.log('Day 10, part 2:')
// lookAndSay(day10_number, 50);

// console.log('Day 11, part 1 & 2:')
// const newPass = findNextValidPassword(day11_password);
// findNextValidPassword(newPass);

// console.log('Day 12, part 1:')
// sumNumbersFromJson(day12_JSON)
// console.log('Day 12, part 2:')
// sumNumbersFromJson(day12_JSON_trimmed)

// console.log('Day 13, part 1:')
// countHappiness(day13_guests, false)
// console.log('Day 13, part 2:')
// countHappiness(day13_guests, true)

// console.log('Day 14, part 1:')
// findFastestReindeer(day14_reindeers, 2503);
// console.log('Day 14, part 2:')
// findReindeerOnLead(day14_reindeers, 2503)

// console.log('Day 15, part 1:');
// createRecipe(day15_ingredients);
// console.log('Day 15, part 2:');
// createRecipeWith500Calories(day15_ingredients);

// console.log('Day 16, part 1:');
// findAunt(day16_aunts);
// console.log('Day 16, part 2:');
// findAunt2(day16_aunts);

// console.log('Day 17, part 1 & 2:');
// findCombinations(day17_containers, 150);

// console.log('Day 18, part 1:');
// playLightAnimation(day18_lights);
// console.log('Day 18, part 2:');
// playLightAnimation(day18_lights, true);

// console.log('Day 19, part 1:');
// findDistinctMolecules(day19_replacements, day19_medicine);
