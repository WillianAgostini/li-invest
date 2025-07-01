import moment from 'moment';

const periodMultiplier = {
  days: 1,
  months: 365 / 12,
  years: 365,
};

export function getDurationInDays(months: number) {
  return Math.floor(months * periodMultiplier['months']);
}

export function convertToBr(data: string, format: string): string {
  return moment(data, format).format('DD/MM/YYYY');
}
