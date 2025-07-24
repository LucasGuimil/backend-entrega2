import { Router } from "express"
import cartModel from "../modules/cart.model.js"
import productModel from "../modules/product.model.js"

const cartsRouter = Router()

cartsRouter.post("/", async (req,res)=> {
    try {
        const newCart = new cartModel()
        await newCart.save()
        res.status(201).send(`New cart created succesfully! Your ID cart is: ${newCart._id}`)
    } catch (error) {
        res.status(500).send(error)
        }
    }
)


cartsRouter.get("/:cid", async (req,res)=> {
    const {cid} = req.params
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("ID not found.")
        }
        res.status(200).send(foundCart)
    } catch (error) {
        res.status(500).send(error)
        }   
    }
)

cartsRouter.put("/:cid", async (req,res)=> {
    const {cid} = req.params
    const newProducts = req.body
    console.log(newProducts)
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found.")
        }
        const existingProducts = await productModel.find()
        newProducts.forEach(product => {
            if(existingProducts.some(existingProduct => product.productID!=existingProduct._id)){
                return res.status(500).send("ID product of the new array is not valid.")
            }})
        foundCart.products = newProducts
        await cartModel.updateOne(cid,foundCart)
        res.status(200).send("Cart updated succesfully!")
    } catch (error) {
        res.status(500).send(error)
        }   
    }
)

cartsRouter.post("/:cid/product/:pid", async (req,res)=> {
    const {cid, pid} = req.params
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found.")
        }
        const foundProduct = await productModel.findById(pid)
        if(!foundProduct){
            return res.status(404).send("Product ID not found.")
        }
        if(foundCart.products.some(product => product.productID==pid)){
            const existingProduct = foundCart.products.find(product => product.productID==pid)
            existingProduct.quantity++
            await cartModel.updateOne({_id:cid},foundCart)
            res.status(200).send("Updated quantity on existing product.")
        }else{
            foundCart.products.push({
                productID: pid,
                quantity: 1
            })
            await cartModel.updateOne({_id:cid},foundCart)
            res.status(200).send("Product added to cart.")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

cartsRouter.delete("/:cid/product/:pid", async (req,res)=> {
    const {cid, pid} = req.params
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found.")
        }
        const foundProduct = await productModel.findById(pid)
        if(!foundProduct){
            return res.status(404).send("Product ID not found.")
        }
        if(foundCart.products.some(product => product.productID==pid)){
            const deleteIndex = foundCart.products.findIndex(product => product.productID==pid)
            foundCart.products.splice(deleteIndex,1)
            await cartModel.updateOne({_id:cid},foundCart)
            res.status(200).send("Product deleted!")
        }else{
            res.status(404).send("Product ID not found in this cart.")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


export default cartsRouter