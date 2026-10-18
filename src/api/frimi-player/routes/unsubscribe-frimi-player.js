module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/frimi-player/unsubscribe/:mobile',
        handler: 'unsubscribe.unsubscribe',
      }
    ]
  }