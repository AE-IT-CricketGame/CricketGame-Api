module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/payments/cycle/:cycle',
        handler: 'cyclechange.cycleChange',
      }
    ]
  }