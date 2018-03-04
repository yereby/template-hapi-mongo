module.exports = [{
  method: 'GET', path: '/{param*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: 'public'
      }
    }
  }
}]
