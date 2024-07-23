import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { Person } from './models/person.js'

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

const app = express()

app.use(express.json())
app.use(cors())
app.use(
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

run().catch(console.dir)

async function run() {
  const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  }
  await mongoose.connect(MONGODB_URI, clientOptions)
  await mongoose.connection.db.admin().command({ ping: 1 })
  console.log('Pinged your deployment. You successfully connected to MongoDB!')

  app.get('/info', async (_req, res) => {
    const personCount = await Person.countDocuments()

    res.send(`
        <p>
          Phonebook has info for ${personCount} ${personCount > 1 ? 'people' : 'person'}
        </p>
        <p>
          ${new Date()}
        </p>
      `)
  })

  app.get('/api/persons', async (_req, res) => {
    const persons = await Person.find()
    res.json(persons)
  })

  app.get('/api/persons/:id', async (req, res) => {
    const id = req.params.id
    const person = await Person.findById(id)

    if (!person) {
      return res.status(404).end()
    }

    res.json(person)
  })

  app.delete('/api/persons/:id', async (req, res) => {
    const id = req.params.id
    await Person.findByIdAndDelete(id)

    res.status(204).end()
  })

  app.post('/api/persons', async (req, res) => {
    const { name, number } = req.body

    if (!name) {
      return res.status(400).json({ error: 'name is missing' })
    }

    if (!number) {
      return res.status(400).json({ error: 'number is missing' })
    }

    const existingPerson = await Person.findOne({ name })

    if (existingPerson) {
      return res.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({ name, number })
    const savedPerson = await person.save()

    res.status(201).json(savedPerson)
  })

  app.listen(PORT, () => console.log(`🚀 Live on port ${PORT}`))
}
