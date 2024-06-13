import path from 'path';
import scrape from 'website-scraper';

(async () => {
  const directory = path.resolve(__dirname, 'localSite');
  await scrape({
    urls: ['https://infograficos.valor.globo.com/calculadoras/calculadora-de-renda-fixa.html#ancor'],
    directory,
  });
})();
