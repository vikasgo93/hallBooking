let express = require('express');
let app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('views','./views');
app.set('view engine','pug');
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log(__dirname)

let bookInfo = [];
let roomInfo = [];
let roomNumber = 0;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vikasgo:Vikas0903@cluster0.gsfst.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


app.get('/createRoom', (req, res) => {
    res.render('createRoom')
});

app.post('/thanks', (req,res) => {
    client.connect(err => {
      const collection = client.db("hallAPI").collection("roomInfo");
      collection.estimatedDocumentCount().then((value) => {
        const roomConfig = {
            _id:value+1,
            seats: req.body.seats,
            reservationDetails:[],
            amenities:req.body.amenities,
            price: req.body.price,
            bookingStatus:null,
            roomName:req.body.roomName
          }
          collection.insertOne(roomConfig);
    })
        // perform actions on the collection object
        //client.close();
      });
      
    res.send("Thanks")
})

app.get('/bookRoom', (req, res) => {
    res.render('bookRoom')
});

app.post("/booking",(req, res) => {
    client.connect(err => {
        const collection = client.db("hallAPI").collection("bookingInfo");
        const collectionBook = client.db("hallAPI").collection("roomInfo");
        let startDate = req.body.startDate.split("/")[2] + "-" + req.body.startDate.split("/")[1]+ "-" + req.body.startDate.split("/")[0];
        let endDate = req.body.endDate.split("/")[2] + "-" + req.body.endDate.split("/")[1]+ "-" + req.body.endDate.split("/")[0];
        console.log(startDate, endDate);
        collectionBook.findOne({_id:parseInt(req.body.roomId)}).then((roomInfo) => {
          collection.findOne({roomNo:req.body.roomId}).then((value)=>{
            console.log(value)
            if(value == null){
              const bookConfig = {
                customerName: req.body.customerName,
                startDate:new Date(startDate),
                endDate:new Date(endDate),
                roomNo:req.body.roomId,
                roomName: roomInfo.roomName
            }
            collection.insertOne(bookConfig);
            //const collectionBook = client.db("hallAPI").collection("roomInfo");
            collectionBook.updateOne({_id:parseInt(req.body.roomId)},{$set:{bookingStatus:"yes"}},function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
          });
          collectionBook.updateOne({_id:parseInt(req.body.roomId)}, {$push:{reservationDetails:{customerName:req.body.customerName, startDate:startDate, endDate:endDate}}}, function(err, res){
              if (err) throw err;
              console.log("Document updated")
            });
            res.send("Done")
            } 
            else if(new Date(value.endDate) >= new Date(startDate)){
                res.send("Hall is Unavailable for Booking");
            } 
            else {
              const bookConfig = {
                customerName: req.body.customerName,
                startDate:new Date(startDate),
                endDate:new Date(endDate),
                roomNo:req.body.roomId,
                roomName: roomInfo.roomName
            }
            collection.insertOne(bookConfig);
            //const collectionBook = client.db("hallAPI").collection("roomInfo");
            collectionBook.updateOne({_id:parseInt(req.body.roomId)},{$set:{bookingStatus:"yes"}},function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
          });
          collectionBook.updateOne({_id:parseInt(req.body.roomId)}, {$push:{reservationDetails:{customerName:req.body.customerName, startDate:startDate, endDate:endDate}}}, function(err, res){
            if (err) throw err;
            console.log("Document updated")
          });
          res.send("Done")
        } 
        }).catch(err)
    })
  })
        })
        
  app.get("/getCustomerDetails", (req, res) => {
    client.connect(err => {
      const collection = client.db("hallAPI").collection("bookingInfo");
            collection.find({}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result)
              res.render('customerData',{"data":result})
            })
        })
    })

    app.get("/getRoomDetails", (req, res) => {
      client.connect(err => {
        const collection = client.db("hallAPI").collection("roomInfo");
              collection.find({}).toArray(function(err, result) {
                if (err) throw err;
                console.log(result)
                res.render('roomData',{"data":result})
              })
          })
    })

app.listen(8080);