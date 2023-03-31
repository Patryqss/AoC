module.exports = function modularPow(x, power, modulo) {
  if (typeof x === 'number') {
    x = BigInt(x);
    power = BigInt(power);
    modulo = BigInt(modulo)
  }
  return Number(_modularPow(x, power, modulo));
}

function _modularPow(x, power, modulo) {
  if (power === 0n) return 1n;
  if (power % 2n === 1n) {
    return (x * _modularPow((x*x) % modulo, (power - 1n) / 2n, modulo)) % modulo;
  } else {
    return _modularPow((x*x) % modulo, power / 2n, modulo);
  }
}