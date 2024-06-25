require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const morgan = require('morgan')
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))



app.get('/info', (request, response, next) => {
    Person.find({})
        .then(people => {
            const numPeople = people.length
            const date = new Date()

            response.send(`<p>Phonebook has info for ${numPeople} people</p>
                <p>${date.toString()}</p>`)
        })
        .catch(error => next(error))
})
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(people => {
            response.json(people)
        })
        .catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            if (deletedPerson) {
                console.log('deleted', deletedPerson)
            }
            else {
                console.log('tried to delete nonexistent person')
            }
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })
    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const newPerson = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, newPerson, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const handleErrors = (error, request, response, next) => {
    console.log(error.message)
    
    if (error.name === 'CastError') {
        response.status(400).send({error: 'malformatted id'})
    }
    else if (error.name === 'ValidationError') {
        response.status(400).json({error: error.message})
    }

    next(error)
}
app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
