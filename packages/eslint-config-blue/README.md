[![npm](https://img.shields.io/npm/v/eslint-config-blocklevel.svg)](https://www.npmjs.com/package/eslint-config-blocklevel)
[![npm version](https://img.shields.io/npm/dt/eslint-config-blocklevel.svg)](https://badge.fury.io/js/eslint-config-blocklevel)

## eslint-config-blocklevel
A set of Eslint (http://eslint.org) rules

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
