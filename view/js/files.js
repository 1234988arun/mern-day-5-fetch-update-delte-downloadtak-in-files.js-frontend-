axios.defaults.baseURL = SERVER

const toast = new Notyf({
      position: {
            x: 'center',
            y: 'top'    
            }
}
);

window.onload=()=>{
    userProfile()
    fetchFiles()
}

const toggleDrawer = ()=>{
    const drawer = document.getElementById("drawer")
    const rightValue = drawer.style.right
    
    if(rightValue === "0px")
    {
        drawer.style.right = "-33.33%"
    }
    else {
        drawer.style.right = "0px"
    }
}

const userProfile =async()=>{
const Session = await getsession();
// console.log(Session);
const ProfileName = document.getElementById("profile_name");
const ProfileEmail = document.getElementById("profile_email");
ProfileName.innerHTML = Session.fullname;
ProfileEmail.innerHTML = Session.email;
}
const getSize =(Size)=>{
const mb = (Size/1000)/1000
return mb.toFixed(1);
}

const uploadFile = async(e)=>{
    try{
            e.preventDefault();
            const form = e.target;
            const uploadBtn = document.getElementById("uploadBtn");
            uploadBtn.disabled = true;   // 2️⃣ yahan lagao (perfect)
                uploadBtn.innerHTML = "Uploading..."; // ✅ yahan
        const progressBar = document.getElementById("progressBar");

        const file = form.elements.file.files[0];
        // console.log(file);

        // checking for fiesize
        const fileSize = Math.floor(getSize(file.size))
        // console.log(fileSize);
        if(fileSize>3)
            return toast.error("file size can't be greater than 2 mb");


        // console.log(file);// agar kisi bhi form m file + upload file hai to hmesha file ka type multipart.formdata hoga or wo file const new FormData()  se hi jaygi
        const formData = new FormData(form)// is se form ka pura data chlejayga ye multipart data ko bhejne m help krta  h
        const options ={
            onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );

                progressBar.style.width = percent + "%";
                // optional text:
            }
        }

        const {data} = await axios.post("/api/file", formData, options);
        // // console.log(data);

        
        toast.success(`${data.filename} submitted successfully`)
        progressBar.style.width = "0%"; // reset
        progressBar.innerHTML = ""
        form.reset();
        toggleDrawer();
        fetchFiles()
        }
        catch(err){
            toast.error(err.response ? err.response.data.message: err.message)
        }
        finally{
                    uploadBtn.disabled = false; // ✅ hamesha wapas enable
                    uploadBtn.innerHTML = "Upload Now"; // ✅ wapas normal
        }
}


const fetchFiles =async()=>{
try{
    const {data} = await axios.get("/api/file");
    const table = document.getElementById('data_table')
    // console.log(data);
        table.innerHTML = ""; // ✅ purana data clear
    data.map((items)=>{
    //   console.log(items);
    const ui = `
                        <tr class="text-gray-500 border-b border-gray-100">
                        <td class="py-4 pl-6">${items.filename}</td>
                        <td>${items.type}</td>
                        <td>${getSize(items.size)} MB</td>
                        <td>${moment(items.createdAt).format('Do MMMM YYYY, h:mm a')}</td>
                        <td>
                            <div class="space-x-3">
                                <button class="bg-rose-400 px-2 py-1 text-white hover:bg-rose-600 rounded" onclick="deleteFiles('${items._id}','${items.filename}',this)"> 
                                    <i class="ri-delete-bin-4-line"></i>
                                </button>

                                <button class="bg-green-400 px-2 py-1 text-white hover:bg-green-500 rounded" id="downloadBtn" onclick="downloadFiles('${items._id}','${items.filename}' , this)"> 
                                    <i class="ri-download-line"></i>
                                </button>

                                <button class="bg-amber-400 px-2 py-1 text-white hover:bg-amber-600 rounded"> 
                                    <i class="ri-share-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>

    `
    table.innerHTML += ui
    }
  )
}
catch(err){
            toast.error(err.response ? err.response.data.message: err.message)
}
}

const deleteFiles =async(id,filename,btn)=>{
    try{
        // alert(id);
        btn.innerHTML = '<i class="ri-loader-4-line animate-spin inline-block"></i>';
        btn.disabled = true;
        const {data} = await axios.delete(`/api/file/${id}`)
        console.log(data);
                toast.success(`${filename}  deleted successfully`);
        fetchFiles()
    }
    catch(err){
        toast.error(err.response? err.response.data.message: err.response)
    }
    finally{
        btn.innerHTML = '<i class="ri-delete-bin-4-line"></i>'   
        btn.disabled = false;
    }

}

const downloadFiles =async(id,filename,btn)=>{
// console.log(btn);
    try{
        btn.innerHTML = '<i class="ri-loader-4-line animate-spin inline-block"></i>';
        btn.disabled = true;
        const options ={
            responseType:'blob'
        }
        const {data} = await axios.get(`api/file/download/${id}`, options)
        const ext = data.type.split("/").pop()
        // console.log(data);// we  see that data comes in binary format 
        const url = URL.createObjectURL(data);
        // console.log(url);
        const a = document.createElement("a");
        a.href = url
        a.download = `${filename}.${ext}`
        a.click()
        a.remove()
    }
    catch(err){
        // console.log(err);// we deted the file from folders and we can't see the error due to response type blob 
        if(!err.response)
           return toast.error(err.message)

         const error = await err.response.data.text();
         const {message} = JSON.parse(error);
         toast.error(message);
           
    }
    finally{
        btn.innerHTML = '<i class="ri-download-line"></i>'   
        btn.disabled = false;
    }
}




