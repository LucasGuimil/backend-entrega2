import express from "express"
import hbs from "express-handlebars"
import productsRouter from "./src/routes/products.router.js"
import cartsRouter from "./src/routes/carts.router.js"
import viewsRouter from "./src/routes/views.router.js"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
process.loadEnvFile("./.env")

app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", import.meta.dirname + "/src/views")

mongoose.connect(process.env.MONGO_URL)
    .then(console.log("Database connected succesfully!"))
    .catch(error => console.error(error))


app.use("/api/products",productsRouter)
app.use("/api/carts",cartsRouter)
app.use("/",viewsRouter)

app.use(express.static(import.meta.dirname + "/src/public"))


app.listen(process.env.PORT, console.log(`Listening in port ${process.env.PORT}.`))