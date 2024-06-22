const express = require('express')
const cors = require('cors')

const app = express()
const morgan = require('morgan')
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))


let Data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello</h1>')
})
app.get('/info', (request, response) => {
    const numPeople = Data.length;
    const date = new Date()

    response.send(`<p>Phonebook has info for ${numPeople} people</p>
        <p>${date.toString()}</p>`)
})
app.get('/api/persons', (request, response) => {
    response.json(Data)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = Data.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
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
    const newId = Math.floor(Math.random()*99999)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing name or number'
        })
    }
    if (Data.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: newId,
    }

    Data = Data.concat(newPerson)
    response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
