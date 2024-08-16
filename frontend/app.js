const express = require("express")
const app = express();
const cors = require ('cors');



const api_routes = require("./routes/index")


//share public folder
app.use(express.static('public'))

// Middlewares

//CORS

app.use(cors({
    origin: 'http://localhost:5173', // La URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true

}))


// poder interpretar los datos que vienen en el body de una petición
app.use(express.json())

app.use("/api", 
api_routes)

module.exports = app;