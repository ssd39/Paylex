const express = require('express')
const fetch = require('node-fetch')
const crypto = require('crypto');
const fs = require('fs');
var cors = require('cors')
const admin = require("firebase-admin");
const jwt_decode = require("jwt-decode");
const jwt = require('jsonwebtoken');
var { MongoClient, ServerApiVersion } = require('mongodb');

const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express()
const port = process.env.PORT || 5000
app.use(cors())
const jwt_secret_key = ""
const accessKey = ""
const secretKey = ""
const base_uri = "https://sandboxapi.rapyd.net/v1";

var mongo_client = null;

function generateRandomString(size) {
    try {
        return crypto.randomBytes(size).toString('hex');
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}

function generateAccessToken(username) {
    return jwt.sign({ username }, jwt_secret_key, { expiresIn: '30d' });
}

async function authMiddleWare(req, res, next) {
    let jwt_token = req.headers['jwt']
    if (jwt_token) {
        try {
            var decoded = jwt.verify(jwt_token, jwt_secret_key);
            let users = mongo_client.db("paylex").collection("users");
            let user_ = await users.findOne({ userId: decoded['username'] })
            if (user_) {
                req['user'] = user_;
                console.log(user_)
                next()
            } else {
                res.json({ "status": false, "message": "404" })
            }
        } catch (e) {
            console.error(e)
            res.json({ "status": false, "message": "404" })
        }
    } else {
        res.json({ "status": false, "message": "404" })
    }
}


function sign(method, urlPath, salt, timestamp, body) {

    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString == "{}" ? "" : bodyString;
        }

        let toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;
        console.log(`toSign: ${toSign}`);

        let hash = crypto.createHmac('sha256', secretKey);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64")
        console.log(`signature: ${signature}`);

        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}

async function getAvailableCountries(){
  
    let salt = generateRandomString(8);
    let timestamp = Math.round(new Date().getTime() / 1000);
    let signature = sign('GET', '/v1/data/countries', salt, timestamp, {})
    let idempotency = new Date().getTime().toString();

    var myHeaders = new fetch.Headers();
    myHeaders.append("access_key", accessKey);
    myHeaders.append("salt", salt);
    myHeaders.append("timestamp", timestamp);
    myHeaders.append("signature", signature);
    myHeaders.append("idempotency", idempotency);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    let req = await fetch(`${base_uri}/data/countries`, requestOptions)
    let res_json = await req.json()
    return res_json;
}

async function getAvailablePaymentMeyhods(){

  let salt = generateRandomString(8);
  let timestamp = Math.round(new Date().getTime() / 1000);
  let signature = sign('GET', '/v1/payment_methods/country?country=US', salt, timestamp, {})
  let idempotency = new Date().getTime().toString();

  var myHeaders = new fetch.Headers();
  myHeaders.append("access_key", accessKey);
  myHeaders.append("salt", salt);
  myHeaders.append("timestamp", timestamp);
  myHeaders.append("signature", signature);
  myHeaders.append("idempotency", idempotency);
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  let req = await fetch(`${base_uri}/payment_methods/country?country=US`, requestOptions)
  let res_json = await req.json()
  
  let x= []
  for(let d of res_json['data']){
      x.push(d['type'])
  }
  console.log(x)

  return res_json;
}
async function createChackout(amount,mid){
  
  var raw = {
    "amount": amount,
    "complete_payment_url": "http://example.com/complete",
    "country": "US",
    "currency": "USD",
    "error_payment_url": "http://example.com/error",
    "merchant_reference_id": mid,
    "cardholder_preferred_currency": true,
    "language": "en",
    "metadata": {
      "merchant_defined": true
    },
    "payment_method_types_include": [
      'us_visa_card',
      'us_atmdebit_card',
      'us_mastercard_card',
      'us_debit_discover_card'
    ],
    "payment_method_types_exclude": []
  };

  let salt = generateRandomString(8);
  let timestamp = Math.round(new Date().getTime() / 1000);
  let signature = sign('POST', '/v1/checkout', salt, timestamp, raw)
  let idempotency = new Date().getTime().toString();
  let json_body = JSON.stringify(raw)

  var myHeaders = new fetch.Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("access_key", accessKey);
  myHeaders.append("salt", salt);
  myHeaders.append("timestamp", timestamp);
  myHeaders.append("signature", signature);
  myHeaders.append("idempotency", idempotency);
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: json_body,
    redirect: 'follow'
  };
  
  let req = await fetch(`${base_uri}/checkout`, requestOptions)
  let res_json = await req.json()
  return res_json;
}

app.use(express.json());

app.get('/', (req, res) => {
res.send('Hello World!')
})

app.post('/create_payment',authMiddleWare, async (req,res)=>{
  let amount = req.body.amount;
  if(amount){
      let id = generateRandomString(8);
      let from = req['user']['userId']
      let transactions = mongo_client.db("paylex").collection("transactions");
      let users = mongo_client.db("paylex").collection("users");
      let merchent =  await users.findOne({ userId: from })
      await transactions.insertOne({ 
          transactionId: id, from,from_name:merchent['name'], amount: parseInt(Math.abs(amount)), status: false
      })
      res.json({"status":true, "data":{
          transactionId: id
      } })
      return;
  }
  res.json({"status":false,"message":"Amount missing."})    
})

app.post('/get_payment',authMiddleWare, async (req,res)=>{
  let paymentId = req.body.paymentId;
  if(paymentId){
      let transactions = mongo_client.db("paylex").collection("transactions");
      let transaction = await transactions.findOne({transactionId: paymentId})
      if(transaction && !transaction['status']){
          res.send({"status":true, data:transaction})
          return
      }else{
          res.json({"status":false,"message":"Trasnaction not found."})  
          return  
      }
  }
  res.json({"status":false,"message":"PaymentId missing."})    

})

app.get('/usertrans', authMiddleWare, async (req, res) => {
  try {
      let data;
      let transactions = mongo_client.db("paylex").collection("transactions");
      data = await transactions.find({"to":req.user.userId}).toArray()
   
      res.json({status:true,data:data})


  }
 catch(e){
  console.error(e)
  res.json({ "status": false, "message": "Authentication Error." })
  return

 } 
})

app.post('/confirm_payment',authMiddleWare, async (req,res)=>{
  let paymentId = req.body.paymentId;
  if(paymentId){
      let transactions = mongo_client.db("paylex").collection("transactions");
      let transaction = await transactions.findOne({transactionId: paymentId})
      if(transaction && !transaction['status']){
          let user = req['user']
          user['deposit'] = parseInt(user['deposit'])
          user['spent'] = parseInt(user['spent'])
          transaction['amount'] = parseInt(transaction['amount'])
          if((user['deposit']-user['spent'])>=transaction['amount']){
              console.log('here')
              let spent = user['spent'] + transaction['amount'];
              let users = mongo_client.db("paylex").collection("users");
              let merchent =  await users.findOne({ userId: transaction['from'] })
              let withdraw_balance = parseInt(merchent['withdraw_balance']) + transaction['amount'];
              await users.updateOne({ userId: user['userId'] }, { $set:{ spent } })
              await users.updateOne({ userId: merchent['userId'] }, { $set:{ withdraw_balance } })
              await transactions.updateOne({ transactionId: paymentId }, { $set:{ status: true , to: user['userId'], name:  user['name'] } })
              res.json({"status":true,"data": 1})
          }else{
              res.json({"status":true,"data": 2})  
          }
          return
      }else{
          res.json({"status":false,"message":"Trasnaction not found."})  
          return  
      }  
  }
})

app.post('/webhook',async (req,res)=>{
  try{
      let timestamp = req.headers['timestamp'];
      let salt = req.headers['salt'];
      let signature = req.headers['signature'];
      let local_signature = sign('POST', 'https://paylex.herokuapp.com/webhook', salt, timestamp, req.body)
      if(true /*signature==local_signature*/){
          console.log('webhook verified!')
          if(req.body['type']=="PAYMENT_SUCCEEDED"){
              let refId = req.body['data']['merchant_reference_id']
              let deposits = mongo_client.db("paylex").collection("deposits");
              let deposit  =  await deposits.findOne({referenceId:refId})
              console.log('Deposit: ' + JSON.stringify(deposit))
              if(deposit){
                  let userId = deposit['userId']
                  await deposits.updateOne({ referenceId:refId }, { $set:{ status: true} })
                  let users = mongo_client.db("paylex").collection("users");
                  let user_ = await users.findOne({userId})
                  if(user_){
                      deposit['amount'] = parseInt(deposit['amount'])
                      let deposit_ = parseInt(user_['deposit']);
                      let spent = parseInt(user_['spent'])
                      if(deposit['amount']>=spent){
                          deposit['amount'] -= spent;
                      }
                      if(deposit_==-1){
                          deposit_ = 0;
                      }
                      deposit_ += deposit['amount']
                      await users.updateOne({userId},{ $set:{deposit:deposit_, spent: 0 }})
                  }
              }
          }
          res.send(200)
      }else{
          res.status(403).send()
      }
  }catch(e){
      console.error("POST /webhook --> " + e)
      res.status(403).send()
  }  
})

app.post('/login', async (req, res) => {
  if(req.body.idToken){
      try{
          let idToken = req.body.idToken;
          let user = await admin.app().auth().verifyIdToken(idToken)
          let users = mongo_client.db("paylex").collection("users");
          let user_ = await users.findOne({userId: user['user_id']})

          let data = {
              name: user['name'],
              userId: user['user_id'],
              email: user['email'],
              picture: user['picture'],
              deposit: -1,
              spent: 0,
              withdraw_balance: 0 
          }
          if(!user_){
              await users.insertOne(data)
          }else{
              data['deposit'] = parseInt(user_['deposit'])
              data['spent'] = parseInt(user_['spent'])
              data['withdraw_balance'] = parseInt(user_['withdraw_balance'])
          }
          let jwt = generateAccessToken(user['user_id'])
          console.log(jwt)
          data['jwt'] = jwt;
          res.json({"status":true,"data": data})
          return
      }catch(e){
          console.error(e)
          res.json({"status":false,"message":"Authentication Error."})
          return
      }
  }
  res.json({"status":false,"message":"idToken not found."})

})

app.post('/deposit', authMiddleWare, async (req, res) => {
  if(req.body.amount){
      try{
          let amount = req.body.amount;
          let mid = generateRandomString(8);
          let rapyd_checkout_res = await createChackout(parseInt(Math.abs(amount)), mid)
          let deposits = mongo_client.db("paylex").collection("deposits");
          let data ={
              checkout_id: rapyd_checkout_res['data']['id'],
              amount,
              userId: req['user']['userId'],
              status: false,
              referenceId :mid
          }
          await deposits.insertOne(data)
          res.json({"status":true, "data":{
              "checkout_id":rapyd_checkout_res['data']['id']
          }})
          return;
      }catch(e){
          console.error("[Error] /deposit" +" --> " + e);
      }
  }
  res.json({"status":false,"message":"Please provide deposit amount."})
})



///****************Don't Touch From Here ******************************////


app.post('/loginadmin', async (req, res) => {
    if (req.body.idToken) {
        try {
            let idToken = req.body.idToken;
            let user = jwt_decode(req.body.idToken);
            console.log(user.sub)
            let users = mongo_client.db("paylex").collection("users");
            let user_ = await users.findOne({ userId: user['sub'] })
            console.log(user_)
            let data = {
                name: user['name'],
                userId: user['sub'],
                email: user['email'],
                picture: user['picture'],
                deposit: -1,
                spent: 0,
                withdraw_balance: 0
            }
            if (!user_) {
                console.log("we are here")
                await users.insertOne(data)
            } else {
                data['deposit'] = parseInt(user_['deposit'])
                data['spent'] = parseInt(user_['spent'])
                data['withdraw_balance'] = parseInt(user_['withdraw_balance'])
            }
            let jwt = generateAccessToken(user['sub'])
            data['jwt'] = jwt;
            res.json({ "status": true, "data": data })
            return
        } catch (e) {
            console.error(e)
            res.json({ "status": false, "message": "Authentication Error." })
            return
        }
    }
    res.json({ "status": false, "message": "idToken not found." })

})


app.get('/useradmin', authMiddleWare, async (req, res) => {
  
    let users = mongo_client.db("paylex").collection("transactions");
    let totalpay = await users.count({from : req.user.userId })
    let successpay = await users.count({from : req.user.userId,status:true })
    console.log(totalpay)
    data = {
        ...req.user,
        payments:totalpay,
        successpay:successpay


    }
    res.json({ "status": true, "data": data })

})

app.get('/admintrans', authMiddleWare, async (req, res) => {
    try {
        let data;
        let transactions = mongo_client.db("paylex").collection("transactions");
        data = await transactions.find({"from":req.user.userId}).toArray()
     
        res.json({status:true,data:data})


    }
   catch(e){
    console.error(e)
    res.json({ "status": false, "message": "Authentication Error." })
    return

   } 
})

app.get('/admintransuccess', authMiddleWare, async (req, res) => {
    try {
        let data;
        let transactions = mongo_client.db("paylex").collection("transactions");
        data = await transactions.find({"from":req.user.userId,status:true}).toArray()
     
        res.json({status:true,data:data})


    }
   catch(e){
    console.error(e)
    res.json({ "status": false, "message": "Authentication Error." })
    return

   } 
})

app.get('/usertrans', authMiddleWare, async (req, res) => {
    try {
        let data;
        let transactions = mongo_client.db("paylex").collection("transactions");
        data = await transactions.find({"to":req.user.userId}).toArray()
     
        res.json({status:true,data:data})


    }
   catch(e){
    console.error(e)
    res.json({ "status": false, "message": "Authentication Error." })
    return

   } 
})







app.listen(port, async () => {
    const uri = "";
    mongo_client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
    /*let countries = await getAvailableCountries()
    fs.writeFile('countries.json',JSON.stringify(countries) , function (err) {
        if (err) throw err;               
        console.log('Results Received');
    });*/
    /*let paymentMethods = await getAvailablePaymentMeyhods()
    fs.writeFile('payment_methods.json',JSON.stringify(paymentMethods) , function (err) {
        if (err) throw err;               
        console.log('Results Received');
    });*/
    console.log(`Example app listening on port ${port}`)
})

