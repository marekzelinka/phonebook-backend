const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const config = require('./config')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ')
  )
)

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (body.name === undefined) {
    res.status(400).json({ error: 'name is missing' })
    return
  }

  if (body.number === undefined) {
    res.status(400).json({ error: 'number is missing' })
    return
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((error) => next(error))
})

app.get('/api/persons', (_req, res, next) => {
  Person.find()
    .then((persons) => res.json(persons))
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person === null) {
        res.status(404).end()
        return
      }

      res.json(person)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    res.status(400).json({ error: 'malformatted id' })
    return
  }

  next(error)
}

app.use(errorHandler)

app.listen(config.PORT, () =>
  console.log(`Server runnning on port ${config.PORT}`)
)
