//Function taken from https://stackoverflow.com/a/57432813

const permutations = a => a.length ? a.reduce((r, v, i) => [ ...r, ...permutations([ ...a.slice(0, i), ...a.slice(i + 1) ]).map(x => [ v, ...x ])], []) : [[]]

module.exports = permutations;
