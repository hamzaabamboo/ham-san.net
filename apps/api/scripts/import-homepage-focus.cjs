const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const { readFile, stat } = require('node:fs/promises');

const uid = 'api::homepage.homepage';
const locales = ['en', 'ja', 'th'];
const preservedFields = ['hero', 'heroSubtitle', 'introduction', 'heroImage', 'introductionImage'];

const fail = (message) => {
  throw new Error(message);
};

const normalizeInput = (input) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Input must be an object.');
  if (Object.keys(input).sort().join(',') !== [...locales].sort().join(',')) {
    fail('Input must contain exactly en, ja and th.');
  }
  return Object.fromEntries(
    locales.map((locale) => {
      const value = input[locale];
      if (typeof value !== 'string' || !value.trim()) fail(`Invalid current focus for ${locale}.`);
      return [locale, value.trim()];
    })
  );
};

const readInput = async (path) => {
  const file = resolve(path);
  if ((await stat(file)).size > 500_000) fail('Input exceeds 500 KB.');
  return normalizeInput(JSON.parse(await readFile(file, 'utf8')));
};

const findHomepage = (documents, locale, status = 'draft') =>
  documents.findFirst({ locale, status, populate: ['heroImage', 'introductionImage'] });

const planMigration = async (strapi, input) => {
  if (!strapi.contentTypes[uid]?.attributes?.currentFocus)
    fail('CMS currentFocus field is missing.');
  const documents = strapi.documents(uid);
  const reference = await findHomepage(documents, 'en');
  if (!reference?.documentId) fail('An English homepage draft is required.');
  const plan = [];

  for (const locale of locales) {
    if (!(await strapi.plugin('i18n').service('locales').findByCode(locale))) {
      fail(`CMS locale ${locale} is not enabled.`);
    }
    const draft = await findHomepage(documents, locale);
    const published = await findHomepage(documents, locale, 'published');
    if (published && !draft) fail(`Published homepage has no draft for ${locale}.`);
    for (const record of [draft, published]) {
      if (!record) continue;
      if (record.documentId !== reference.documentId)
        fail(`Unexpected homepage identity for ${locale}.`);
      if (record.currentFocus != null && record.currentFocus !== input[locale]) {
        fail(`Existing current focus conflicts for ${locale}.`);
      }
    }
    plan.push({
      locale,
      documentId: reference.documentId,
      draft,
      published,
      update: draft?.currentFocus !== input[locale]
    });
  }
  return plan;
};

const migrate = async (strapi, rawInput, write = false) => {
  const input = normalizeInput(rawInput);
  const documents = strapi.documents(uid);
  const plan = await planMigration(strapi, input);
  if (!write) return plan;

  for (const item of plan.filter((entry) => entry.update)) {
    const current = await findHomepage(documents, item.locale);
    if (JSON.stringify(current) !== JSON.stringify(item.draft)) {
      fail(`Draft changed during migration for ${item.locale}.`);
    }
    const published = await findHomepage(documents, item.locale, 'published');
    if (JSON.stringify(published) !== JSON.stringify(item.published)) {
      fail(`Published homepage changed during migration for ${item.locale}.`);
    }
    await documents.update({
      documentId: item.documentId,
      locale: item.locale,
      data: { currentFocus: input[item.locale] }
    });
    const saved = await findHomepage(documents, item.locale);
    if (saved?.currentFocus !== input[item.locale]) fail(`Readback failed for ${item.locale}.`);
    const original = item.draft ?? item.published;
    if (
      original &&
      preservedFields.some(
        (field) => JSON.stringify(saved[field]) !== JSON.stringify(original[field])
      )
    ) {
      fail(`Existing homepage content changed for ${item.locale}.`);
    }
    const publishedAfter = await findHomepage(documents, item.locale, 'published');
    if (JSON.stringify(publishedAfter) !== JSON.stringify(item.published)) {
      fail(`Published homepage changed during draft update for ${item.locale}.`);
    }
  }
  return plan;
};

const main = async () => {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  if (inputIndex < 0 || !args[inputIndex + 1])
    fail('Usage: node import-homepage-focus.cjs --input file.json [--write]');
  const allowed = args.filter((_, index) => index !== inputIndex && index !== inputIndex + 1);
  if (allowed.some((arg) => arg !== '--write') || allowed.length > 1) fail('Unknown option.');
  const input = await readInput(args[inputIndex + 1]);
  const requireFromApp = createRequire(resolve(process.cwd(), 'homepage-focus-import.cjs'));
  const requireFromStrapi = createRequire(requireFromApp.resolve('@strapi/strapi'));
  const { compileStrapi, createStrapi } = requireFromStrapi('@strapi/core');
  const strapi = createStrapi(await compileStrapi({ appDir: process.cwd() }));
  try {
    await strapi.load();
    const write = allowed.includes('--write');
    const plan = await migrate(strapi, input, write);
    console.log(
      `mode=${write ? 'write' : 'dry-run'} updates=${plan.filter((item) => item.update).length}`
    );
  } finally {
    await strapi.destroy();
  }
};

module.exports = { migrate, normalizeInput };

if (require.main === module) {
  main().catch((error) => {
    console.error(`Import failed: ${error.message}`);
    process.exitCode = 1;
  });
}
