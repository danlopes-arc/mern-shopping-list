require('dotenv').config()
process.env.JWT_EXPIRATION_SECONDS = 3600

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const mongoURI = process.env.MONGO_URI
mongoose.connect(mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('[mongo] connected'))
    .catch(err => console.error(err))

const app = express()

app.use(express.json())

app.use('/api/items', require('./routes/api/items'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./client/build'))
    app.get('*', (req, res) => {
        return res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'))
    })
}

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`[server] listening to http://localhost:${port}`);
})