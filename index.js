const express = require('express');
const app = express();
const AWS = require('aws-sdk')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({extended:false}));
app.set("view engine", "ejs");
app.set("views","./views");

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2',
    accessKeyId: '',
    secretAccessKey: ''
})

app.get('/', (req, res) => {
    const params_scan ={
        TableName: "SanPham",
    };
    docClient.scan(params_scan,onScan)
    function onScan(err,data){
        if(err){
            console.log("Loi khi scan",JSON.stringify(err,null,2))
            res.send(err)
        }
        else{
            const list = data.Items
            console.log(list)
            res.render('trangchu', {list})
        }
    }
})

app.post('/add',(req,res)=>{    
    const masanpham = req.body.masanpham
    const tensanpham = req.body.tensanpham
    const soluong = req.body.soluong
    const params_add = {
    TableName: "SanPham",
    Item :{
        "masanpham" : masanpham,
        "tensanpham" : tensanpham,
        "soluong" :soluong,
       }
    }
    console.log(req);
    docClient.put(params_add,(err,data) =>{
        if(err){
            console.log("Loi khong the them  ",JSON.stringify(err,null,2))
            return res.json({msg:"false"})
        }
        else{
            console.log("Them thanh cong : ",JSON.stringify(data,null,2))
            return res.redirect('/')
        }
    })
})

app.get('/delete/:masanpham',(req,res)=>{
    const masanpham = req.params.masanpham
    const params_delete = {
        TableName :"SanPham",
        Key:{
            "masanpham":masanpham
        }
    };
    docClient.delete(params_delete,(err,data)=>{
        if(err){
            console.log("Loi khi xoa !!!",JSON.stringify(err,null,2))
            return res.json({msg:"false"})
        }
        else{
            console.log("Xoa thanh cong!!!",JSON.stringify(data,null,2))
            return res.redirect('/')
        }
    })
})
app.get('/deleteApi/:masanpham',(req,res)=>{
    const masanpham = req.params.masanpham
    const params_delete = {
        TableName :"SanPham",
        Key:{
            "masanpham":masanpham
        }
    };
    docClient.delete(params_delete,(err,data)=>{
        if(err){
            console.log("Loi khi xoa !!!",JSON.stringify(err,null,2))
            return res.json({msg:"loi khi xoa"})
        }
        else{
            console.log("Xoa thanh cong!!!",JSON.stringify(data,null,2))
            return res.json({msg:"Xoa Thanh cong"})
        }
    })
})



app.listen(3000, () => console.log(`Server connected port 3000`))