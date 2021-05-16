const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://user:${password}@cluster0.10skx.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find().then((persons) => {
    console.log('phonebook:')

    for (const person of persons) {
      console.log(`${person.name} ${person.number}`)
    }

    mongoose.connection.close()
  })
} else {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber,
  })

  person.save().then(() => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)

    mongoose.connection.close()
  })
}
