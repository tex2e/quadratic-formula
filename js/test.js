'use strict';

if (location.hostname === "") {
  QUnit.test("integer", function (assert) {
    assert.equal(solveQuadraticFormula(1, 3, -18), "3, -6");
    assert.equal(solveQuadraticFormula(1, 0, -64), "8, -8");
  });

  QUnit.test("double", function (assert) {
    assert.equal(solveQuadraticFormula(1, -8, 16), "4");
    assert.equal(solveQuadraticFormula(9, 12, 4), "-\\frac{2}{3}");
  });

  QUnit.test("fraction", function (assert) {
    assert.equal(solveQuadraticFormula(6, -1, -2), "\\frac{2}{3}, -\\frac{1}{2}");
    assert.equal(solveQuadraticFormula(7, 24, 9), "-\\frac{3}{7}, -3");
  });

  QUnit.test("root", function (assert) {
    assert.equal(solveQuadraticFormula(2, 3, -4), "\\frac{-3 \\pm \\sqrt{41}}{4}");
  });

  QUnit.test("imaginary", function (assert) {
    assert.equal(solveQuadraticFormula(2, -3, 5), "\\frac{3 \\pm \\sqrt{31} i}{4}");
    assert.equal(solveQuadraticFormula(1, 0, 16), "\\pm 4 i");
    assert.equal(solveQuadraticFormula(4, -4, 5), "\\frac{1 \\pm 2 i}{2}");
  });
}
