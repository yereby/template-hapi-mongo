# Template Hapi

[![Maintainability](https://api.codeclimate.com/v1/badges/eb2ff0c093ef7eb0394f/maintainability)](https://codeclimate.com/github/yereby/template-hapi-mongo/maintainability)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/1733/badge)](https://bestpractices.coreinfrastructure.org/projects/1733)

This project contains a template to run Hapi framework.  
Writen in es6, it use Hapijs framework and those noticeable packages :

- Hapi 17
- nodemon
- good
- mongoose
- tap

## Requirement

You need mongodb.  
For example to install it with homebrew : `brew install mongodb`.  
Then run the deamon like

```sh
mongod --dbpath /data/db --logpath /data/log/db.log --fork
```

## How to run

Install the packages, and start the project :

```sh
npm install
npm start
```

Launch the browser to the url shown in the console, ie. http://localhost:1337.

## How to test

The tests suite is writen with "tap". There is some tests samples in `test/`. Just run

```sh
npm test
```

or `npm run test:w` which watch your files.
