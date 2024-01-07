
import request from "request";
import bodyParser from "body-parser";
import express from "express";
import fetch from "node-fetch";
import fs from "fs";
const app = express();

// site runner 

let intervalID;

function repeatEverySecond() {
  intervalID = setInterval(sendMessage, 120000);

}

function sendMessage() {
  console.log("called")
    fetch('https://chatgptmessenger-z472.onrender.com/')
    .then(response =>console.log("chat_server_is_running") )

   
}


repeatEverySecond()

app.set("port", process.env.PORT || 5000);

// Allows us to process the data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROUTES

app.get("/", function (req, res) {
  res.send("fucking chatbot 111");
});

// Initialize storedData with data from the file if available
let storedData = [];

const storedDataFilePath = 'storedData.txt';

// Read data from the file and initialize storedData
if (fs.existsSync(storedDataFilePath)) {
    const fileData = fs.readFileSync(storedDataFilePath, 'utf-8');
    try {
        storedData = JSON.parse(fileData);
    } catch (error) {
        console.error('Error parsing stored data file:', error);
    }
}

// Endpoint to receive data and store it in a text file
app.post('/storeData', (req, res) => {
    const newData = req.body;

    // Assuming newData has the format { name, ip, port }
    storedData.push(newData);

    // Update the text file with the new data
    fs.writeFileSync(storedDataFilePath, JSON.stringify(storedData));

    res.status(200).send('Data stored successfully');
});

// Endpoint to get all stored data
app.get('/getAllData', (req, res) => {
    res.json(storedData);
});


// all time listner 

app.listen(app.get("port"), function () {
  console.log("running: port");
});





