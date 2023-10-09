# EngiWorldBackend
Backend application for EngiWorld project

## How to use

1. Clone
2. Run 'npm install'
3. Create your own .env file with REFRESH_TOKEN_SECRET and ACCESS_TOKEN_SECRET secret keys
4. Run 'Node app.js'
5. If necessary, change PORT variable in app.js, so it matches your desired port
6. There is a chance that you will need MongoDB installed. If so, just install it OR comment everything related to mongodb & mongoose in the application (if you don't need mongodb data)
7. Authentication logic depends on passing JWT token within a Bearer authorization header in a request. We may change it later

## Current routes

/data - to get data about user, who sent a request [GET with access token]. Returns JSON. <br />
/auth/login/ - to get access and refresh tokens [POST with username and password]. Returns JSON. <br />
/auth/refresh/ - to refresh access and refresh tokens [POST with refresh token]. Returns JSON. <br />
 <br /> <br />
P.S. password for /auth/login route is "123456", username is anything (whole user logic is not implemented yet)
