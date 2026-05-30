import {
  calculateCombinedOdds,
  calculatePotentialReturn,
  getRiskLevel,
  getSlipAdvice,
  markets,
} from './betting.js';

const marketGrid = document.querySelector('#marketGrid');
const selectedPicks = document.querySelector('#selectedPicks');
const stakeInput = document.querySelector('#stake');
const combinedOdds = document.querySelector('#combinedOdds');
const potentialReturn = document.querySelector('#potentialReturn');
const riskLevel = document.querySelector('#riskLevel');
const slipAdvice = document.querySelector('#slipAdvice');

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

let picks = [];

function renderMarkets() {
  marketGrid.innerHTML = markets
    .map(
      (market) => `
      <article class="market-card">
        <div class="card-topline">
          <span>${market.league}</span>
          <span class="risk ${market.risk.toLowerCase()}">${market.risk} risk</span>
        </div>
        <h3>${market.event}</h3>
        <p>${market.pick}</p>
        <div class="market-stat">
          <span>Decimal odds</span>
          <strong>${market.odds.toFixed(2)}</strong>
        </div>
        <div class="market-stat">
          <span>Model confidence</span>
          <strong>${market.modelConfidence}%</strong>
        </div>
        <div class="tag">${market.tag}</div>
        <button class="button secondary full" data-select="${market.pick}" data-odds="${market.odds}">Add to slip</button>
      </article>
    `,
    )
    .join('');
}

function renderSlip() {
  const stake = Number(stakeInput.value);
  const odds = calculateCombinedOdds(picks);
  const returns = calculatePotentialReturn(stake, picks);
  const risk = getRiskLevel(picks, stake);

  selectedPicks.innerHTML = picks.length
    ? picks
        .map(
          (pick, index) => `
          <button class="pick-chip" data-remove="${index}" aria-label="Remove ${pick.pick}">
            ${pick.pick} <span>${pick.odds.toFixed(2)} ×</span>
          </button>
        `,
        )
        .join('')
    : '<p class="empty-slip">No picks selected yet.</p>';

  combinedOdds.textContent = odds ? odds.toFixed(2) : '—';
  potentialReturn.textContent = returns ? formatter.format(returns) : '—';
  riskLevel.textContent = risk;
  riskLevel.dataset.level = risk.toLowerCase().replace(' ', '-');
  slipAdvice.textContent = getSlipAdvice(risk);
}

function addPick(pick, odds) {
  if (picks.some((selected) => selected.pick === pick)) {
    return;
  }

  const market = markets.find((item) => item.pick === pick) ?? { pick, odds: Number(odds), risk: 'Medium' };
  picks = [...picks, market];
  renderSlip();
}

function handleDocumentClick(event) {
  const selectButton = event.target.closest('[data-select]');
  const removeButton = event.target.closest('[data-remove]');

  if (selectButton) {
    addPick(selectButton.dataset.select, selectButton.dataset.odds);
  }

  if (removeButton) {
    picks = picks.filter((_, index) => index !== Number(removeButton.dataset.remove));
    renderSlip();
  }
}

renderMarkets();
renderSlip();
document.addEventListener('click', handleDocumentClick);
stakeInput.addEventListener('input', renderSlip);
