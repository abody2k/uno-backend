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
        
        //leave all other rooms

        for (const room of client.rooms){
            if (room != client.id){
                client.leave(room)
            }
        }


        
        
        //delete the room data of that user using his hash
        //put a timer on the room to delete it
        //make the player join the room
        if(!userHash)
            return

        client.join(userHash);
        client.send("l");

        

    });

    client.on("j",(data)=>{ // the second part of the data would be the username

        //leave all other rooms

        for (const room of client.rooms){
            if (room != client.id){
                client.leave(room)
            }
        }


        //read from data base all the other players info of this room
        //store the player name on firebase room details {username: socketID} io.sockets.sockets.get()
        
        //then send the data to all the other clients that someone is there and this is their name
        io.to(data.split(",")[0]).emit("jr");
        //join the room
        client.join(data.split(",")[0]);
        //send the other players info to this player regarding their names, the player will decide their
        //turn based on how many players joined before them
        client.send("n") // n stands for info which contains the other players' names



    });
    
    client.on("s",(roomID)=>{ // start the game

        //set the current player turn in firebase to 0
        //let the other players know it started given this playerID
        io.to(roomID).emit("s");



    })
})

server.listen(3000,()=>{


    console.log("started a new server ")
})
