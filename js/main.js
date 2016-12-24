'use strict';

$(function () {
  // solve quadratic formula when form is submitted
  $("#eqn").submit(function () {
    try {
      var a = $("#eqn_a").val();
      var b = $("#eqn_b").val();
      var c = $("#eqn_c").val();
      if (a === "") a = 1;
      if (b === "") b = 1;
      if (c === "") c = 0;
      a = +a, b = +b, c = +c;
      var resultMath = solveQuadraticFormula(a, b, c);
      console.log(resultMath);

      var resultElem = MathJax.Hub.getAllJax("result")[0];
      MathJax.Hub.Queue(["Text", resultElem, "x = " + resultMath]);
    } catch (e) {
      console.error(e);
    }

    return false;
  })
});

//
// Solves quadratic formula with 3 params (ax^2 + bx + c = 0)
// and returns mathjax format string.
//
// Quadratic Formula:
//
//     -b ± √(b^2 - 4ac)
//     -----------------
//            2a
//
function solveQuadraticFormula(a, b, c, debug) {
  if (a === 0) {
    return solveLinearEquation(b, c);
  }
  var D = discriminant(a, b, c);
  var hasImaginaryPart = false;
  if (D < 0) {
    hasImaginaryPart = true;
    D *= -1;
  }
  var left   = -b;
  var right  = getSqrt(D);
  var bottom = 2 * a;

  var gcd = getGCD3(bottom, left, right[0]);
  if (gcd !== 1 && gcd !== 0) {
    bottom /= gcd;
    left /= gcd;
    right[0] /= gcd;
  }

  if (debug) console.log(bottom, left, right, hasImaginaryPart);

  var mathFormat = "";

  // If it has no square root and no imaginary part,
  if (right[1] === 1 && !hasImaginaryPart) {
    var ans1 = rationalize(left + right[0], bottom);
    var ans2 = rationalize(left - right[0], bottom);
    var ans1Flag = (ans1[0] == -1) ? "-" : "";
    var ans2Flag = (ans2[0] == -1) ? "-" : "";

    var ans1Format = "";
    var ans2Format = "";
    if (ans1[2] === 1) {
      ans1Format += ans1Flag + ans1[1];
    } else {
      ans1Format += ans1Flag + "\\frac{" + ans1[1] + "}{" + ans1[2] + "}";
    }
    if (ans2[2] === 1) {
      ans2Format += ans2Flag + ans2[1];
    } else {
      ans2Format += ans2Flag + "\\frac{" + ans2[1] + "}{" + ans2[2] + "}";
    }
    // If double root,
    if (ans1Format === ans2Format) {
      mathFormat += ans1Format;
    } else {
      mathFormat += ans1Format + ", " + ans2Format;
    }
    return mathFormat;
  }

  // If it has a square root or an imaginary part,
  var numerator = "";

  if (left !== 0) {
    numerator += left + " ";
  }
  if (right[0] !== 0) {
    numerator += "\\pm ";
  }
  if (right[0] !== 1) {
    numerator += right[0] + " ";
  }
  if (right[1] !== 1) {
    numerator += "\\sqrt{" + right[1] + "} ";
  }
  if (hasImaginaryPart) {
    numerator += "i";
  }
  numerator = numerator.trim();

  if (bottom === 1) {
    mathFormat = numerator;
  } else {
    mathFormat = "\\frac{" + numerator + "}{" + bottom + "}";
  }

  return mathFormat;
}

//
// Discriminant D = b^2 - 4ac
//
function discriminant(a, b, c) {
  return b * b - 4 * a * c;
}

//
// Solves linear equation and returns mathjax format string.
//
//     ax + b = 0
//     x = -b/a
//
function solveLinearEquation(a, b) {
  if (a === 0) return "\\mathrm{N/A}";
  var mathFormat = "";
  var ans = rationalize(-b, a);
  var ansFlag = (ans[0] == -1) ? "-" : "";
  if (ans[2] === 1) {
    mathFormat += ansFlag + ans[1];
  } else {
    mathFormat += ansFlag + "\\frac{" + ans[1] + "}{" + ans[2] + "}";
  }

  return mathFormat;
}

//
// Get optimized sqrt result.
//
//     >>> getSqrt(9)
//     [3, 1]            // <-- which means 3√1
//     >>> getSqrt(12)
//     [2, 3]            // <-- which means 2√3
//
function getSqrt(number) {
  if (number === 0) return [0, 1];

  var factors = getFactors(number);
  if (factors.length === 0) return [1, number];

  var sqrtOutside = 1;
  var sqrtInside = 1;

  var prevElem = null;
  for (var i = 0; i < factors.length; i++) {
    // console.log(prevElem, factors[i]);
    if (factors[i] === prevElem) {
      sqrtOutside *= factors[i];
      prevElem = null;
    } else {
      sqrtInside *= prevElem || 1;
      prevElem = factors[i];
    }
  }
  if (prevElem) sqrtInside *= prevElem;

  return [sqrtOutside, sqrtInside];
}

//
// Returns prime factors of the given number.
//
//     >>> getFactors(12)
//     [2, 2, 3]
//     >>> getFactors(2*3*3*3*5*7*7)
//     [2, 3, 3, 3, 5, 7, 7]
//
function getFactors(number) {
  var factors = [];

  if (number === 0) return [];
  if (number <= 1 && number >= -1) return [number];
  if (number < 0) {
    factors.push(-1);
    number *= -1;
  }

  var a = 2;
  while (number >= a*a) {
    if (number % a === 0) {
      factors.push(a);
      number /= a;
    } else {
      a++;
    }
  }
  if (number > 1) {
    factors.push(number);
  }

  return factors;
}

//
// greatest common divisor (GCD) of 2 integer
//
//     >>> getGCD(12, 18)
//     6
//
function getGCD(x, y) {
  if (y == 0) return x;
  else return getGCD(y, x % y);
}

//
// greatest common divisor (GCD) of 3 integer
//
//     >>> getGCD3(12, 18, 9)
//     3
//
function getGCD3(x, y, z) {
  return getGCD(getGCD(x, y), getGCD(x, z));
}

//
// Rationalize a/b
//
//     >>> rationalize(9, 6)
//     [1, 3, 2]             // <-- which means 3/2
//     >>> rationalize(2, -3)
//     [-1, 2, 3]            // <-- which means -2/3
//
function rationalize(a, b) {
  var flag = 1;
  if (a < 0) {
    a *= -1;
    flag *= -1;
  }
  if (b < 0) {
    b *= -1;
    flag *= -1;
  }
  var gcd = getGCD(a, b);
  return [flag, a / gcd, b / gcd];
}
