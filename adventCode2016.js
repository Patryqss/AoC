const fs = require("fs");
const MD5 = require("./md5");

//Day 1
const day1_navs = fs.readFileSync('./2016/day1.txt', 'utf-8').split(', ');

function countBlocksAway(navs) {
  const dirs = ['N', 'E', 'S', 'W', 'N'];
  let currentDir = 'N';
  const currentPosition = [0, 0];
  navs.forEach(nav => {
    const turn = nav.substring(0, 1);
    const value = Number(nav.substring(1));
    if (turn === "R") {
      currentDir = dirs[dirs.indexOf(currentDir) + 1];
    } else {
      currentDir = dirs[dirs.lastIndexOf(currentDir) - 1];
    }

    if (currentDir === "N") {
      currentPosition[1] -= value;
    } else if (currentDir === "E") {
      currentPosition[0] += value;
    } else if (currentDir === "S") {
      currentPosition[1] += value;
    } else {
      currentPosition[0] -= value;
    }
  });

  console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
}

function countBlocksAwayFromDuplicate(navs) {
  const dirs = ['N', 'E', 'S', 'W', 'N'];
  let currentDir = 'N';
  const currentPosition = [0, 0];
  const pastPositions = ['0x0'];
  for (let nav of navs) {
    const turn = nav.substring(0, 1);
    const value = Number(nav.substring(1));
    if (turn === "R") {
      currentDir = dirs[dirs.indexOf(currentDir) + 1];
    } else {
      currentDir = dirs[dirs.lastIndexOf(currentDir) - 1];
    }

    if (currentDir === "N") {
      for (let i = 0; i < value; i++) {
        currentPosition[1] -= 1
        const newPos = currentPosition[0] + 'x' + currentPosition[1];
        if (pastPositions.includes(newPos)) {
          console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
          return;
        } else {
          pastPositions.push(newPos);
        }
      }
    } else if (currentDir === "E") {
      for (let i = 0; i < value; i++) {
        currentPosition[0] += 1
        const newPos = currentPosition[0] + 'x' + currentPosition[1];
        if (pastPositions.includes(newPos)) {
          console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
          return;
        } else {
          pastPositions.push(newPos);
        }
      }
    } else if (currentDir === "S") {
      for (let i = 0; i < value; i++) {
        currentPosition[1] += 1
        const newPos = currentPosition[0] + 'x' + currentPosition[1];
        if (pastPositions.includes(newPos)) {
          console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
          return;
        } else {
          pastPositions.push(newPos);
        }
      }
    } else {
      for (let i = 0; i < value; i++) {
        currentPosition[0] -= 1
        const newPos = currentPosition[0] + 'x' + currentPosition[1];
        if (pastPositions.includes(newPos)) {
          console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
          return;
        } else {
          pastPositions.push(newPos);
        }
      }
    }
  };
  console.log(Math.abs(currentPosition[0]) + Math.abs(currentPosition[1]));
}

//Day 2
const day2_navs = fs.readFileSync('./2016/day2.txt', 'utf-8').split('\n');

function getBathroomCode(navs) {
  const code = [];
  let currentNumber;
  navs.forEach(nav => {
    currentNumber = 5;
    const dirs = nav.split('');
    dirs.forEach(dir => {
      if (dir === "U" && currentNumber > 3) currentNumber -= 3;
      if (dir === "D" && currentNumber < 7) currentNumber += 3;
      if (dir === "L" && currentNumber % 3 !== 1) currentNumber -= 1;
      if (dir === "R" && currentNumber % 3 !== 0) currentNumber += 1;
    });
    code.push(currentNumber);
  })
  console.log(code.join(''));
}

function getBathroomCodeFromShittyPanel(navs) {
  const buttons = {
    1: { D: 3 },
    2: { R: 3, D: 6 },
    3: { U: 1, R: 4, D: 7, L: 2 },
    4: { D: 8, L: 3 },
    5: { R: 6 },
    6: { U: 2, R: 7, D: "A", L: 5 },
    7: { U: 3, R: 8, D: "B", L: 6 },
    8: { U: 4, R: 9, D: "C", L: 7 },
    9: { L: 8 },
    A: { U: 6, R: "B" },
    B: { U: 7, R: "C", D: "D", L: "A" },
    C: { U: 8, L: "B" },
    D: { U: "B" }
  };
  const code = [];
  let currentNumber;
  navs.forEach(nav => {
    currentNumber = 5;
    const dirs = nav.split('');
    dirs.forEach(dir => {
      if (buttons[currentNumber][dir]) currentNumber = buttons[currentNumber][dir];
    });
    code.push(currentNumber);
  })
  console.log(code.join(''));
}

//Day 3
const day3_triangles = fs.readFileSync('./2016/day3.txt', 'utf-8');

function countTriangles(possibleTriangles) {
  let count = 0;
  possibleTriangles.forEach(t => {
    const sides = t.split(" ").map(s => Number(s)).sort((a, b) => a - b);
    if (sides[0] + sides[1] > sides[2]) count++;
  })
  console.log(count);
}

function countTrianglesByColumn(numberList) {
  let count = 0;
  const numbers = numberList.split(" ");
  for (let i = 6; i < numbers.length; i += 9) {
    const sides = [numbers[i], numbers[i - 3], numbers[i - 6]].map(s => Number(s)).sort((a, b) => a - b);
    if (sides[0] + sides[1] > sides[2]) count++;
  }
  for (let i = 7; i < numbers.length; i += 9) {
    const sides = [numbers[i], numbers[i - 3], numbers[i - 6]].map(s => Number(s)).sort((a, b) => a - b);
    if (sides[0] + sides[1] > sides[2]) count++;
  }
  for (let i = 8; i < numbers.length; i += 9) {
    const sides = [numbers[i], numbers[i - 3], numbers[i - 6]].map(s => Number(s)).sort((a, b) => a - b);
    if (sides[0] + sides[1] > sides[2]) count++;
  }
  console.log(count);
}

//Day 4
const day4_rooms = fs.readFileSync('./2016/day4.txt', 'utf-8').split('\n');

function countRealRooms(rooms) {
  let IdsSum = 0;
  rooms.forEach(room => {
    const name = room.substring(0, room.split('').lastIndexOf('-'));
    const secondPart = room.substring(room.split('').lastIndexOf('-') + 1);
    const roomID = Number(secondPart.substring(0, secondPart.indexOf('[')));
    const roomChecksum = secondPart.substring(secondPart.indexOf('[') + 1, secondPart.indexOf(']'));
    const nameByLetter = name.split('');
    const letters = {};

    nameByLetter.forEach(letter => {
      if (letter !== "-") {
        if (!letters[letter]) letters[letter] = 1;
        else letters[letter] += 1;
      }
    })
    const checksum = [];
    for (let i = 0; i < 5; i++) {
      const biggestNumber = Math.max(...Object.values(letters));
      const letter = Object.keys(letters).sort().find(l => letters[l] === biggestNumber)
      checksum.push(letter);
      delete letters[letter];
    }
    if (checksum.join('') === roomChecksum) {
      IdsSum += roomID;
    }
  })
  console.log(IdsSum);
}

function encryptRooms(rooms) {
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const encryptedRooms = [];
  let foundRoom;
  rooms.forEach(room => {
    const name = room.substring(0, room.split('').lastIndexOf('-'));
    const secondPart = room.substring(room.split('').lastIndexOf('-') + 1);
    const roomID = Number(secondPart.substring(0, secondPart.indexOf('[')));
    const nameByLetter = name.split('');
    const moveBy = roomID % alphabet.length;

    for (let i = 0; i < nameByLetter.length; i++) {
      if (nameByLetter[i] === '-') {
        nameByLetter[i] = " ";
      } else {
        const currentPosition = alphabet.indexOf(nameByLetter[i]);
        const newPosition = (currentPosition + moveBy) % alphabet.length;
        nameByLetter[i] = alphabet[newPosition];
      }
    }
    encryptedRooms.push(nameByLetter.join(''));
    if (nameByLetter.join('').includes('north')) {
      foundRoom = room;
    }
  })

  const NUMBERS_REGEX = /[0-9]+/g;
  console.log(foundRoom.match(NUMBERS_REGEX)[0]);
}

//Day 5
const day5_id = fs.readFileSync('./2016/day5.txt', 'utf-8');

function hackPassword(puzzle) {
  const password = [];
  for (let i = 0; i < 999999999; i++) {
    const hash = MD5(puzzle + i);
    if (hash.substring(0, 5) === '00000') {
      password.push(hash[5])
    }
    if (password.length === 8) {
      break;
    }
  }
  console.log(password.join(''));
}

function hackHarderPasswordWithVisualisation(puzzle) {
  const password = ['_', '_', '_', '_', '_', '_', '_', '_'];
  console.log('*Decrypting password, please wait*')
  for (let i = 0; i < 999999999999999; i++) {
    const hash = MD5(puzzle + i);
    if (hash.substring(0, 5) === '00000') {
      if (Number(hash[5]) !== NaN && password[hash[5]] === '_') {
        password[hash[5]] = hash[6];
        console.log(password.join(''));
      }
    }
    if (password.every(letter => letter !== "_")) {
      break;
    }
  }
  return password.join('');
}

//Day 6
const day6_message = fs.readFileSync('./2016/day6.txt', 'utf-8').split('\n');

function findRepetitions(words) {
  const letters = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} };
  const messageFromMostCommon = [];
  const messageFromLeastCommon = [];
  words.forEach(word => {
    for (let i = 0; i < word.length; i++) {
      if (!letters[i][word[i]]) letters[i][word[i]] = 1;
      else letters[i][word[i]] += 1;
    }
  })

  for (let i = 0; i < 8; i++) {
    const biggestNumber = Math.max(...Object.values(letters[i]));
    const letterB = Object.keys(letters[i]).sort().find(l => letters[i][l] === biggestNumber)
    messageFromMostCommon.push(letterB);

    const smallestNumber = Math.min(...Object.values(letters[i]));
    const letterS = Object.keys(letters[i]).sort().find(l => letters[i][l] === smallestNumber)
    messageFromLeastCommon.push(letterS);
  }
  console.log(messageFromMostCommon.join(''));
  console.log(messageFromLeastCommon.join(''));
}

//Day 7
const day7_ips = fs.readFileSync('./2016/day7.txt', 'utf-8').split('\n');

function isAbba(str) {
  const splitted = str.split('');
  let fours = splitted.map((letter, id) => {
    if (id + 3 >= splitted.length) return null;
    return [letter, splitted[id + 1], splitted[id + 2], splitted[id + 3]];
  })
  fours.pop();
  fours.pop();
  fours.pop();
  fours = fours.filter(f => f[0] !== f[1]);
  return fours.some(f => f.join('') === f.reverse().join(''));
}

function countIPv7sWithTLS(ips) {
  let count = 0;
  ips.forEach(a => {
    let currentWord = '';
    let isBracket = false;
    let foundInNormal = false;
    let foundInBrackets = false
    for (let i = 0; i < a.length; i++) {
      if (!isBracket) {
        if (a[i] !== '[') {
          currentWord += a[i];
          if (i === a.length - 1 && isAbba(currentWord)) foundInNormal = true;
        } else {
          if (isAbba(currentWord)) {
            foundInNormal = true;
          }
          currentWord = '';
          isBracket = true;
        }
      } else {
        if (a[i] !== ']') {
          currentWord += a[i];
        } else {
          if (isAbba(currentWord)) {
            foundInBrackets = true;
          }
          currentWord = '';
          isBracket = false;
        }
      }
    }

    if (foundInNormal && !foundInBrackets) count++
  })
  console.log(count);
}

function isAbABaBPair(first, second) {
  const splitFirst = first.split('');
  let threes = splitFirst.map((letter, id) => {
    if (id + 2 >= splitFirst.length) return null;
    return [letter, splitFirst[id + 1], splitFirst[id + 2]];
  })
  threes.pop();
  threes.pop();
  threes = threes.filter(t => t[0] !== t[1]).filter(t => t.join('') == t.reverse().join(''));

  const splitSecond = second.split('');
  let newThrees = splitSecond.map((letter, id) => {
    if (id + 2 >= splitSecond.length) return null;
    return [letter, splitSecond[id + 1], splitSecond[id + 2]];
  })
  newThrees.pop();
  newThrees.pop();
  newThrees = newThrees.filter(t => t[0] !== t[1]).filter(t => t.join('') == t.reverse().join(''));

  return threes.some(t => {
    return newThrees.some(nt => t[0] === nt[1] && t[1] === nt[0])
  })
}

function countIPv7sWithSSL(ips) {
  let count = 0;
  ips.forEach(ip => {
    let currentWord = '';
    let isBracket = false;
    const normals = [];
    const brackets = [];

    for (let i = 0; i < ip.length; i++) {
      if (!isBracket) {
        if (ip[i] !== '[') {
          currentWord += ip[i];
          if (i === ip.length - 1) normals.push(currentWord);
        } else {
          normals.push(currentWord);
          currentWord = '';
          isBracket = true;
        }
      } else {
        if (ip[i] !== ']') {
          currentWord += ip[i];
        } else {
          brackets.push(currentWord);
          currentWord = '';
          isBracket = false;
        }
      }
    }

    const shouldCount = normals.some(n => {
      return brackets.some(b => isAbABaBPair(n, b))
    })
    if (shouldCount) count++
  });
  console.log(count);
}

//Day 8
const day8_instructions = fs.readFileSync('./2016/day8.txt', 'utf-8').split('\n');

function get2faFromScreen(instructions) {
  const screenSize = [50, 6]
  const screen = Array(screenSize[1]).fill('.').map(() => Array(screenSize[0]).fill('.'));
  for (let i = 0; i < screenSize[1]; i++) {
    for (let j = 0; j < screenSize[0]; j++) {
      screen[i][j] = '.';
    }
  }
  instructions.forEach(i => {
    if (i.includes('rect')) {
      const xIndex = i.indexOf('x');
      const width = Number(i.substring(5, xIndex));
      const height = Number(i.substring(xIndex + 1));
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          screen[i][j] = '#';
        }
      }
    } else if (i.includes('row y')) {
      const byIndex = i.indexOf('b');
      const row = Number(i.substring(13, byIndex - 1));
      const value = Number(i.substring(byIndex + 3));
      const oldRow = [...screen[row]];
      for (let j = 0; j < screenSize[0]; j++) {
        const takeFrom = j - value;
        screen[row][j] = takeFrom < 0 ? oldRow[screenSize[0] + takeFrom] : oldRow[takeFrom];
      }
    } else {
      const byIndex = i.indexOf('b');
      const column = Number(i.substring(16, byIndex - 1));
      const value = Number(i.substring(byIndex + 3));
      const oldColumn = [];
      for (let i = 0; i < screenSize[1]; i++) {
        oldColumn.push(screen[i][column])
      }
      for (let i = 0; i < screenSize[1]; i++) {
        const takeFrom = i - value;
        screen[i][column] = takeFrom < 0 ? oldColumn[screenSize[1] + takeFrom] : oldColumn[takeFrom];
      }
    }
  })

  let count = 0;
  for (let i = 0; i < screenSize[1]; i++) {
    for (let j = 0; j < screenSize[0]; j++) {
      if (screen[i][j] === '#') count++
    }
  }
  console.log(count);
  console.log('Hashes create letters. You\'ll need a wide console to see this message. Try to fit "[content]" in exactly one line')
  console.log(JSON.stringify(screen).substring(1));
}

//Day 9
const day9_string = fs.readFileSync('./2016/day9.txt', 'utf-8');

function decompressString(str) {
  let nextPositionToCheck = 0;
  let decompressed = '';
  for (let i = 0; i < str.length; i++) {
    if (i === nextPositionToCheck) {
      if (str[i] !== "(") {
        decompressed += str[i];
        nextPositionToCheck++;
      } else {
        let xPosition, closePosition;
        for (let j = i; j < str.length; j++) {
          if (str[j] === 'x') xPosition = j;
          if (str[j] === ')') closePosition = j;
          if (xPosition && closePosition) break;
        }
        const lettersCount = Number(str.substring(i + 1, xPosition));
        const repeat = Number(str.substring(xPosition + 1, closePosition));
        let lettersToAdd = '';
        for (let x = 1; x <= lettersCount; x++) {
          lettersToAdd += str[closePosition + x]
        }
        for (let x = 0; x < repeat; x++) {
          decompressed += lettersToAdd;
        }
        nextPositionToCheck = closePosition + lettersCount + 1;
      }
    }
  }

  console.log(decompressed.length);
}

function fullDecompress(str) {
  //works but decompressString should return string and input is too big (over 56M chars) xD
  let decompressed = str;
  while (decompressed.includes('(')) {
    decompressed = decompressString(decompressed);
  }
  return decompressed.length;
}

//Not very effective and takes long time to calculate but at least works ;_;
function decompressString2(str) {
  let decompressed = '';
  let restFrom;
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== "(") {
      decompressed += str[i];
    } else {
      let xPosition, closePosition;
      for (let j = i; j < str.length; j++) {
        if (str[j] === 'x') xPosition = j;
        if (str[j] === ')') closePosition = j;
        if (xPosition && closePosition) break;
      }
      const lettersCount = Number(str.substring(i + 1, xPosition));
      const repeat = Number(str.substring(xPosition + 1, closePosition));
      let lettersToAdd = '';
      for (let x = 1; x <= lettersCount; x++) {
        lettersToAdd += str[closePosition + x]
      }
      for (let x = 0; x < repeat; x++) {
        decompressed += lettersToAdd;
      }
      restFrom = closePosition + lettersCount;
      break;
    }
  }
  const newStr = decompressed + str.substring(restFrom + 1)
  const from = newStr.indexOf('(');
  if (from === -1) {
    return {
      decLength: newStr.length,
      rest: ''
    }
  }
  return {
    decLength: newStr.substring(0, from).length,
    rest: newStr.substring(from)
  }
}

function fullDecompress2(str) {
  let count = 0;
  let decompressed = str;
  while (decompressed.includes('(')) {
    const {
      decLength,
      rest
    } = decompressString2(decompressed);
    count += decLength;
    decompressed = rest;
  }
  console.log(count);
}

//Day 10
const day10_instructions = fs.readFileSync('./2016/day10.txt', 'utf-8').split('\n');

function scanBots(instructions) {
  const NUMBERS_REGEX = /[0-9]+/g;
  const bots = {};
  const outputs = {};
  let botFound = null;
  let finishedInstructions = 0;
  instructions.forEach(inst => {
    if (inst.includes('goes to bot')) {
      const values = inst.match(NUMBERS_REGEX);
      bots[values[1]] ? bots[values[1]].push(Number(values[0])) : bots[values[1]] = [Number(values[0])];
      finishedInstructions++;
    }
  })

  while (finishedInstructions < instructions.length) {
    instructions.forEach(inst => {
      if (!inst.includes('goes to bot')) {
        const values = inst.match(NUMBERS_REGEX);
        if (bots[values[0]] && bots[values[0]].length === 2) {
          const lowToGive = Math.min(...bots[values[0]]);
          const highToGive = Math.max(...bots[values[0]]);
          if (lowToGive === 17 && highToGive === 61) {
            botFound = values[0];
          }
          if (inst.includes('low to bot')) {
            bots[values[1]] ? bots[values[1]].push(lowToGive) : bots[values[1]] = [lowToGive];
          } else {
            outputs[values[1]] ? outputs[values[1]].push(lowToGive) : outputs[values[1]] = [lowToGive];
          }
          if (inst.includes('high to bot')) {
            bots[values[2]] ? bots[values[2]].push(highToGive) : bots[values[2]] = [highToGive];
          } else {
            outputs[values[2]] ? outputs[values[2]].push(highToGive) : outputs[values[2]] = [highToGive];
          }
          bots[values[0]] = [];
          finishedInstructions++;
        }
      }
    })
  }
  console.log(botFound);
  console.log(outputs[0][0] * outputs[1][0] * outputs[2][0]);
}

//Day 11
const day11_floors = fs.readFileSync('./2016/day11.txt', 'utf-8').split('\n');

//No idea how to code this, so I only made a function for visualisation of floors
//and then solved this puzzle manually: https://i.imgur.com/SQaQmEG.jpg
function visualiseBuilding(floorsData) {
  const TEXT_REGEX = /[a-z]+/g;
  const objects = [];
  floorsData.forEach((f, id) => {
    const words = f.match(TEXT_REGEX);
    while (words.includes('microchip')) {
      const i = words.indexOf('microchip');
      const obj = (words[i-2][0] + words[i-2][1] +  words[i][0]).toUpperCase();
      objects.push({ name: obj, floor: id + 1 });
      words.splice(i - 2, 3);
    }
    while (words.includes('generator')) {
      const i = words.indexOf('generator');
      const obj = (words[i-1][0] + words[i-1][1] +  words[i][0]).toUpperCase();
      objects.push({ name: obj, floor: id + 1 });
      words.splice(i - 1, 2);
    }
  })

  const building = [
    ['F4', '.'],
    ['F3', '.'],
    ['F2', '.'],
    ['F1', 'E']
  ];
  objects.forEach(obj => {
    for (let i = 0; i < building.length; i++) {
      if (i === building.length - obj.floor) {
        building[i].push(obj.name);
      } else {
        building[i].push('...');
      }
    }
  })
  console.log(building)
}

//Day 12
const day12_instructions = fs.readFileSync('./2016/day12.txt', 'utf-8').split('\n');

function decodeRegisters(instructions, cValue) {
  const registers = { a: 0, b: 0, c: cValue, d: 0 };
  let pointer = 0;

  while (pointer < instructions.length) {
    const inst = instructions[pointer].split(' ');
    if (inst[0] === 'cpy') {
      if (isNaN(inst[1])) {
        registers[inst[2]] = registers[inst[1]];
      } else {
        registers[inst[2]] = Number(inst[1]);
      }
      pointer++;
    } else if (inst[0] === 'inc') {
      registers[inst[1]]++;
      pointer++;
    } else if (inst[0] === 'dec') {
      registers[inst[1]]--;
      pointer++;
    } else {
      if (isNaN(inst[1])) {
        if (registers[inst[1]] !== 0) {
          pointer += Number(inst[2]);
        } else {
          pointer++;
        }
      } else {
        if (Number(inst[1] !== 0)) {
          pointer += Number(inst[2]);
        } else {
          pointer++;
        }
      }
    }
  }

  console.log(registers.a)
}

//Day 13
const day13_number = Number(fs.readFileSync('./2016/day13.txt', 'utf-8'));
const Graph = require('node-dijkstra');

function generateRoutesInMaze(size, favNumber) {
  const maze = Array(size).fill('.').map(() => Array(size).fill('.'));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const base = x*x + 3*x + 2*x*y + y + y*y + favNumber;
      const convertedBase = base.toString(2).split('').filter(n => n === '1').length;
      if (convertedBase % 2 === 0) {
        maze[y][x] = '.'
      } else {
        maze[y][x] = '#'
      }
    }
  }

  const route = new Graph();
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze.length; x++) {
      const from = `${x},${y}`;
      const to = new Map();
      if (maze[y-1]) to.set(`${x},${y-1}`, maze[y-1][x] === '.' ? 1 : 999999);
      if (maze[x-1]) to.set(`${x-1},${y}`, maze[y][x-1] === '.' ? 1 : 999999);
      if (maze[x+1]) to.set(`${x+1},${y}`, maze[y][x+1] === '.' ? 1 : 999999);
      if (maze[y+1]) to.set(`${x},${y+1}`, maze[y+1][x] === '.' ? 1 : 999999);

      route.addNode(from, to);
    }
  }
  return { route, maze };
}

function findWayInMaze(routes, destination) {
  console.log(routes.path("1,1", destination, { cost: true }).cost);
}

function countReachableLocations(routes, maze) {
  let reachable = 0;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze.length; x++) {
      if (routes.path('1,1', `${x},${y}`, { cost: true }).cost <= 50) reachable++;
    }
  }
  console.log(reachable);
}

//Day 14
const day14_salt = fs.readFileSync('./2016/day14.txt', 'utf-8');

function generateNewKeys(salt, hashComplexity) {
  const TRIPLES_REGEX = /(.)\1{2,}/;
  const FIVE_DUPS_REGEX = /(.)\1{4,}/g;
  const hashes = [];
  const possibleKeys = [];
  const keys = [];
  let i = 0;

  while (keys.length < 64) {
    let hash = MD5(salt + i);
    for (let i = 0; i < hashComplexity; i++) {
      hash = MD5(hash);
    }
    hashes.push(hash);
    if (hash.match(TRIPLES_REGEX)) possibleKeys.push({hash, match: hash.match(TRIPLES_REGEX)[1], position: i});

    if (possibleKeys.length > 0 && i === possibleKeys[0].position + 1000) {
      if (hashes.slice(possibleKeys[0].position + 1).some(h => h.match(FIVE_DUPS_REGEX) && h.match(FIVE_DUPS_REGEX).map(x => x[0]).includes(possibleKeys[0].match))) {
        keys.push(possibleKeys[0].position);
      }
      possibleKeys.shift();
    }
    i++;
  }

  console.log(keys[63]);
}

//Day 15
const day15_discs = fs.readFileSync('./2016/day15.txt', 'utf-8').split('\n');

function fallThroughDiscs(discs) {
  const NUMBER_REGEX = /[0-9]+/g;
  const setupDiscs = [];
  discs.forEach(d => {
    const discData = d.match(NUMBER_REGEX).map(Number);
    setupDiscs.push({
      id: discData[0],
      startAt: discData[3],
      positions: discData[1],
    })
  });
  let timeToPress;
  for (let i = 0; !timeToPress; i++) {
    if (setupDiscs.every(disc => (disc.startAt + i + disc.id) % disc.positions === 0)) {
      timeToPress = i;
    }
  }
  console.log(timeToPress);
}

//Day 16
const day16_init_state = fs.readFileSync('./2016/day16.txt', 'utf-8');

function checkPairs(data) {
  let result = '';
  for (let i = 0; i < data.length; i += 2) {
    if (data[i] === data[i + 1]) result += '1';
    else result += '0';
  }
  return result;
}

function generateChecksum(init_state, disk_length) {
  let dataToFill = init_state.toString();
  while (dataToFill.length < disk_length) {
    const b = dataToFill.split('').reverse().map(n => n === '0' ? '1' : '0').join('');
    dataToFill = dataToFill + '0' + b;
  }
  dataToFill = dataToFill.substring(0, disk_length);
  let checksum = checkPairs(dataToFill);
  while (checksum.length % 2 !== 1) {
    checksum = checkPairs(checksum);
  }
  console.log(checksum);
}





// -----Answers for solved days-----
// Uncomment proper lines to get them

// console.log('Day 1, part 1:')
// countBlocksAway(day1_navs);
// console.log('Day 1, part 2:')
// countBlocksAwayFromDuplicate(day1_navs);

// console.log('Day 2, part 1:')
// getBathroomCode(day2_navs);
// console.log('Day 2, part 2:')
// getBathroomCodeFromShittyPanel(day2_navs);

// console.log('Day 3, part 1:')
// countTriangles(day3_triangles.split('\n').map(t => t.replace(/\s+/g,' ').trim()));
// console.log('Day 3, part 2:')
// countTrianglesByColumn(day3_triangles.replace(/\s+/g,' ').trim());

// console.log('Day 4, part 1:')
// countRealRooms(day4_rooms);
// console.log('Day 4, part 2:')
// encryptRooms(day4_rooms);

// console.log('Day 5, part 1:')
// hackPassword(day5_id)
// console.log('Day 5, part 2:')
// hackHarderPasswordWithVisualisation(day5_id)

// console.log('Day 6, part 1 & 2:')
// findRepetitions(day6_message)

// console.log('Day 7, part 1:')
// countIPv7sWithTLS(day7_ips)
// console.log('Day 7, part 2:')
// countIPv7sWithSSL(day7_ips)

// console.log('Day 8, part 1 & 2:')
// get2faFromScreen(day8_instructions)

// console.log('Day 9, part 1:')
// decompressString(day9_string);
// console.log('Day 9, part 2 (this will take a few minutes):')
// fullDecompress2(day9_string);

// console.log('Day 10, part 1 & 2:')
// scanBots(day10_instructions)

// console.log('Day 11, part 1:')
// visualiseBuilding(day11_floors);
// console.log(31);
// console.log('Day 11, part 2:')
// console.log(55);

// console.log('Day 12, part 1:')
// decodeRegisters(day12_instructions, 0)
// console.log('Day 12, part 1:')
// decodeRegisters(day12_instructions, 1)

// console.log('Day 13, part 1:');
// const { route, maze } = generateRoutesInMaze(45, day13_number);
// findWayInMaze(route, '31,39');
// console.log('Day 13, part 2 (this will take a while):');
// countReachableLocations(route, maze);

// console.log('Day 14, part 1:');
// generateNewKeys(day14_salt, 0);
// console.log('Day 14, part 2 (this will take a while):');
// generateNewKeys(day14_salt, 2016);

// console.log('Day 15, part 1:');
// fallThroughDiscs(day15_discs)
// console.log('Day 15, part 2:');
// fallThroughDiscs([...day15_discs, 'DISC #7 has 11 positions; at time=0, it is at position 0'])

// console.log('Day 16, part 1:');
// generateChecksum(day16_init_state, 272);
// console.log('Day 16, part 2:');
// generateChecksum(day16_init_state, 35651584);
