# eslint-config-blocklevel

A set of ESLint (http://eslint.org) rules

## Usage
`npm install eslint-config-blocklevel`

```js
{
  "extends": "eslint-config-blocklevel"
  ...
}
```

or in the webpack configuration

```js
{
  eslint: {
    configFile: require.resolve('eslint-config-blocklevel')
  }
}
```
