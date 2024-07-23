import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.error('give password as argument')
  process.exit(1)
}

let password = encodeURIComponent(process.argv[2])

let uri = `mongodb+srv://user:${password}@cluster0.10skx.mongodb.net/phonebook-backend?retryWrites=true&w=majority&appName=Cluster0`
let clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

run().catch(console.dir)

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    )

    let personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    let Person = mongoose.model('Person', personSchema)

    async function listPersons() {
      let persons = await Person.find()
      console.log('phonebook:')
      if (!persons.length) {
        console.log('no persons found')
      } else {
        for (let person of persons) {
          console.log(person.name, person.number)
        }
      }
    }

    async function addPerson(name, number) {
      let person = new Person({ name, number })
      let addedPerson = await person.save()
      console.log(
        `added ${addedPerson.name} number ${addedPerson.number} to phonebook`,
      )
    }

    if (process.argv.length < 5) {
      await listPersons()
    } else {
      let name = process.argv[3]
      let number = process.argv[4]
      await addPerson(name, number)
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect()
  }
}
