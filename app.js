import express from "express"
import { ProductManager } from "./src/managers/ProductManager.js"

const app = express()
app.use(express.json())


app.get("/api/products", (req,res)=>{
    ProductManager.getProducts()
    .then(products => res.send(products))
    
})

app.get("/api/products/:pid", (req,res)=> {
    const {pid} = req.params
    ProductManager.getProducts().then(products => {
        const foundProduct = products.find(product => product.id === parseInt(pid))
        if(!foundProduct) return res.status(404).json("El id del producto indicado no existe.")
        res.status(200).json(foundProduct)
    })
})

app.post("/api/products", (req, res)=> {
    const productInfo = req.body
    ProductManager.addProduct(productInfo)
    res.status(201)
})

app.put("/api/products/:pid", (req,res)=> {
    const {pid} = req.params
    const productInfo = req.body
    ProductManager.updateProduct(pid,productInfo)
    })

app.listen(8080, console.log("Listening in port 8080."))