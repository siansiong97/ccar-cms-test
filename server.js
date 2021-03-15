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

  server.get('/profile/:id', (req, res) => {
    return app.render(req, res, `/profile/${_.get(req, 'params.id') || ''}`, req.query)
  })

  server.get('/car-freaks/:id', (req, res) => {
    return app.render(req, res, `/car-freaks/${_.get(req, 'params.id') || ''}`, req.query)
  })

  server.get('/social-board/:id', (req, res) => {
    return app.render(req, res, `/social-board/${_.get(req, 'params.id') || ''}`, req.query)
  })

  server.get('/social-club/:id', (req, res) => {
    return app.render(req, res, `/social-club/${_.get(req, 'params.id') || ''}`, req.query)
  })

  server.get('/newcar/details/:make/:model', (req, res) => {
    return app.render(req, res, `/newcar/details/${_.get(req, 'params.make') || ''}/${_.get(req, 'params.model') || ''}`, req.query)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })


  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
