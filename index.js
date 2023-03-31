import { Configuration, OpenAIApi } from "openai";
import request from "request";
import bodyParser from "body-parser";
import express from "express";

const app = express();

app.set("port", process.env.PORT || 5000);

// Allows us to process the data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROUTES

app.get("/", function (req, res) {
  res.send("fucking chatbot");
});

// variable and environment variables

let token = process.env.ACCESS_TOKEN;
let content;
let reply;

// openai configuration

const configuration = new Configuration({
  organization: "org-FxBSLK2LwmJEXT8gUALQSC0s",
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

// openai text

async function brain(sender) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: content }],
  });
  console.log(completion.data.choices[0].message);
  reply = completion.data.choices[0].message.content;
  console.log(`content :${content},reply :${reply}`);
  sendText(sender, reply);
}

// openai image
async function imageGenerator(sender,prompt) {
	console.log(`got the prompt inside image generator ${prompt}`);
	const result = await openai.createImage({
		prompt,
		n:1,
		size : "1024x1024",
		user: sender
	
	})
	const url = result.data.data[0].url;
	console.log(`got the url form chatgpt ${url}`)
	sendImage(sender,url);
  }
// Facebook webhook

app.get("/webhook/", function (req, res) {
  if (req.query["hub.verify_token"] === "blondiebytes") {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Wrong token");
});

// getting inbox 

app.post("/webhook/", function (req, res) {
  let messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    let event = messaging_events[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      console.log(` text: ${text} sender:${sender}`);
      content = text;
      console.log(`setting up the text : ${content}`);
	  if(text[0]==='/'){
		imageGenerator(sender,text);
	  } 
      else{
		brain(sender);
	  } 
    }
  }
  res.sendStatus(200);
});

// text send 

function sendText(sender, reply) {
  console.log(sender, reply);
  let messageData = { text: reply };
  console.log(`getting the messge reply: ${messageData}`);
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: token },
      method: "POST",
      json: {
        recipient: { id: sender },
        message: messageData,
      },
    },
    function (error, response, body) {
      if (error) {
        console.log("sending error");
      } else if (response.body.error) {
        console.log(response.body.error);
      }
    }
  );
}

// send image

function sendImage(sender, url) {
  console.log(`url got inside sendimage: ${url}`);
  request(
    {
      url: "https://graph.facebook.com/v2.10/me/message_attachments",
      qs: { access_token: token },
      method: "POST",
      json: {
        recipient: { id: sender },
        url: url,
      },
    },
    function (error, response, body) {
      if (error) {
        console.log("sending error");
      } else if (response.body.error) {
        console.log(response.body.error);
      }
    }
  );
}

app.listen(app.get("port"), function () {
  console.log("running: port");
});
