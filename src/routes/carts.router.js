import { Router } from "express"
import {CartManager} from "../managers/CartManager.js"

const cartsRouter = Router()

cartsRouter.post("/", (req,res)=> {
    CartManager.newCart()
    .then((id) => res.status(201).json(`Nuevo carrito creado exitosamente con el número de ID: ${id}.`))
    .catch(()=>res.status(400).json("Error al crear el nuevo carrito."))
})

cartsRouter.get("/:cid",(req,res)=> {
    const {cid} = req.params
    CartManager.getCarts().then(carts => {
        const foundCart = carts.find(cart => cart.id === parseInt(cid))
        if(!foundCart) {
            return res.status(404).json("El id del carrito indicado no existe.")
        }else{
            res.json(foundCart.products)
        }
    })
})

cartsRouter.post("/:cid/product/:pid", (req,res)=> {
    const {cid, pid} = req.params
    CartManager.addProduct(cid,pid)
    .then(()=> res.status(200).json("El producto fue agregado correctamente."))
    .catch(()=> res.status(400).json("No se pudo agregar el producto al carrito."))
})

export default cartsRouter