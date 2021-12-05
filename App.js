const express =require('express');
const mongoose=require('mongoose');
const PORT=8899;
const app=express();
const regForName = RegExp(/^[A-Za-z]{3,10}$/);
const regForCity = RegExp(/^[A-Za-z]{3,20}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPhone=RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/)
const db="mongodb://localhost:27017/UserInfo";
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')


const connectDB=async()=>{
    try{
        await mongoose.connect(db,{useNewUrlParser:true});
        console.log("MongoDB connected")
    }
    catch(err){
        console.log(err.message)
    }
}
connectDB();

const catModel=require('./db/userschema')
// app.get("/",(req,res)=>{

//     catModel.find({},(err,data)=>{
//         if(err) throw err;
//         else{
//             res.render('userdata',{root:'.'})
//         }
//     })
// })

app.get('/',(req,res)=>{
    const error={fname:'',lname:'',email:'',mobile:'',city:''}
    res.render('userdata',({error:error}))
})
app.post('/adddata',(req,res)=>{
    const error={fname:'',lname:'',email:'',mobile:'',city:''}
    error.fname=regForName.test(req.body.fname)?'':'Please Enter First Name'
    error.lname=regForName.test(req.body.lname)?'':'Please Enter Last Name'
    error.email=regForEmail.test(req.body.email)?'':'Please Enter Valid Email Address'
    error.mobile=regForPhone.test(req.body.mobile)?'':'Please Enter Valid Phone'
    error.city=regForCity.test(req.body.city)?'':'City Character length Must be 3 to 20 '
    if(error.fname!==''||error.lname!=='' || error.email!==''||error.mobile!=='' || error.city!==''){
        res.render('userdata',({error:error}))
        console.log(error)
    }

    else{
         console.log(req.body)
    let fname=req.body.fname;
    let lname=req.body.lname
    let email=req.body.email;
    let mobile=req.body.mobile;
    let city=req.body.city;
    //insert data
    let ins=new catModel({fname:fname,lname:lname,email:email,mobile:mobile,city:city});
    ins.save((err)=>{
        if(err){ res.send("Already Added")}
        else{
        res.redirect('/list')
        }
    })
    }

})




app.get("/list",(req,res)=>{
    catModel.find({},(err,data)=>{
        if(err) throw err;
        else{
        res.render('List',{data});
        }
    })
})


app.get('/getdata', (req, res) => {
    catModel.find({}, (err, data) => {
        if (err) throw err;
        res.send(data)
    })
})

app.get("/deletedata/:id",(req,res)=>{
    let id=req.params.id;
    catModel.deleteOne({_id:id},(err)=>{
        if(err) throw err 
        res.redirect("/list")
    })
})

app.get('/getdata/:id', (req, res) => {
    let id = req.params.id;
    catModel.find({ _id: id }, (err, data) => {
        if (err) throw err;
        res.render('updateform', { data: data[0] });
    })
})

app.post("/updatedata/:id",(req,res)=>{
    let id=req.params.id;
    let fname=req.body.fname;
    let lname=req.body.lname;
    let email=req.body.email;
    let mobile=req.body.mobile;
    let city=req.body.city;
    catModel.updateOne({_id:id},{$set:{fname:fname,lname:lname,email:email,mobile:mobile,city:city}},(err)=>{
        if(err) throw err;
        else{
            res.redirect('/list');
        }
    })
})
app.listen(PORT,(err)=>{
    if(err) throw err
    console.log("working on 8899")
})


