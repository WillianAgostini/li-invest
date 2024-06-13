export function convertCurrencyStringToNumber(currencyString: string): string {
  let cleanedString = currencyString.replace('R$ ', '');
  const decimalPart = ',00';
  cleanedString = cleanedString.replace('.', '').replace(',', '.');

  if (!cleanedString.includes('.')) {
    cleanedString += decimalPart;
  } else {
    const [integerPart] = cleanedString.split('.');
    cleanedString = integerPart + decimalPart;
  }

  cleanedString = cleanedString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return cleanedString;
}
