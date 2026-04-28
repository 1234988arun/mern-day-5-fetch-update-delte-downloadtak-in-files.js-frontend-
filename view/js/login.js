axios.defaults.baseURL = SERVER

const toast = new Notyf({
      position: {
            x: 'center',
            y: 'top'    
            }
}
);

//this is used because so user dont have to login if user already login and redirect to dashboard page automaticaly
const token = localStorage.getItem("authToken");
if (token) {
  location.href = "/dashboard";
}


const login=async(e)=>{
    try{
        e.preventDefault();
        
        const form = e.target;
        const elements = form.elements;
        
        const payload ={
            email:elements.email.value,
            password:elements.password.value
        }
        
        const user = await axios.post("/api/login", payload);
        // console.log(user.data.message);
        toast.success(user.data.message);
        localStorage.setItem("authToken", user.data.token)
         
        
         
        setTimeout(()=>{
         location.href="/dashboard"
        },2000) 
    }
    catch(error){
        // console.log(error.response.data.message);
        toast.error(error.response ? error.response.data.message: error.message)
    }
}