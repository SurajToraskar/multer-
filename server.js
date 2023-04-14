const express=require('express');
const multer=require('multer'); 
const uuid=require('uuid').v5;
const app=express();

app.use(express.json());

//single file
// const upload=multer({dest:"Uploads/"});
// app.post('/file',upload.single('files'),(req,resp)=>{
//     resp.json({success:"true"});
// })



//multiple file
// const upload=multer({dest:"Uploads/"})
// app.post('/uploads',upload.array('files',3),(req,resp)=>{
//     resp.json({"Success":"True"});
// })



// multiple fields
// const upload=multer({dest:"Uploads/"});
// const multiUpload=upload.fields([
//     {name:"avatar",maxCount:2},
//     {name:"profile-pic",maxCount:3}
// ])
// app.post('/upload',multiUpload,(req,resp)=>{
//     console.log(req.files);
//     resp.send(req.files);
//     resp.json({"Success":"True"});
// })



//storing file with user defined naming standard
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,"Uploads");
//     },
//     filename:function(req,file,cb){
//         // const {fieldname}=file;
//         const{originalname}=file;
//         cb(null,`${originalname}`);
//         // cb(null,`${fieldname}-${Date.now()}.pdf`);
//     }
// });
// const upload=multer({storage});
// app.post('/uploads',upload.array('files'),(req,resp)=>{
//     resp.json({"Success":"True"});
// })


//defining specific file to upload
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'Uploads');
    },
    filename:function(req,file,cb){
        const {originalname}=file;
        cb(null,`${originalname}`);
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.split("/")[0]=="image"){
        cb(null,true);
    }else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"),false);
    }
}



const upload=multer({storage,fileFilter,limits:{fileSize:1000000000,files:1}});
app.post('/uploads',upload.array('files'),(req,resp)=>{
    resp.json({"Success":"True"});
})

app.use((error,req,resp,next)=>{
    if(error instanceof multer.MulterError){
        if(error.code==="LIMIT_FILE_SIZE"){
            return resp.status(400).send({
                message:"file size is too large"
            });
        }
        if(error.code==="LIMIT_FILE_COUNT"){
            return resp.status(400).send({
                message:"file limit reached"
            })
        }
        if(error.code==="LIMIT_UNEXPECTED_FILE"){
            return resp.status(400).send({
                message:"file must be an image"
            })
        }
    }
})


app.listen(1000,()=>{console.log("Active")});