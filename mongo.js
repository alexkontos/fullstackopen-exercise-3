const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Password missing')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://alexkontos:${password}@cluster0.ef3qxik.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.map(person => console.log(person))
    mongoose.connection.close()
    process.exit()
  })
}

if (process.argv.length > 3 && process.argv.length < 5) {
  console.log('number missing')
  mongoose.connection.close()
  process.exit(1)
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    process.exit()
  })

}

