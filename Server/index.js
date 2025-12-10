const express = require('express')
const cors = require('cors')
const db = require("./Config/database")
const taskRouter = require("./Routes/todoRoute")

require('dotenv').config()


const app = express()

app.use(express.json())

const corsOptions = {
    origin: ['http://localhost:5173'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
    
};

app.use(cors(corsOptions))

db()

app.use('/api', taskRouter)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})