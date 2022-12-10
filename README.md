# generator-koa-esm-api [![NPM version][npm-image]][npm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Create Koa.js API server using the modern ESM Node.js module system + Mongoose

## About
This generator uses ESM modules along with webpack + pkg to build a binary. The .env file used during development will be hardcoded in the resulting binary (however, consider encrypting sensitive data, because simple `strings` command can reveale all of your env variables). Also this generator uses the custom Node.js loader functionality to provide custom aliasing like `@/lib/email`, which is resolved by webpack during the build. 

## Installation

First, install [Yeoman](http://yeoman.io) and generator-koa-esm-api using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-koa-esm-api
```

Then generate your new project:

```bash
yo koa-esm-api
```
To create a new route run:

```bash
yo koa-esm-api:route name
```
To create a new model run:

```bash
yo koa-esm-api:model name
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

GPL-3.0 © [Seva D.]()

[npm-image]: https://badge.fury.io/js/generator-koa-esm-api.svg
[npm-url]: https://npmjs.org/package/generator-koa-esm-api
[coveralls-image]: https://coveralls.io/repos/vaguue/generator-koa-esm-api/badge.svg
[coveralls-url]: https://coveralls.io/r/vaguue/generator-koa-esm-api
