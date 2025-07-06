import express from "express"
import hbs from "express-handlebars"
import productsRouter from "./src/routes/products.router.js"
import cartsRouter from "./src/routes/carts.router.js"

const PORT = 8080
const app = express()

app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", import.meta.dirname + "/views")

app.use("/api/products",productsRouter)
app.use("/api/carts",cartsRouter)

app.use("/static", express.static(import.meta.dirname + "/public"))
app.use(express.json())


app.listen(8080, console.log("Listening in port 8080."))