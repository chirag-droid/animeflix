module.exports = {
  '{codegen.yml,*.gql,**/generated/*.ts}': () => 'npm run generate',
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'eslint'],
  '*.json': ['prettier --write'],
};
