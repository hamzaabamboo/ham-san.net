module.exports = {
  ...require('../../.prettierrc.js'),
  plugins: ['prettier-plugin-svelte'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};
