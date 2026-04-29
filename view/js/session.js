axios.defaults.baseURL = SERVER

const getsession = async () => {
  const session = localStorage.getItem("authToken");

  if (!session) {
    location.href = "/login";
    return null;
  }

  try {
    const user = await axios.post(
      "/api/token/verify",
      { token: session }
    );
     return user.data
    // console.log("User verified:", user.data);

  } catch (error) {
    // ❌ don't blindly clear everything
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      location.href = "/login";
    } else {
      console.log("Network or server issue");
    }
  }
};

getsession();


const logout =()=>{
    localStorage.clear()
    location.href="/login"
}