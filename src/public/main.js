
const socket=io()
const container = document.getElementById("productList")
const form = document.getElementById("form")
const inputTitle = document.getElementById("title")
const inputDescription = document.getElementById("description")
const inputCode = document.getElementById("code")
const inputPrice = document.getElementById("price")
const inputStatus = document.getElementById("status")
const inputStock = document.getElementById("stock")
const inputCategory = document.getElementById("category")
const inputThumbnails = document.getElementById("thumbnails")

socket.on("showProducts",(products)=>{
    container.innerHTML=""
    products.forEach(product => {
        let card = document.createElement("div")
        card.innerHTML = `
                        <ul>
                            <li>${product.id}</li>
                            <li>${product.title}</li>
                            <li>${product.price}</li>
                            <button class="delete" id=${product.id}>Eliminar producto</button>
                        </ul>`
        container.appendChild(card)
    })
    const deleteButtons = document.querySelectorAll(".delete")
    deleteButtons.forEach(button =>{
        button.addEventListener("click",()=>{
            const pid = button.getAttribute("id")
            socket.emit("deleteProduct",pid)
        })
    })
    })

form.addEventListener("submit", (e)=> {
    e.preventDefault()
        const newProduct = {
        title: inputTitle.value,
        description: inputDescription.value,
        code: inputCode.value,
        price: inputPrice.value,
        status: inputStatus.value,
        stock: inputStock.value,
        category: inputCategory.value,
        thumnails: inputThumbnails.value
    }
    socket.emit("addProduct", newProduct)
})


