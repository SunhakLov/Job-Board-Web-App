import express from 'express'

const app = express();

app.get("/", (req, res) => {
    res.send("<h1>HELLO</h1>")
})

app.listen(8000, () => {
    console.log('server is running')
})