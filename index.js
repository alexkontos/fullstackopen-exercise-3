require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan');
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-body'))
const Person = require('./models/person')

morgan.token("response-body", (req, res) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    } else {
        return null
    }
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndRemove(id).then(person => {
        response.json(person)
        response.status(204).end()
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`
        Phonebook has info for ${persons.length} people<br>
        ${new Date()}
        `)
    })

})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})