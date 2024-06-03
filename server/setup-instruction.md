# Setup Server

Create _**/server**_ folder</br>
While inside _**/server**_ folder...

1. Run `npm init -y` to create and initialize _**package.json**_ file.

2. Change _scripts_ value inside _**package.json**_ as following:

   ```json
   "scripts": {
       "start": "nodemon index"
     },
   ```

3. Install all required packages:

   - [**Nodemon**](https://www.npmjs.com/package/nodemon)</br>
     `npm install nodemon` OR `npm install -g nodemon`
   - [**Express**](https://www.npmjs.com/package/express): Web framework for Node.js</br>
     `npm install express`
   - [**Socket.IO**](https://www.npmjs.com/package/socket.io): Real-time bidirectional event-based communication</br>
     `npm install socket.io`

4. Setup base server application by creating _**index.js**_ file:

   ```js
   const express = require("express");
   const http = require("http");
   const { Server } = require("socket.io");

   // Initialize express app
   const app = express();

   // Create HTTP server
   const server = http.createServer(app);

   // Instantiate server via Socket.IO
   const io = new Server(server);

   // Connect with client
   io.on("connection", (socket) => {
     console.log("Connected with client.");

     // Disconnect
     socket.on("disconnect", () => {
       console.log("Disconnected with client.");
     });
   });

   const PORT = 5000;

   // Start server
   server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
   ```

5. Setup CORS policy (_**index.js**_):

   ```js
   ...
   // Instantiate server via Socket.IO
   const io = new Server(server, {
   // CORS: allow connection between client and server who have different posts.
   cors: {
       origin: ["http://localhost:3000"],
   },
   });
   ...
   ```

6. Receive message from client (_**index.js**_):

   ```js
   ...
    // Connect with client
    io.on("connection", (socket) => {
        ...
        // Receive message from client
        socket.on("send_message", (data) => {
            console.log("Message arrived from client.");
            console.log(data);

            // Send back to client
            io.emit("received_message", data);
        });
        ...
    });
   ...
   ```

7. Start your server: `npm start`

8. Open http://localhost:{#PORT} on browser to check server running.
