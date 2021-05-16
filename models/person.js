const mongoose = require('mongoose')
const config = require('../config')

console.log('connecting to database', config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to database'))
  .catch((error) => console.log('error connecting to database:', error.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
