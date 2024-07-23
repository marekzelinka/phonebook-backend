import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

const PORT = 3000

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

function generatePersonId() {
  let id = Math.floor(Math.random() * 10_000)
  return String(id)
}

express()
  .use(express.json())
  .use(cors())
  .use(
    morgan((tokens, req, res) => {
      let body = process.env.NODE_ENV === 'development' ? req.body : {}

      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
        JSON.stringify(body),
      ].join(' ')
    }),
  )
  .get('/info', (_req, res) => {
    res.send(`
      <p>
        Phonebook has info for ${persons.length} ${persons.length > 1 ? 'people' : 'person'}
      </p>
      <p>
        ${new Date()}
      </p>
    `)
  })
  .get('/api/persons', (_req, res) => {
    res.json(persons)
  })
  .get('/api/persons/:id', (req, res) => {
    let id = req.params.id
    let person = persons.find((person) => person.id === id)

    if (!person) {
      return res.status(404).end()
    }

    res.json(person)
  })
  .delete('/api/persons/:id', (req, res) => {
    let id = req.params.id
    persons = persons.filter((person) => person.id !== id)
    res.status(204).end()
  })
  .post('/api/persons', (req, res) => {
    let { name, number } = req.body

    if (!name) {
      return res.status(400).json({ error: 'name is missing' })
    }

    if (!number) {
      return res.status(400).json({ error: 'number is missing' })
    }

    let existingPerson = persons.find((person) => person.name === name)

    if (existingPerson) {
      return res.status(400).json({ error: 'name must be unique' })
    }

    let person = { name, number, id: generatePersonId() }
    persons = persons.concat(person)
    res.status(201).json(person)
  })
  .listen(PORT, () => console.log(`🚀 Live on port ${PORT}`))
