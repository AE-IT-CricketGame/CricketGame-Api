module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/question/random/:runs',
      handler: 'random.getOne',
    }
  ]
}

