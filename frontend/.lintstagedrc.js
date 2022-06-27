module.exports = {
  '{codegen.yml,*.gql,**/generated/*.ts}': () => 'yarn generate',
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'eslint'],
  '*.json': ['prettier --write'],
};
