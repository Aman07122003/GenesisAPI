module.exports = {
  '/quotes': {
    target: 'https://genesis.eshipper.com',
    secure: true,
    changeOrigin: true,
    pathRewrite: {
      '^/quotes': '/api/quotes'
    },
    logLevel: 'debug'
  },

  '/shipments': {
    target: 'https://genesis.eshipper.com',
    secure: true,
    changeOrigin: true,
    pathRewrite: {
      '^/shipments': '/api/shipments'
    },
    logLevel: 'debug'
  }
};