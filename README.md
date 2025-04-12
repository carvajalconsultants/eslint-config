# ESLint Config

Standard ESLint config across our applications.

To use:

 1. Add dependencies
```
yarn add -D @carvajalconsultants/eslint-config eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import-x eslint-plugin-storybook eslint-plugin-prefer-arrow-functions eslint-plugin-react-refresh eslint-import-resolver-typescript @ianvs/prettier-plugin-sort-imports eslint-config-prettier prettier husky lint-staged
```

2. Set up husky so that linter runs on git commit:

```
yarn husky init
```

3. Add husky config in .husky/pre-commit:

```
yarn lint-staged
```

Set the permissions to be runnable:
```
chmod +x .husky/pre-commit
```

4. Configure lint-staged to run linter, change package.json:

```
"scripts": {
   ...
   "lint": "eslint --report-unused-disable-directives --max-warnings 0 --fix && prettier --w ."
},
...
{
  "lint-staged": {
    "**/*.{ts,tsx,js,jsx}": [
      "eslint --report-unused-disable-directives --max-warnings 0 --fix",
      "prettier --w"
    ]
  }
}
```

5. Implement in the eslint.config.mjs file in your project:

```
// eslint.config.mjs
import config from '@carvajalconsultants/eslint-config';

export default [...config];
```

6. Prettier config should be (.prettierrc.json):

```
{
  "plugins": ["@ianvs/prettier-plugin-sort-imports"],
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "printWidth": 200,
  "bracketSameLine": true,
  "importOrder": ["react", "<BUILT_IN_MODULES>", "", "<THIRD_PARTY_MODULES>", "", "^~", "^[.]", "", "<TYPES>", "", "<TYPES>^~", "<TYPES>^[.]"],
  "importOrderTypeScriptVersion": "5.0.0"
}
```
