export let room ={

    ct: 0, //current turn
    d:0, // direction
    db:0, //debt
    cc:"b4", // curent card
    l:[], // league
    pi:[],//players hashed IPs
    p:[], // player name : number of cards
    pc:[] //players cards, 


};


function doesAPlayerExist(room,hashedIP) {
    return ((room.pi).indexOf(hashedIP) == -1 ? false : true);
}


export function playerJoinsRoom(hashedIP,room,playerName) {

    const index = room.pi.indexOf(hashedIP);
    if (index >=0){
        return [room.ct,room.d,room.cc,room.db,room.l,room.p,room.pc[index],index]; 
    }else{
        room.pi.push(hashedIP);
        room.l.push(0);
        room.p.push({[playerName]:7});
        room.pc.push([]);
        

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

        return [room.ct,room.d,room.cc,room.db,room.l,room.p,room.pc[0],0];


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