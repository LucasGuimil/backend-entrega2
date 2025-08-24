import { Router } from "express"
import cartModel from "../models/cart.model.js"
import { getProducts } from "../managers/ProductManager.js"

const viewsRouter = Router()

viewsRouter.get("/products", async (req, res)=> {

    try{
        const products = await getProducts(req)
        res.links({
            prev: products.prevLink,
            next: products.nextLink
        })
        let resultStatus
        if(products.payload.length==0){
            resultStatus="error"
            return res.status(400).send({
                status: resultStatus,
                ...products
            })
        }
        const showProducts = products.payload.map(product => product.toObject())
        res.render("home",{
            showProducts,
            prevLink: products.prevLink,
            nextLink: products.nextLink
            })}
            catch(error){
                return res.status(404).send("Not found")
            }}
        )


viewsRouter.get("/carts/:cid", async (req, res)=> {
    const {cid} = req.params
    try {
        const foundCart = await cartModel.findById(cid).populate("products.productID")
        const showProducts = foundCart.products.map(product => product.toObject())
        if(!foundCart){
            return res.status(404).send("ID not found.")
        }
        const convertedCart = foundCart.toObject()
        res.status(200).render("cart",{
            convertedCart,
            showProducts
        })
    } catch (error) {
        res.status(500).send(error)
        }   
    }
)
viewsRouter.get("/realTimeProducts" , (req,res)=>{
    const pageName = "Real time products"
        res.render("realTimeProducts",{
            pageName,
        })
    })

export default viewsRouter