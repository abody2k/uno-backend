let express = require("express")
let app = express()
let server = require("http").createServer(app)

app.use(express.json())
let io = require("socket.io")(server)


const crypto = require("crypto");

function getIPHash(ip) {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 12);
}


const { v4: uuidv4 } = require('uuid');

function generateUserId() {
  return uuidv4(); // returns a UUID v4
}




io.on("connection",(client)=>{

    // //each player should have a unique ID stored on their device and is created upon starting the game
    // client.send("u"+ generateUserId());


    const ip =
    client.handshake.headers['x-forwarded-for']?.split(',').shift() ||
    client.conn.remoteAddress;

  console.log("User connected from IP:", ip);
  console.log(getIPHash(ip));
  //after getting the IP, store it on firebase in users and store it locally to identify each user with its socket
  //each time a user makes a new room the old data is purged
  client.send("i"+getIPHash(ip))
  


    client.on("mr",(userHash)=>{
        
        console.log("user is trying to make a new room");
        console.log(userHash);
        
        
        //delete the room data of that user using his hash
        //put a timer on the room to delete it
        //make the player join the room
        if(!userHash)
            return

        client.join(userHash);
        client.send("l")
        

    })
    
})

server.listen(3000,()=>{


    console.log("started a new server ")
})
