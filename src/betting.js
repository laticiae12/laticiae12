export const markets = [
  {
    event: 'Storm vs. Rockets',
    league: 'Basketball',
    pick: 'Storm moneyline',
    odds: 1.92,
    modelConfidence: 68,
    tag: 'Positive edge',
    risk: 'Medium',
  },
  {
    event: 'United vs. City',
    league: 'Soccer',
    pick: 'Under 2.5 goals',
    odds: 2.14,
    modelConfidence: 61,
    tag: 'Line moved',
    risk: 'Medium',
  },
  {
    event: 'Aces vs. Sparks',
    league: 'Tennis',
    pick: 'Aces -1.5 sets',
    odds: 1.74,
    modelConfidence: 73,
    tag: 'Lower variance',
    risk: 'Low',
  },
  {
    event: 'Hawks vs. Wolves',
    league: 'Football',
    pick: 'Wolves +3.5',
    odds: 2.48,
    modelConfidence: 54,
    tag: 'High payout',
    risk: 'High',
  },
];

export function calculateCombinedOdds(picks) {
  if (!Array.isArray(picks) || picks.length === 0) {
    return 0;
  }

  return Number(picks.reduce((total, pick) => total * pick.odds, 1).toFixed(2));
}

export function calculatePotentialReturn(stake, picks) {
  const numericStake = Number(stake);
  if (!Number.isFinite(numericStake) || numericStake <= 0) {
    return 0;
  }

  return Number((numericStake * calculateCombinedOdds(picks)).toFixed(2));
}

export function getRiskLevel(picks, stake) {
  if (!Array.isArray(picks) || picks.length === 0) {
    return 'No picks';
  }

  const combinedOdds = calculateCombinedOdds(picks);
  const highRiskPick = picks.some((pick) => pick.risk === 'High');
  const numericStake = Number(stake);

  if (highRiskPick || picks.length >= 3 || combinedOdds >= 5 || numericStake > 100) {
    return 'High';
  }

  if (combinedOdds >= 2.5 || picks.some((pick) => pick.risk === 'Medium')) {
    return 'Medium';
  }

  return 'Low';
}

export function getSlipAdvice(riskLevel) {
  const advice = {
    'No picks': 'Choose a pick to get started.',
    Low: 'Looks controlled. Keep your stake within your preset limits.',
    Medium: 'Consider whether the extra payout is worth the additional variance.',
    High: 'High-risk slip. Reduce stake, remove a leg, or take a pause before reviewing.',
  };

  return advice[riskLevel] ?? advice['No picks'];
}
