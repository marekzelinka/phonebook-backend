const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
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
  name: { type: String, unique: true, required: true, minLength: 3 },
  number: { type: String, required: true, minLength: 8 },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
