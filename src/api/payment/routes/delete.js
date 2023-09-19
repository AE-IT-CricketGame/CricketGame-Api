module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/payments/delete/:mobile',
        handler: 'delete.delete',
      }
    ]
  }