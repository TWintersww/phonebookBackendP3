const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(response => {
        console.log('sucessful connection to MDB')
    })
    .catch(response => {
        console.log('failed to connect to MDB')
    })

const pNumRegexCheck = (v) => {
    const regEx = /^\d{2,3}-\d+$/

    return v.length >= 8 && regEx.test(v)
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: pNumRegexCheck,
            message: props => `${props.value} is not a valid phone number`
        },
        required: true
    }
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
