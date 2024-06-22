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



app.get('/info', (request, response) => {
    Person.find({}).then(people => {
        const numPeople = people.length
        const date = new Date()

        response.send(`<p>Phonebook has info for ${numPeople} people</p>
            <p>${date.toString()}</p>`)
    });
})
app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    Data = Data.filter(person => {
        return person.id !== id
    })
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing name or number'
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
