# mern-auth-jwt
------  SETTING PACKAGE JSON  /  DEPENDECIES FOR SERVER / SERVER / NODEMON
1) start npm init -y - creating first json file
2) npm i express dotenv mongoose bcrypt jsonwebtoken cookie-parser
3) creating express server - create folder backend and server.js insid
4) u package.json add on line 5 - "type": "module", to recognize syntax
5) u package.json in "script" refactor "test" 
    "start" : "node backed/server.js", and add under it add
    "server": "nodemon backend/server.js"
    then EXECUTE in terminal npm i  -D nodemon
 6) create in root of project file .env and add variables inside and add them in server.js
 7) now npm run server will start your server on port 5k 

------  CREATING ROUTES --------------------------
***POST  /api/users  => Register a user
***POST  /api/users/auth  => Authenticat a user and get token
***POST  /api/users/logout  => Logout a user and clean cookie
***GET  /api/users/profile  => Get user profile
***PUT  /api/users/profile  => Update profile
