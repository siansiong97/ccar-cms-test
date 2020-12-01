const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3010
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/used-cars/:pid', (req, res) => {
    return app.render(req, res, '/used-cars/:pid', req.query)
  })

  server.get('/used-cars/:pid/:title', (req, res) => {
    return app.render(req, res, '/used-cars/:pid/:title', req.query)
  })

  server.get('/viewCar/:id', (req, res) => {
    return app.render(req, res, '/viewCar/:id', req.query)
  })

  // server.get('/b', (req, res) => {
  //   return app.render(req, res, '/b', req.query)
  // })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
