const fileModel = require("../model/file.model")
const path = require("path")
const fs = require("fs");//used to delete file from files folder

//frontend se toggle bar se file create ki
const createFile = async(req,res)=>{
    try{
        //  const file = await fileModel.create(req.file)
        //  console.log(file)//for reading the file or storing the file we have to use multer go to index.js
        // console.log(req.file);
        // res.send("success");
        // console.log(req.body);
        const file = req.file
        const {filename} = req.body
        const payload ={
        path:file.destination+file.filename,
        filename:filename,
        type:file.mimetype.split("/")[0],
        size:file.size
        }

        const x = await fileModel.create(payload)
        // console.log(x)
        res.send(x);
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

// frontend se toggle bar se jo file create ki use fetch/show kraya 
const fetchFile = async(req,res)=>{
    try{
        const files = await fileModel.find()
        // console.log(x);
        res.send(files);
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

//frontend m delete ka code  use krna hai 
const deleteFile = async(req,res)=>{
    try{
        // console.log(req.params);
        const {id} = req.params;
        const files = await fileModel.findByIdAndDelete(id)

        if(!files)
           return res.status(404).json({message:"file not found"})
// we see that files is dlete from db but not from files folder 
         
        fs.unlinkSync(files.path)//due to these files is deleted from files folder

        res.status(200).json({message:files})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

//frontend m download ka code  use krna hai 
const downloadFile = async(req,res)=>{
    try{
      const {id} = req.params;
      const files = await fileModel.findById(id)
      if(!files)
           return res.status(404).json({message:"file not found"}
        )
      const rootPath = process.cwd();
      const filePath = path.join(rootPath,files.path)
      //   console.log(filePath);
      res.download(filePath, (err) => {
            if (err) {
                console.log("Download error:", err);
                return res.status(500).json({ message: "download file missing" });
            }
        });

    }
    catch(err){
    res.status(500).json({message:err.message})
    }
}

module.exports = {createFile,fetchFile,deleteFile, downloadFile}
