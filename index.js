let express = require("express")
let app = express()
let server = require("http").createServer(app)
let rooms = [];

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
        //store the player name on firebase room details {hashedIP : {username, cards}} 
        
        // room { current_turn, direction, current_card, playerscards:[hashedIp:[cards]], players:[{name:no of cards}] , playersIDs: {hashedIps}, league {playerwins}}

        /*we store the hashed ip so that every time some loses connection and joins the room again, they have
        the same ip, they check firebase, provide their ip and if it's there then the player can just join
        otherwise we need to insert his name and ip in the table to avoid duplications and lost data
        each player has number of cards as well and it saved within that place
        */
        
        //then send the data to all the other clients that someone is there and this is their name
        io.to(data.split(",")[0]).emit("jr",data.split(",")[1]);
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


    client.on("n",(data)=>{

        // the data contains the card

        //save it to firebase
        

        //send it to the other players
        io.to(client.rooms[1]).except(client.id).emit("n",data);
        //TODO  this logic is used so that when a player comes in they know what cards are there, turn direction,
        // current card and how many cards are in each player hand


        switch (data[0]) {
            case 'b': //it's a black card then the next value is either 4 or a new color

                if (data[1]=='4'){

                }else{

                }
                
                break;
        
            default:
                break;
        }

    })
})

server.listen(3000,()=>{


    console.log("started a new server ")
})
