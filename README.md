# Template Hapi

This project contains a template to run Hapi framework.  
Writen in es6, it use Hapijs framework and those noticeable packages :
- nodemon
- good
- livereload
- mongoose
- tap

## How to run

You need mongodb installed. For example with homebrew : `brew install mongodb`.  
Then run the deamon like
```sh
mongod
```

Install the packages, and start the project :

```sh
npm install
npm start
```

See below to define your environnement variables.

Launch the browser to the url shown in the console, ie. http://localhost:1337.

I you want to run the livereload, juste run `npm run livereload` in an other shell.  
There is a wait timer to let the server reloading itself after a file is modified.

## How to test

The tests suite is writen with "tap". There is some tests samples in `tests/`.  
Just run
```sh
npm test
```
or `npm run testwatch` which watch your files.
