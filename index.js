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

const app = express()
app.listen(process.env.PORT)

// first check if we have work of authentication 
// mvc+endpoint

//middleware
app.use(express.static("view"))//use for direct index.html ko chalana http://localhost:8080/ port pe
app.use(express.json());// they are used because so we get the data from the request.body
app.use(express.urlencoded({ extended: false }));// they are used because so we get the data from the request.body

// endpoints 
app.post("/signup", signup)
app.post("/login", login)
app.post("/file",upload.single('file'),createFile)
app.get("/file",fetchFile)
app.delete("/file/:id",deleteFile)
app.get("/file/download/:id", downloadFile)


