const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const { createPublicKey, publicEncrypt, constants } = require('node:crypto');

const requireFromApp = createRequire(resolve(process.cwd(), 'cms-access.cjs'));
const requireFromStrapi = createRequire(requireFromApp.resolve('@strapi/strapi'));
const { compileStrapi, createStrapi } = requireFromStrapi('@strapi/core');
const permissions = [
  'api::project.project.find',
  'api::project.project.findOne',
  'api::project.project.update',
  'plugin::upload.content-api.find',
  'plugin::upload.content-api.findOne',
  'plugin::upload.content-api.upload',
  'plugin::upload.content-api.destroy'
];

async function run() {
  const operation = process.argv[2];
  const nonce = process.env.CMS_ACCESS_NONCE;
  if (!['issue', 'revoke'].includes(operation) || process.argv.length !== 3) {
    throw new Error('Expected issue or revoke.');
  }
  if (!/^[a-f0-9]{32}$/.test(nonce ?? '')) throw new Error('Invalid maintenance nonce.');
  const name = `cms-delivery-${nonce}`;
  let publicKey;
  if (operation === 'issue') {
    publicKey = createPublicKey(process.env.CMS_ACCESS_PUBLIC_KEY ?? '');
    if (
      publicKey.asymmetricKeyType !== 'rsa' ||
      publicKey.asymmetricKeyDetails.modulusLength < 4096
    ) {
      throw new Error('Expected an RSA public key of at least 4096 bits.');
    }
  } else if (!/^\d+$/.test(process.env.CMS_ACCESS_TOKEN_ID ?? '')) {
    throw new Error('Expected the issued token ID.');
  }

  const app = createStrapi(await compileStrapi({ appDir: process.cwd() }));
  try {
    await app.load();
    const service = app.service('admin::api-token-content-api');
    const existing = await service.getByName(name);
    if (operation === 'revoke') {
      if (!existing) {
        console.log('CMS_ACCESS_REVOKED=already-absent');
        return;
      }
      if (String(existing.id) !== process.env.CMS_ACCESS_TOKEN_ID || existing.type !== 'custom') {
        throw new Error('Issued token identity does not match; refusing to revoke.');
      }
      await service.revoke(existing.id);
      if (await service.getByName(name)) throw new Error('Token revocation readback failed.');
      console.log(`CMS_ACCESS_REVOKED=${existing.id}`);
      return;
    }

    if (existing) throw new Error('Maintenance token already exists; revoke it before retrying.');
    const available = new Set(app.contentAPI.permissions.providers.action.keys());
    if (permissions.some((permission) => !available.has(permission))) {
      throw new Error('Required CMS actions are not registered.');
    }
    try {
      const token = await service.create({
        name,
        description: 'Temporary project content and media maintenance',
        type: 'custom',
        permissions,
        lifespan: 604800000
      });
      if (!token.accessKey || !token.id || !token.expiresAt)
        throw new Error('Incomplete issued token.');
      const ciphertext = publicEncrypt(
        { key: publicKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
        Buffer.from(token.accessKey)
      ).toString('base64');
      console.log(
        `CMS_ACCESS_ENVELOPE=${Buffer.from(
          JSON.stringify({ id: token.id, nonce, expiresAt: token.expiresAt, ciphertext })
        ).toString('base64')}`
      );
    } catch (error) {
      const issued = await service.getByName(name);
      if (issued) await service.revoke(issued.id);
      throw error;
    }
  } finally {
    await app.destroy();
  }
}

run().catch((error) => {
  console.error(`CMS maintenance failed: ${error.message}`);
  process.exitCode = 1;
});
