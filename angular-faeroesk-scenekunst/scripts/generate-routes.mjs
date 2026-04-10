import fs from 'fs';
import { client } from '../src/app/sanity/client.ts';

const slugs = await client.fetch(
  `*[_type == "post"].slug.current`
);

const routes = [
  '/',
  ...slugs.map(s => `/salg/${s}`),
  '/billetbetingelser',
  '/handelsbetingelser',
  '/privatlivspolitik',
  '/cookies'
];

fs.writeFileSync(
  './routes.json',
  JSON.stringify(routes, null, 2)
);

console.log('Routes generated:', routes.length);