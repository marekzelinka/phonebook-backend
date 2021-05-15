const express = require('express')
const morgan = require('morgan')

let persons = [
  {
    name: 'Marek Zelinka',
    number: '040-1257964',
    id: 4,
  },
  {
    name: 'Tom Holland',
    number: '040-2456786',
    id: 5,
  },
  {
    name: 'Dan Abramov 2',
    number: '040-124675',
    id: 6,
  },
]

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0
  return maxId + 1
}

const app = express()

app.use(express.json())

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

app.get('/api/persons', (_req, res) => res.json(persons))

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id))
  if (person === undefined) {
    res.status(404).end()
    return
  }

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id))
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server runnning on port ${PORT}`))
