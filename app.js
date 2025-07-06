import express from "express"
import { ProductManager } from "./src/managers/ProductManager.js"
import { CartManager } from "./src/managers/CartManager.js"

const app = express()
app.use(express.json())

//products
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
    res.status(201).json("El producto ha sido creado correctamente.")
})

app.put("/api/products/:pid", (req,res)=> {
    const {pid} = req.params
    const productInfo = req.body
    ProductManager.getProducts().then(products => {
        const foundProduct = products.some(product => product.id === parseInt(pid))
        if(!foundProduct) {
            return res.status(404).json("El id del producto indicado no existe.")
        }else{
            ProductManager.updateProduct(pid,productInfo) 
            res.status(200).json("El producto fue modificado correctamente.")
        }
    })
}
)

app.delete("/api/products/:pid", (req,res)=> {
    const {pid} = req.params
    ProductManager.getProducts().then(products => {
        const foundProduct = products.find(product => product.id === parseInt(pid))
        if(!foundProduct) {
            return res.status(404).json("El id del producto indicado no existe.")
        }else{
            ProductManager.deleteProduct(pid)
            res.status(200).json("El producto fue eliminado correctamente.")
        }
    })
})


//carts
app.post("/api/carts", (req,res)=> {
    CartManager.newCart()
    .then((id) => res.status(201).json(`Nuevo carrito creado exitosamente con el número de ID: ${id}.`))
    .catch(()=>res.status(400).json("Error al crear el nuevo carrito."))
})

app.get("/api/carts/:cid",(req,res)=> {
    const {cid} = req.params
    CartManager.getCarts().then(carts => {
        const foundCart = carts.find(cart => cart.id === parseInt(cid))
        if(!foundCart) {
            return res.status(404).json("El id del producto indicado no existe.")
        }else{
            res.json(foundCart.products)
        }
    })
})

app.post("/api/carts/:cid/product/:pid", (req,res)=> {
    const {cid, pid} = req.params
    CartManager.addProduct(cid,pid)
    .then(()=> res.status(200).json("El producto fue agregado correctamente."))
    .catch(()=> res.status(400).json("No se pudo agregar el producto al carrito."))
})


app.listen(8080, console.log("Listening in port 8080."))