const periodMultiplier = {
  days: 1,
  months: 365 / 12,
  years: 365,
};

export function getDurationInDays(months: number) {
  return Math.floor(months * periodMultiplier['months']);
}
