/**
 * Moteur de calcul du simulateur d'investissement (sans dépendance au DOM).
 * Conventions :
 *  - loyers nets et prise de valeur calculés sur le prix du bien ;
 *  - loyers perçus à partir du mois suivant la livraison (stratégie « location » uniquement) ;
 *  - crédit bancaire tiré à la livraison, remboursé par mensualités constantes (taux fixe CREDIT_RATE) ;
 *  - plan de paiement promoteur sans intérêts, mensualités dès le mois suivant la signature ;
 *  - revente en fin de détention : capital restant dû et mensualités restantes soldés ;
 *  - impôt sur la plus-value de CAPITAL_GAINS_TAX si la revente intervient avant 24 mois de détention.
 */

export const CREDIT_RATE = 7; // % annuel — non affiché dans le formulaire
export const CAPITAL_GAINS_TAX = 5; // % — revente avant 24 mois
export const TAX_FREE_AFTER_MONTHS = 24;

export type Financing = 'cash' | 'plan' | 'credit';
export type Strategy = 'rent' | 'resale';

export interface SimInput {
  financing: Financing;
  strategy: Strategy;
  price: number;
  notary: number;
  delivery: number; // mois
  holding: number; // mois
  yieldPct: number;
  apprPct: number;
  planDown: number; // %
  planMonths: number;
  creditDown: number; // %
  creditYears: number;
}

export interface Result {
  down: number;
  monthly: number;
  cashflow: number;
  rents: number;
  repayments: number;
  sale: number;
  tax: number;
  debtLeft: number;
  capital: number;
  gain: number;
  roe: number;
  multiple: number;
  irr: number;
  loan: number;
}

function irr(flows: number[]): number {
  const npv = (r: number) => flows.reduce((s, v, i) => s + v / Math.pow(1 + r, i), 0);
  let lo = -0.99 / 12, hi = 1;
  if (npv(lo) * npv(hi) > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid;
  }
  return Math.pow(1 + (lo + hi) / 2, 12) - 1;
}

export function simulate(x: SimInput): Result {
  const M = Math.max(1, Math.round(x.holding));
  const D = Math.max(0, Math.round(x.delivery));
  const P = x.price;
  const cf = new Array(M + 1).fill(0);

  // Loyers
  const rentM = x.strategy === 'rent' ? (P * x.yieldPct) / 100 / 12 : 0;
  let rents = 0;
  for (let m = D + 1; m <= M; m++) { cf[m] += rentM; rents += rentM; }

  let down = P;
  let monthly = 0;
  let repayments = 0;
  let debtLeft = 0;
  let loan = 0;

  if (x.financing === 'cash') {
    cf[0] -= P + x.notary;
  } else if (x.financing === 'plan') {
    down = P * (x.planDown / 100);
    const n = Math.max(1, Math.round(x.planMonths));
    monthly = (P - down) / n;
    cf[0] -= down + x.notary;
    for (let k = 1; k <= n; k++) { if (k <= M) cf[k] -= monthly; else debtLeft += monthly; }
  } else {
    down = P * (x.creditDown / 100);
    loan = P - down;
    const r = CREDIT_RATE / 100 / 12;
    const n = Math.max(1, Math.round(x.creditYears * 12));
    monthly = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
    cf[0] -= down + x.notary;
    if (M <= D) {
      debtLeft = loan; // revente avant livraison : solde dû au promoteur
    } else {
      let balance = loan;
      for (let m = D + 1; m <= M && m <= D + n; m++) {
        balance -= monthly - balance * r;
        cf[m] -= monthly;
        repayments += monthly;
      }
      debtLeft = Math.max(0, balance);
    }
  }

  // Capital mobilisé = besoin de trésorerie maximal (hors produit de revente)
  let cum = 0, peak = 0;
  for (let m = 0; m <= M; m++) { cum += cf[m]; peak = Math.min(peak, cum); }
  const capital = -peak;

  const sale = P * Math.pow(1 + x.apprPct / 100, M / 12);
  const plusValue = Math.max(0, sale - P - x.notary);
  const tax = M < TAX_FREE_AFTER_MONTHS ? plusValue * (CAPITAL_GAINS_TAX / 100) : 0;
  const flows = cf.slice();
  flows[M] += sale - debtLeft - tax;
  const gain = flows.reduce((s, v) => s + v, 0);

  let cashflow = rentM;
  if (x.financing === 'credit') cashflow -= monthly;
  if (x.financing === 'plan' && x.planMonths > D) cashflow -= monthly;

  return {
    down, monthly, cashflow, rents, repayments, sale, tax, debtLeft, capital, gain, loan,
    roe: capital > 0 ? gain / capital : 0,
    multiple: capital > 0 ? (capital + gain) / capital : 0,
    irr: irr(flows),
  };
}
