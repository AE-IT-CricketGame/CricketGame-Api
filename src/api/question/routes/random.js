module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/question/random/:runs',
      handler: 'random.getOne',
    }
  ]
}

