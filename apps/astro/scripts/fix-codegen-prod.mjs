import { readFileSync, writeFileSync } from 'node:fs';

const generatedFile = new URL('../src/graphql/generated/client.ts', import.meta.url);
let source = readFileSync(generatedFile, 'utf8');
const enumNames = [...source.matchAll(/^export enum ([A-Za-z0-9_]+) /gm)].map((match) => match[1]);

for (const name of enumNames) {
  source = source.replace(
    new RegExp(`\\nexport type ${name} =\\n(?:  \\| [^\\n;]+\\n)*  \\| [^\\n;]+;`, 'g'),
    ''
  );
}

writeFileSync(generatedFile, source);
