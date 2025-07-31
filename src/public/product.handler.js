const addButtons = document.querySelectorAll(".add")
addButtons.forEach(button =>{
        button.addEventListener("click", async ()=>{
            const pid = button.getAttribute("id")
            let cid = prompt("Insert your cart ID to add this product:")
            try {
                const addedproduct = await fetch(`/api/carts/${cid}/product/${pid}`,{
                    method: "POST"
                })
                const message = await addedproduct.text()
            alert(message)
            } catch (error) {
            alert("Error adding product to cart: " + error.message)
            }
        })
    }
)
