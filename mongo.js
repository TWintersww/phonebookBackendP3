const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://wuevan33:${password}@cluster0.xkaympk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
else {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    newPerson.save().then(result => {
        console.log('person saved:', result)
        mongoose.connection.close()
    })
}
