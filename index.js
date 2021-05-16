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

app.get('/info', (_req, res) =>
  res.send(
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`
  )
)

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    res.status(400).json({ error: 'name is missing' })
    return
  }

  if (body.number === undefined) {
    res.status(400).json({ error: 'number is missing' })
    return
  }

  const nameExists = persons.find((person) => person.name === body.name)
  if (nameExists !== undefined) {
    res.status(400).json({ error: 'name already exists' })
    return
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  res.status(201).json(person)
})

app.get('/api/persons', (_req, res) => {
  Person.find().then((persons) => res.json(persons))
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((person) => {
    if (person === null) {
      res.status(404).end()
      return
    }

    res.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => res.status(204).end())
})

app.listen(config.PORT, () =>
  console.log(`Server runnning on port ${config.PORT}`)
)
