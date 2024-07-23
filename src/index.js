import express from 'express'

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

express()
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
  .listen(PORT, () => console.log(`🚀 Live on port ${PORT}`))
