
import request from "request";
import bodyParser from "body-parser";
import express from "express";
import fetch from "node-fetch";
const app = express();

// site runner 

let intervalID;

function repeatEverySecond() {
  intervalID = setInterval(sendMessage, 120000);
 intervalID = setInterval(sendIut, 120000);
}

function sendMessage() {
  console.log("called")
    fetch('https://chatgpt-messenger-dxpa.onrender.com')
    .then(response =>console.log("chat_server_is_running") )

   
}
function sendIut() {
  console.log("called iutcs")
   fetch('https://iut-cs-backend.onrender.com/api/blogs?populate=*')
    .then(response =>console.log(response) )
   
}

repeatEverySecond()

app.set("port", process.env.PORT || 5000);

// Allows us to process the data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROUTES

app.get("/", function (req, res) {
  res.send("fucking chatbot");
});



// all time listner 

app.listen(app.get("port"), function () {
  console.log("running: port");
});





