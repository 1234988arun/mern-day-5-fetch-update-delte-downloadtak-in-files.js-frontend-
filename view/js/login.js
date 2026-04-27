const toast = new Notyf({
      position: {
            x: 'center',
            y: 'top'    
            }
}
);


const login=async(e)=>{
    try{
        e.preventDefault();
        
        const form = e.target;
        const elements = form.elements;
        
        const payload ={
            email:elements.email.value,
            password:elements.password.value
        }
        
        const user = await axios.post("http://localhost:8080/login", payload);
        // console.log(user.data.message);
        toast.success(user.data.message);

        setTimeout(()=>{
         location.href="/app/dashboard.html"
        },2000) 
    }
    catch(error){
        // console.log(error.response.data.message);
        toast.error(error.response ? error.response.data.message: error.message)
    }
}