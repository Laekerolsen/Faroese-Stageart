import fs from 'fs';
import path from 'path';

const dist = './dist/angular-faeroesk-scenekunst/browser';
const routes = JSON.parse(fs.readFileSync('./routes.json', 'utf-8'));

const staticRoutes = [
  { path: '/', data: { title: 'Færøsk Scenekunst', description: 'Færøsk Scenekunst er en samling av teater, dans og performancekunst fra Færøerne.', keywords: 'Færøsk Scenekunst, teater, dans, performancekunst, Færøerne' } },
  { path: '/kurv', data: { title: 'Indkøbskurv - Færøsk Scenekunst', description: 'Se din indkøbskurv og administrer dine varer før du går til kassen.', keywords: 'Færøsk Scenekunst, indkøbskurv, varer, kasse' } },
  { path: '/adresse', data: { title: 'Adresse - Færøsk Scenekunst', description: 'Se og rediger din adresse inden du går videre til betaling', keywords: 'Færøsk Scenekunst, adresse, betaling, kasse' } },
  { path: '/betaling', data: { title: 'Betaling - Færøsk Scenekunst', description: 'Inspicer din ordre inden du går videre til betaling hos viva', keywords: 'Færøsk Scenekunst, ordre, betaling, viva, kasse' } },
  { path: '/privatlivspolitik', data: { title: 'Privatlivspolitik - Færøsk Scenekunst', description: 'Læs vores privatlivspolitik for at forstå, hvordan vi håndterer dine data og beskytter dit privatliv, når du besøger Færøsk Scenekunst.', keywords: 'Færøsk Scenekunst, privatlivspolitik, databeskyttelse, personlige oplysninger' } },
  { path: '/cookiepolitik', data: { title: 'Cookiepolitik - Færøsk Scenekunst', description: 'Læs vores cookiepolitik for at forstå, hvordan vi bruger cookies og lignende teknologier, når du besøger Færøsk Scenekunst.', keywords: 'Færøsk Scenekunst, cookiepolitik, cookies, webteknologier' } },
  { path: '/billetbetingelser', data: { title: 'Billetbetingelser - Færøsk Scenekunst', description: 'Læs vores billetbetingelser for at forstå dine rettigheder og forpligtelser ved køb af billetter til færøske teaterforestillinger.', keywords: 'Færøsk Scenekunst, billetbetingelser, teater, billetter' } },
  { path: '/handelsbetingelser', data: { title: 'Handelsbetingelser - Færøsk Scenekunst', description: 'Læs vores handelsbetingelser for at forstå dine rettigheder og forpligtelser ved køb af varer og tjenester fra Færøsk Scenekunst.', keywords: 'Færøsk Scenekunst, handelsbetingelser, varer, tjenester' } },
  { path: '/salg/plakat-saelges', data: { title: 'Plakat sælges!', description: 'Plakat fra Foreningen for færøsk scenekunst i Esbjerg. Plakaten illustrerer i tegneserieform det kendte kunstværk ved Esbjerg Strand “Mennesket ved havet” eller i daglig tale "de 4 hvide mænd"', keywords: 'Færøsk Scenekunst, teater, dans, performancekunst, Færøerne, Lunder, Færøsk tøj' } },
];

function injectMeta(html, { title, description, keywords }) {
  return html
    .replace(
      /<title>.*?<\/title>/,
      `<title>${title ?? ''}</title>`
    )
    .replace(
      /<meta name="description" content=".*?">/,
      `<meta name="description" content="${description ?? ''}">`
    )
    .replace(
      /<meta name="keywords" content=".*?">/,
      `<meta name="keywords" content="${keywords ?? ''}">`
    );
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const route of staticRoutes) {
  // skip homepage
  if (route.path === '/') continue;

  // Handle static routes like /billetbetingelser, /handelsbetingelser, etc.
  if (
    route.path === '/billetbetingelser' ||
    route.path === '/handelsbetingelser' ||
    route.path === '/privatlivspolitik' ||
    route.path === '/cookiepolitik'
  ) {
    const slug = route.path;

    const targetDir = path.join(dist, '', slug);

    ensureDir(targetDir);

    fs.copyFileSync(
      path.join(dist, 'index.html'),
      path.join(targetDir, 'index.html')
    );

    const filePath = path.join(
    dist,
    '',
    slug,
    'index.html'
    );

    if (fs.existsSync(filePath))
    {
        const html = fs.readFileSync(filePath, 'utf-8');

        const updated = injectMeta(html, {
            title: route.data.title,
            description: route.data.description,
            keywords: route.data.keywords
        });

        fs.writeFileSync(filePath, updated);
    }
  }

  // ONLY handle /salg/:slug routes
  if (route.path.startsWith('/salg/')) {
    const slug = route.path.replace('/salg/', '');

    const targetDir = path.join(dist, 'salg', slug);

    ensureDir(targetDir);

    fs.copyFileSync(
      path.join(dist, 'index.html'),
      path.join(targetDir, 'index.html')
    );

    const filePath = path.join(
    dist,
    'salg',
    slug,
    'index.html'
    );

    if (fs.existsSync(filePath))
    {
        const html = fs.readFileSync(filePath, 'utf-8');

        const updated = injectMeta(html, {
            title: route.data.title,
            description: route.data.description,
            keywords: route.data.keywords
        });

        fs.writeFileSync(filePath, updated);
    }
  }
}

console.log('SSG pages generated from routes.json');