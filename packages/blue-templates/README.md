[![npm](https://img.shields.io/npm/v/blue-templates.svg)](https://www.npmjs.com/package/blue-templates)
[![npm version](https://img.shields.io/npm/dt/blue-templates.svg)](https://badge.fury.io/js/blue-templates)

## blue-templates 
Collection of templates used by [bcli](https://github.com/Blocklevel/blue-next/tree/master/packages/bcli)


## Usage
These are all functions available, each one retrieves a path to a specific part of the Blue framework

```js
const blueTemplates = require('blue-templates')

// Blue
blueTemplates.getBlue()

// Store module
blueTemplates.getStoreModule()

// Pre-processors (i.e. postcss)
blueTemplates.getPreProcessor('postcss')

// Component
blueTemplates.getComponent()
```
