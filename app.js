const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const mExp = require('mustache-express');

const app = express();

app.engine('mustache',mExp());

app.set('views',__dirname+"/views");
app.set('view engine',"mustache");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, function(){
    console.log("Server Started at 3000");
});

app.get('/', function(req,res){
    res.render("signup");
})



app.post('/',function(req,res){
    const fn = req.body.fn;
    const ln = req.body.ln;
    const em = req.body.em;

    const data = {
        members: [
            {
                email_address: em,
                status: "subscribed",
                merge_fields: {
                    FNAME: fn,
                    LNAME: ln
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/cd05e8d77e";
    const options = {
        method:"POST",
        auth: "rishav:16b594e3b592f404b0b5304ca1bf373e-us17"
    };

    var request = https.request(url,options, function(response){
        response.on("data",function(data){
            console.log("Contact Added");
            res.render('success');
        })
        response.on("error",function(error){
            console.log(error);
            res.render('failure')
        })
    })

    request.write(jsonData);
    request.end();
})
