axios.defaults.baseURL = SERVER
const toast = new Notyf({
      position: {
            x: 'center',
            y: 'top'    
            }
}
);


//this is used because so user dont have to signup if user already signup and redirect to dashboard page automaticaly
const token = localStorage.getItem("authToken");
if (token) {
  location.href = "/dashboard";
}






async function signup(e){
    try{
        e.preventDefault();
        const form = e.target;
        const elements = form.elements
        const payload ={
            fullname:elements.fullname.value,
            mobile:elements.mobile.value,
            email:elements.email.value,
            password:elements.password.value
        }
        // console.log(payload)
       const user = await axios.post("/api/signup", payload)
       console.log(user.data.message);
       toast.success(user.data.message);

       setTimeout(() => {
        location.href="/login"
       }, 2000);
       
    }
    catch(error){
        toast.error(error.response ? error.response.data.message : error.message);
    }


}
