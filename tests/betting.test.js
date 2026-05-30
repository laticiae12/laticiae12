import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateCombinedOdds,
  calculatePotentialReturn,
  getRiskLevel,
  getSlipAdvice,
} from '../src/betting.js';

const lowRiskPick = { pick: 'Aces -1.5 sets', odds: 1.74, risk: 'Low' };
const mediumRiskPick = { pick: 'Storm moneyline', odds: 1.92, risk: 'Medium' };
const highRiskPick = { pick: 'Wolves +3.5', odds: 2.48, risk: 'High' };

test('calculateCombinedOdds multiplies decimal odds for selected picks', () => {
  assert.equal(calculateCombinedOdds([lowRiskPick, mediumRiskPick]), 3.34);
});

test('calculatePotentialReturn multiplies stake by combined odds', () => {
  assert.equal(calculatePotentialReturn(25, [mediumRiskPick]), 48);
});

test('getRiskLevel escalates slips with high-risk legs or oversized stakes', () => {
  assert.equal(getRiskLevel([highRiskPick], 25), 'High');
  assert.equal(getRiskLevel([lowRiskPick], 125), 'High');
});

test('getSlipAdvice returns responsible guidance for empty and high-risk slips', () => {
  assert.equal(getSlipAdvice('No picks'), 'Choose a pick to get started.');
  assert.match(getSlipAdvice('High'), /Reduce stake/);
});
