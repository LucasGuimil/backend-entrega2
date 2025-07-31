import { Router } from "express"
import productModel from "../modules/product.model.js"
import cartModel from "../modules/cart.model.js"

const viewsRouter = Router()

viewsRouter.get("/products", async (req, res)=> {
    
    const {limit = 5, page = 1, sort,status,category} = req.query
    const myCustomLabels = {
        docs: "payload",
        totalDocs: false,
        limit: false,
        pagingCounter: false
    }

    const query = {
    }
    if (category){
        query.category= category.toLowerCase()
    }
    if (status){
        query.status= status.toLowerCase()
    }

    const options = {
        limit: limit,
        page: page,
        customLabels: myCustomLabels
    }
    if(sort){
        options.sort = {price: sort}
    }
    try{
        const products = await productModel.paginate(query,options)
        let resultStatus = "success"
        let prevLink = products.hasPrevPage?`http://${req.host}${req.path}?page=${products.prevPage}`:null
        let nextLink = products.hasNextPage?`http://${req.host}${req.path}?page=${products.nextPage}`:null
        if(options.limit!=5){
            prevLink = products.hasPrevPage?prevLink + `&limit=${limit}`:null
            nextLink = products.hasNextPage?nextLink + `&limit=${limit}`:null
        }
        if(sort){
            prevLink = products.hasPrevPage?prevLink + `&sort=${sort}`:null
            nextLink = products.hasNextPage?nextLink + `&sort=${sort}`:null
        }
        if(status){
            prevLink = products.hasPrevPage?prevLink + `&status=${status}`:null
            nextLink = products.hasNextPage?nextLink + `&status=${status}`:null
        }
        if(category){
            prevLink = products.hasPrevPage?prevLink + `&category=${category}`:null
            nextLink = products.hasNextPage?nextLink + `&category=${category}`:null
        }

        res.links({
            prev: prevLink,
            next: nextLink
        })
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
            prevLink: prevLink,
            nextLink: nextLink
            })}
            catch(error){
                return res.status(404).send("not found")
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