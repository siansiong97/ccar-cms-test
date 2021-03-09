const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 11) || 3011
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const _ = require('lodash')

const { parse } = require('url')
app.prepare().then(() => {
  const server = express()

  server.get('/', (req, res) => {
    return app.render(req, res, '/', req.query)
  })

  server.get('/viewCar/:id', (req, res) => {
    return app.render(req, res, `/viewCar/${_.get(req, 'params.id') || ''}`, req.query)
  })

  server.get('/viewCar2/:id', (req, res) => {
    return app.render(req, res, `/viewCar2/${_.get(req, 'params.id') || ''}`, req.query)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })


  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
