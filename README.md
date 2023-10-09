# EngiWorldBackend
Backend application for EngiWorld project

# How to use

1. Clone
2. Run 'npm install'
3. Create your own .env file with REFRESH_TOKEN_SECRET and ACCESS_TOKEN_SECRET secret keys
4. Run 'Node app.js'
5. If necessary, change PORT variable in app.js, so it matches your desired port
6. There is a chance that you will need MongoDB installed. If so, just install it OR comment everything related to mongodb & mongoose in the application (if you don't need mongodb data)
7. Authentication logic depends on passing JWT token within the Bearer authorization header in a request. We may change it later with any other logic
