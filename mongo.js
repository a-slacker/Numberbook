const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please give password as argument')
  process.exit(1)
};

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.f3rhp.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String,
  }
)

const Person = mongoose.models('Person', personSchema)

if(process.argv.length === 3){
  Person.find({}).then(result => {
    console.log('phonebook: ')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(result)
    console.log('person saved')
    mongoose.connection.close()
  })
};



