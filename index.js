require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./models/person')



app.use(express.json());
morgan.token('body', (request) =>JSON.stringify(request.body))
app.use(morgan("tiny"))
app.use(cors())
app.use(express.static('dist'))

/*const password = process.argv[2]

const url = process.env.MONGODB_URI;
console.log("connecting to", url)

mongoose.set('strictQuery',false)

mongoose.connect(url)
.then(result => {
  console.log("connected to MongoDB")
})
.catch(error => {
  console.log("error connecting to MONGO", error.message)
})*/




//const Person = mongoose.model("Person", personSchema)


/*const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)*/




app.get('/',(request, response) => {
    response.send('<h1>Welcome to NumberBook📲.</h1>')
})


app.get('/info',(request, response) => {
     const date = new Date()
     Person
           .find({})
           .then(result => {
              response.send(`<p>Numberbook has info for ${persons.length} people</p>
              <br/>
            <p>${date}</p>`
          )
          })
})

app.get('/api/persons', (request, response) => {
  Person
        .find({})
        .then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
      response.json(person)
      }else{
        response.status(404).end()
      }
 })
})

app.delete('/api/persons/:id', (request, response) => {
  //const id = request.params.id
 //const personToDelete = persons.find(person => person.id === id);
  Person.findByIdAndRemove(request.params.id)
        .then(result => {
              response.status(204).end()
      })
})

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post('/api/persons', postmorgan, (request, response) => {
   const { name, number } = request.body
   
  if(!name || !number) {
    return response.status(400).json({
      error: "name and number are required"
    })
  }else{
    const person = new Person({
      name,
      number,
     })

     person.save()
    .then(person=> {
     response.json(person)
})
  }
})

app.put('/api/persons/:id', (request, response) => {
  const { name, number} = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query"}
  )
        .then(updatedPerson => {
               response.json(updatedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT ||  3001
app.listen(PORT , () => {
    console.log(`Server running on ${PORT}`)
})


/*const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(person => parseInt(person.id)))
  : 0
  return String(maxId + 1)
}*/
