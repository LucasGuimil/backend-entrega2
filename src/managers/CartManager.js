import fs from "fs"

export class CartManager {
    static async getCarts(){
    try {
        const carts = await fs.promises.readFile("./src/files/carts.json", "utf-8")
        return JSON.parse(carts)    
        } catch (error) {
            console.error("Se ha producido un error al leer el archivo.",error)
        }
    }

    static async newCart() {
        try{
        const carts = await CartManager.getCarts()
        const id = carts.length>0? carts[carts.length-1].id +1 : 1
        carts.push({
            id: id,
            products: []
        })
        const converted = JSON.stringify(carts,null,2)
        await fs.promises.writeFile("./src/files/carts.json",converted)
        console.log("Carrito creado con éxito.")
        return id
    } catch (error){
        throw new Error("Se ha producido un error al crear un nuevo carrito.",error)
    }
    }

    static async addProduct(cid, pid){
        try {
            cid = parseInt(cid)
            pid = parseInt(pid)
            const carts = await CartManager.getCarts()
            const foundCart = carts.find(cart => cart.id === cid)
            if(!foundCart) throw new Error(console.error("El ID proporcionado no existe."))
            const products = foundCart.products
            if (products.some(product => product.product === pid)){
                const existingProduct = (products.find(product => product.product === pid))
                existingProduct.quantity++
                console.log("Producto existente, se actualizó la cantidad.")
            }else{
                products.push({
                    product: parseInt(pid),
                    quantity: 1
                })
                console.log("Se agregó el nuevo producto al carrito")
            }
            foundCart.products = products
            const converted = JSON.stringify(carts,null,2)
        await fs.promises.writeFile("./src/files/carts.json",converted)
        console.log("Carrito actualizado con éxito.")
        } catch (error) {
            throw new Error("Error al actualizar el carrito.");
        }
    }
}