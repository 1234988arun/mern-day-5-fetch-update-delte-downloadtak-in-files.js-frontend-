const dotenv = require("dotenv");
dotenv.config()

const mongoose = require("mongoose")
mongoose.connect(process.env.DB)

//for file uploading middleware
const multer  = require('multer')
const { v4: uniqueId } = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, 'files/')
  },
  filename: function (req, file, next) {
    //   console.log(file);
    const name = `${uniqueId()}.${file.originalname.split(".").pop()}`
    // console.log(name);
    next(null, name);
  }
})
const upload = multer({ storage: storage })


const express = require("express");
const {signup,login} = require("./controller/user.controller");
const {createFile,fetchFile, deleteFile, downloadFile} = require("./controller/file.controller");
const verifyToken = require("./controller/token.controller");

const app = express()
app.listen(process.env.PORT)

// first check if we have work of authentication 
// mvc+endpoint

//middleware
app.use(express.static("view"))//use for direct index.html ko chalana http://localhost:8080/ port pe
app.use(express.json());// they are used because so we get the data from the request.body
app.use(express.urlencoded({ extended: false }));// they are used because so we get the data from the request.body

const root = process.cwd()
const path = require("path");

// ui endpoints

// signup
app.get("/signup",(req,res)=>{
  const urlpath = path.join(root,"view", "signup.html")
  res.sendFile(urlpath);
})

//login
app.get("/login",(req,res)=>{
  const urlpath = path.join(root,"view", "index.html")
  res.sendFile(urlpath);
})

app.get("/",(req,res)=>{
  const urlpath = path.join(root,"view", "index.html")
  res.sendFile(urlpath);
})

//dashboard
app.get("/dashboard",(req,res)=>{
  const urlpath = path.join(root,"view/app", "dashboard.html")
  res.sendFile(urlpath);
})

//history
app.get("/history",(req,res)=>{
  const urlpath = path.join(root,"view/app", "history.html")
  res.sendFile(urlpath);
})

// files 
app.get("/files",(req,res)=>{
  const urlpath = path.join(root,"view/app", "files.html")
  res.sendFile(urlpath);
})


// apiendpoints 
app.post("/api/signup", signup)
app.post("/api/login", login)
app.post("/api/file",upload.single('file'),createFile)
app.get("/api/file",fetchFile)
app.delete("/api/file/:id",deleteFile)
app.get("/api/file/download/:id", downloadFile)
app.post("/api/token/verify", verifyToken)


