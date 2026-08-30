import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 1,
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-mixed-spaces-and-tabs': 1,
      'react/react-in-jsx-scope': 0,
    },
  },
  {
    // The visual harness is a command line tool. Printing its report to the
    // terminal is what it is for, so `console.log` is not a stray debug line
    // there the way it is in application code.
    //
    // `docs/design/**` is there for the same reason: the design capture ships
    // with a reader, and reading a design out loud is the whole job.
    files: ['visual/**/*.mjs', 'docs/design/**/*.mjs'],
    rules: { 'no-console': 0 },
  },
];
