<p align="center">
  <img  src="http://i.imgur.com/QmJrU0A.png" width="150" />
  <br />
  <br />
  <img src="https://travis-ci.org/Blocklevel/blue-next.svg?branch=master" />
</p>


## Installation

```bash
npm install -g bcli
```

## Usage

Create a new project just running 

```bash 
bcli project my-project
```

#### Create a new component

```bash
bcli component hello-world
```

#### Create a new container component

```bash
bcli component hello-world container
```

#### Create a new page component

```bash
bcli component hello-world page
```

#### Create a new vuex store module

```bash
bcli store
```

#### Share your localhost with a secure tunnel

```bash
bcli share
```
## Packages state
<p>
  <a href="https://www.npmjs.com/package/bcli">
    <img src="https://img.shields.io/npm/v/bcli.svg?label=bcli" alt="npm version">
  </a><br>
  <a href="https://www.npmjs.com/package/blue-scripts">
    <img src="https://img.shields.io/npm/v/blue-scripts.svg?label=blue-scripts" alt="npm version">
  </a><br>
  <a href="https://www.npmjs.com/package/blue-templates">
    <img src="https://img.shields.io/npm/v/blue-templates.svg?label=blue-templates" alt="npm version">
  </a><br>
  <a href="https://www.npmjs.com/package/eslint-config-blocklevel">
    <img src="https://img.shields.io/npm/v/eslint-config-blocklevel.svg?label=eslint-config-blocklevel" alt="npm version">
  </a><br>
</p>

## Contribution

To be able to start working with `blue-next` you need to install `lerna` globally and then in the root of repository run `lerna bootstrap`.

To know more about javascript projects with multiple packages, go to [Lerna](https://github.com/lerna/lerna) repository
