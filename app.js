import express from "express"
import hbs from "express-handlebars"
import productsRouter from "./src/routes/products.router.js"
import cartsRouter from "./src/routes/carts.router.js"
import viewsRouter from "./src/routes/views.router.js"
import mongoose from "mongoose"

const PORT = 8080
const app = express()
app.use(express.json())


app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", import.meta.dirname + "/src/views")

mongoose.connect("mongodb+srv://ldguimil:1234567890@cluster0.uhhygvr.mongodb.net/entregafinal?retryWrites=true&w=majority&appName=Cluster0")
    .then(console.log("Database connected succesfully!"))
    .catch(error => console.error(error))


app.use("/api/products",productsRouter)
app.use("/api/carts",cartsRouter)
app.use("/",viewsRouter)

app.use(express.static(import.meta.dirname + "/src/public"))


app.listen(PORT, console.log(`Listening in port ${PORT}.`))