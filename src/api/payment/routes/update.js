module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/payments/update',
        handler: 'update.update',
      },
      {
        method: 'POST',
        path: '/payments/cycle/delete',
        handler: 'update.cycleDelete',
      }
    ]
  }

