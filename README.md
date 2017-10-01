# Template Hapi

This project contains a template to run Hapi framework.  
Writen in es6, it use Hapijs framework and those noticeable packages :
- nodemon
- good
- dotenv
- livereload
- tape

## How to run

First install the packages, and start the project :

```
npm install
npm start
```

See below to define your environnement variables.

Launch the browser to the url shown in the console, ie. http://localhost:1337.

I you want to run the livereload, juste run `npm run livereload` in an other shell.  
There is a wait timer to let the server reloading itself after a file is modified.

## Environnement variables

A `.env` file is loaded via "dotenv" package, to allow you to pass variables
to `process.env`. Here is a sample :

```
DEBUG = app:*
```

## How to test

The tests suite is writen with "tape". There is some tests samples in `src/tests/`.  
Just run `npm test` or `npm run testwatch` which watch your files.
