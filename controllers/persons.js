const personsRouter = require('express').Router()
const Person = require('./models/person.js')
const morgan = require('morgan')


personsRouter.get('/',(request, response, next) => {
  Person.find({}).then(() => {
    response.send('<h1>Welcome to NumberBook📲.</h1>')
  })
    .catch(error => next(error))
})

personsRouter.get('/info',(request, response, next) => {
  const date = new Date()
  Person
    .find({})
    .then(result => {
      response.send(`<p>Numberbook has info for ${result.length} people</p>
                <br/>
              <p>${date}</p>`
      )
    })
    .catch(error => next(error))
})

personsRouter.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

personsRouter.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(error =>  next(error))
})

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

personsRouter.post('/api/persons', postMorgan, (request, response, next) => {
  const { name, number } = request.body
  if(!name || !number) {
    return response.status(400).json({
      error: 'name and number are required'
    })
  }else{
    const person = new Person({
      name,
      number,
    })

    person.save()
      .then(person => {
        response.json(person)
      })
      .catch(error => next(error))
  }
})

personsRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personsRouter