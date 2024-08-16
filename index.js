/*require("dotenv").config()*/

const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require("cors")

morgan.token('body', (request) =>JSON.stringify(request.body))

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors())
app.use(express.static('dist'))



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.get('/',(request, response) => {
    response.send('<h1>Welcome to NumberBook📲.</h1>')
})


app.get('/info',(request, response) => {
    response.send(`<p>Numberbook has info for ${persons.length} people</p>
      <br/>
      <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

     if(person) {
      response.json(person)
     } else {
      response.status(404).end()
     }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const personToDelete = persons.find(person => person.id === id);

  if (!personToDelete) {
      return response.status(404).json({ error: 'Person not found' });
  }

  persons = persons.filter(person => person.id !== id)

  
  response.status(204).end()
})


const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(person => parseInt(person.id)))
  : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
   const { name, number } = request.body
   
  if(!name || !number) {
    return response.status(400).json({
      error: "name and number are required"
    })
  }

  /* // assuming you have a function to check if a person with the same name already exists
  if (personExists(name)) {
    return response.status(400).json({
      error: 'person with this name already exists'
    })
  }*/

   const person = {
    name,
    number,
    id: generateId()
   }

   persons = persons.concat(person)

   response.json(person)
})





const PORT = process.env.PORT ||  3001
app.listen(PORT , () => {
    console.log(`Server running on ${PORT}`)
})


