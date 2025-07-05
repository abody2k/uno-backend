"# uno-backend" 


a back end for the UNO game.

it can host about as many players as possible in 1 room.


for testing purposes you can uncomment the
```bash
    client.send("i"+getIPHash((Math.random()*19990).toString()))

```

and comment the 

```bash
   client.send("i"+getIPHash(ip))

```

it hashes the user IP so that a user can create one and only one room while perserving their privacy.
