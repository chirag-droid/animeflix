module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'eslint'],
  '*.json': ['prettier --write'],
  '{codegen.yml,*.gql,**/generated/*.ts}': () => 'npm run generate',
};
