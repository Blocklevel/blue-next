# blue

A collection of Blue templates

## Installation

```bash
npm install blue-templates
```

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
