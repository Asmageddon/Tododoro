import express from 'express'

const PORT = 3000
const app = express()
app.use(express.static('public'))
app.listen(PORT, function() {
    console.log(`Started listening on ${PORT}`)
})
