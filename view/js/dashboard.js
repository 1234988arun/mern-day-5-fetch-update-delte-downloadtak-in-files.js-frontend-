window.onload=()=>{
    userProfile()
}


const userProfile =async()=>{
const Session = await getsession();
console.log(Session);
const ProfileName = document.getElementById("profile_name");
const ProfileEmail = document.getElementById("profile_email");
ProfileName.innerHTML = Session.fullname;
ProfileEmail.innerHTML = Session.email;
}