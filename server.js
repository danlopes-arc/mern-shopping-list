const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const mongoURI = require('./config/keys').mongoURI
mongoose.connect(mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log('[mongo] connected'))
    .catch(err => console.error(err))

const app = express()

app.use(express.json())

app.use('/api/items', require('./routes/api/items'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'))
    })
}




const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`[server] listening to http://localhost:${port}`);
})