const socket=io()

socket.on("hello",(arg)=>{
    alert(arg)
})

