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
  .get('/api/persons', (_req, res) => {
    res.json(persons)
  })
  .listen(PORT, () => console.log(`🚀 Live on port ${PORT}`))
