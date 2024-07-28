function gcd(nums) {
  nums = nums.map(n => n < 0n ? n * -1n : n);
  nums.sort((a, b) => Number(a - b));
  while (nums.length > 1) {
    const t = nums[0];
    nums[0] = nums[1];
    nums[1] = t % nums[1];
    if (nums[1] === 0n) {
      nums.splice(1, 1);
    }
  }
  return nums[0];
};

function lcm(nums) {
  return nums.reduce((a, b) => a * b / gcd([a, b]), 1n);
};

module.exports = class Fraction {
  constructor(num, den) {
    this.numerator = BigInt(num);
    this.denominator = BigInt(den);
  }

  get num() {
    return this.numerator.toString();
  }

  get den() {
    return this.denominator.toString();
  }

  get decimalValue() {
    if (this.denominator === 0n) return Infinity;
    return Number(this.numerator) / Number(this.denominator);
  }

  get copy() {
    return new Fraction(this.numerator, this.denominator);
  }

  toString() {
    return `${this.numerator.toString()}/${this.denominator.toString()}`;
  }

  reduce() {
    if (this.numerator === 0n || this.denominator === 0n) return;

    const val = gcd([this.numerator, this.denominator]);
    this.numerator /= val;
    this.denominator /= val;
    if (this.denominator < 0n) {
      this.numerator *= -1n;
      this.denominator *= -1n;
    }
  }

  reverse() {
    const temp = this.numerator;
    this.numerator = this.denominator;
    this.denominator = temp;
  }

  plus(val, reduce = true) {
    this.numerator += this.denominator * BigInt(val);
    if (reduce) this.reduce();
  }

  plusFraction(fr) {
    const fraction = fr.copy;
    if (fraction.decimalValue === 0) return;
    if (this.decimalValue === 0) {
      this.numerator = fraction.numerator;
      this.denominator = fraction.denominator;
      return;
    }

    const extendTo = lcm([this.denominator, fraction.denominator]);
    if (this.denominator !== extendTo) {
      const mulBy = extendTo / this.denominator;
      this.numerator *= mulBy;
      this.denominator *= mulBy;
    }
    if (fraction.denominator !== extendTo) {
      const mulBy = extendTo / fraction.denominator;
      fraction.numerator *= mulBy;
      fraction.denominator *= mulBy;
    }
    this.numerator += fraction.numerator;
    this.reduce();
  }

  minus(val, reduce = true) {
    this.numerator -= this.denominator * BigInt(val);
    if (reduce) this.reduce();
  }

  minusFraction(fr) {
    const fraction = fr.copy;
    if (fraction.decimalValue === 0) return;
    if (this.decimalValue === 0) {
      this.numerator = fraction.numerator * -1n;
      this.denominator = fraction.denominator;
      return;
    }

    const extendTo = lcm([this.denominator, fraction.denominator]);
    if (this.denominator !== extendTo) {
      const mulBy = extendTo / this.denominator;
      this.numerator *= mulBy;
      this.denominator *= mulBy;
    }
    if (fraction.denominator !== extendTo) {
      const mulBy = extendTo / fraction.denominator;
      fraction.numerator *= mulBy;
      fraction.denominator *= mulBy;
    }
    this.numerator -= fraction.numerator;
    this.reduce();
  }

  mul(val) {
    this.numerator *= BigInt(val);
    this.reduce();
  }

  mulFraction(fraction) {
    this.numerator *= fraction.numerator;
    this.denominator *= fraction.denominator;
    this.reduce();
  }

  divFraction(fraction) {
    const fr = fraction.copy;
    fr.reverse();
    this.mulFraction(fr);
  }

  pow(val) {
    val = BigInt(val);
    if (val >= 0n) {
      this.numerator = this.numerator ** val;
      this.denominator = this.denominator ** val;
    } else {
      val *= -1n;
      this.reverse();
      this.numerator = this.numerator ** val;
      this.denominator = this.denominator ** val;
    }
  }
}
