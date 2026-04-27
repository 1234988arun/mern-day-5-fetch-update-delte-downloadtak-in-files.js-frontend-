const toast = new Notyf({
      position: {
            x: 'center',
            y: 'top'    
            }
}
);

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
       const user = await axios.post("http://localhost:8080/signup", payload)
       console.log(user.data.message);
       toast.success(user.data.message);

       setTimeout(() => {
        location.href="/index.html"
       }, 2000);
       
    }
    catch(error){
        toast.error(error.response ? error.response.data.message : error.message);
    }


}
