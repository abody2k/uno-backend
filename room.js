

export function room() {
    return  {

    ct: 0, //current turn
    d:0, // direction
    db:0, //debt
    cc:"b4", // curent card
    l:[], // league
    pi:[],//players hashed IPs
    p:[], // player name : number of cards
    pc:[], //players cards, 
    g:0, // game started ,
    i:[], // socket ids


};

}


function doesAPlayerExist(room,hashedIP) {
    return ((room.pi).indexOf(hashedIP) == -1 ? false : true);
}


export function playerJoinsRoom(hashedIP,room,playerName, socketID) {

    const index = room.pi.indexOf(hashedIP);
    if (index >=0){
        room.i[index]= socketID;
        return [room.ct,room.d,room.cc,room.db,room.l,room.p,room.pc[index],index,room.g]; 
    }else{
        room.pi.push(hashedIP);
        room.l.push(0);
        room.p.push({[playerName]:7});
        room.pc.push([]);
        room.i.push(socketID);
        

        for (let index = 0; index < 7; index++) {

            if (Math.random()>= 0.7){ // black card
                if (Math.random()>= 0.5){ // +4
                    room.pc[room.pc.length-1].push("s4");
                }else{ //bc black color changer
                    room.pc[room.pc.length-1].push("sc");
                }
            }else{

                let random = Math.random();
                
                if (random <= 0.25){ //red

                    room.pc[room.pc.length-1].push("r"+numberType());

                }else if (random > 0.25 && random <= 0.5){ //yellow
                    room.pc[room.pc.length-1].push("y"+numberType());

                }else if (random > 0.5 && random <= 0.75){ // green
                    room.pc[room.pc.length-1].push("g"+numberType());

                }else{ // blue
                    room.pc[room.pc.length-1].push("b"+numberType());

                }
             
            }

            
            
        }

        return [room.ct,room.d,room.cc,room.db,room.l,room.p,room.pc[0],room.pi.length-1,0];


    }
    
}


function numberType() {

    let random = Math.random();
    
    if (random > 0.5){ // special card

        if (random <= 0.66){
            return "s";
        }else if (random > 0.66 && random <= 0.82){
            return "r";
        }else {
            return "+";
        }


    }else{ // just a number

        return Math.floor(Math.random() * 10).toString();
    }
    
}



export function withdrawCard(room,userIndex) {


    let pc=withdrawNCardsUser(room.db + 1,room,userIndex);
    console.log("new cards");
    
    console.log(pc);
    
    return [pc,room.pc[userIndex].length];
    

    


    
}

export function throwCard(room,userIndex,cardThrown,payload) {

    
    if(cardThrown[0]=="s"){ // special card

        if (cardThrown[1] =="4"){
            room.db += 4; 

        }else{
            if (room.db > 0){ // the player has to withdraw some cards
                withdrawNCardsUser(room.db,room,userIndex);
            }
            
        }
        room.cc = cardThrown + payload;
        if (room.d){
            room.ct -=1;
            room.ct = (room.ct <0) ? 0 : room.ct;
        }else{
            room.ct +=1;
            room.ct = (room.ct >= room.l.length) ? 0 : room.ct;
        }


        

    }else{


            if(cardThrown[0]==room.cc[room.cc[0]=="s" ? 2 : 0]){

                handleCardThrowing(room,cardThrown,userIndex);
            }else{
                if(cardThrown[1] == room.cc[1]){
                handleCardThrowing(room,cardThrown,userIndex);
                }
            }



        
    }

    room.pc[userIndex] = room.pc[userIndex].filter((a,i)=>i!=room.pc[userIndex].indexOf(cardThrown));
    if(room.pc[userIndex].length==0){
        room.l[userIndex]+=1;
    }
    return [room.ct,room.d,room.db,room.cc,room.pc[userIndex],room.pc[userIndex].length];
    
}



function withdrawNCards(n,room) {

         for (let index = 0; index < n; index++) {

            if (Math.random()>= 0.7){ // black card
                if (Math.random()>= 0.5){ // +4
                    room.pc[room.pc.length-1].push("s4");
                }else{ //bc black color changer
                    room.pc[room.pc.length-1].push("sc");
                }
            }else{

                let random = Math.random();
                
                if (random <= 0.25){ //red

                    room.pc[room.pc.length-1].push("r"+numberType());

                }else if (random > 0.25 && random <= 0.5){ //yellow
                    room.pc[room.pc.length-1].push("y"+numberType());

                }else if (random > 0.5 && random <= 0.75){ // green
                    room.pc[room.pc.length-1].push("g"+numberType());

                }else{ // blue
                    room.pc[room.pc.length-1].push("b"+numberType());

                }
             
            }

            
            
        }
        room.db =0;
}

function withdrawNCardsUser(n,room,userIndex) {

    let pushedCards = [];
         for (let index = 0; index < n; index++) {

            if (Math.random()>= 0.7){ // black card
                if (Math.random()>= 0.5){ // +4
                    room.pc[userIndex].push("s4");
                    pushedCards.push("s4");
                }else{ //bc black color changer
                    room.pc[userIndex].push("sc");
                    pushedCards.push("sc");
                }
            }else{

                let random = Math.random();
                
                if (random <= 0.25){ //red

                    room.pc[userIndex].push("r"+numberType());
                    
                    pushedCards.push(room.pc[userIndex][room.pc[userIndex].length-1]);

                }else if (random > 0.25 && random <= 0.5){ //yellow
                    room.pc[userIndex].push("y"+numberType());
                    pushedCards.push(room.pc[userIndex][room.pc[userIndex].length-1]);


                }else if (random > 0.5 && random <= 0.75){ // green
                    room.pc[userIndex].push("g"+numberType());
                    pushedCards.push(room.pc[userIndex][room.pc[userIndex].length-1]);

                }else{ // blue
                    room.pc[userIndex].push("b"+numberType());
                    pushedCards.push(room.pc[userIndex][room.pc[userIndex].length-1]);

                }
             
            }

            
            
        }
        room.db =0;

        return pushedCards;
}
function roomData(room,hashedIP){


    const index = room.pi.indexOf(hashedIP);
    if (index >=0){
        return [room.ct,room.d,room.cc,room.db,room.l,room.p,room.pc[index],index]; 
    }else{
        room.pi.push(hashedIP);
        room.l.push(0);
        room.p.push({[playerName]:7});
        room.pc.push([]);
        

        return [room.ct,room.d,room.cc,room.db,room.l,room.p,room.pc[0],0];


    }
}


function handleCardThrowing(room,cardThrown,userIndex) {
                    if(cardThrown[1]=="+"){
                    room.db+=2;  
                }else if (cardThrown[1]=="s"){

                if (room.d){
            room.ct = Math.abs((room.ct-2)%room.l.length);
        }else{
            room.ct = Math.abs((room.ct+2)%room.l.length);
        }
                withdrawNCardsUser(room.db,room,userIndex);
                return;

                } else if(cardThrown[1]=="r"){
                room.d = room.d == 0 ? 1 : 0;
                
                withdrawNCardsUser(room.db,room,userIndex);
                }
                else{
                withdrawNCardsUser(room.db,room,userIndex);

                }
                room.cc = cardThrown;
                if (room.d){
            room.ct -=1;
            room.ct = (room.ct <0) ? 0 : room.ct;
        }else{
            room.ct +=1;
            room.ct = (room.ct >= room.l.length) ? 0 : room.ct;
        }
        room.cc = cardThrown;
}


export function restartTheGame(room,roomID) {
    
    room.ct=0;
    room.d=0;
    room.db=0;
    room.cc = "b4";
    for (let i = 0; i < room.p.length; i++) {
        room.p[i]= {[Object.keys(room.p[i])[0]]:0};
    }
    for (let i = 0; i < room.pc.length; i++) {

        room.pc[i] = [];
        withdrawNCardsUser(7,room,i);
        
    }
}