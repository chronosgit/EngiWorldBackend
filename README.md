# EngiWorldBackend
Backend application for EngiWorld project

Frontend application: https://github.com/chronosgit/EngiWorld

## How to use

1. Clone
2. Run 'npm install'
3. Create your own .env file with REFRESH_TOKEN_SECRET and ACCESS_TOKEN_SECRET secret keys
4. Run 'Node app.js'
5. If necessary, change PORT variable in app.js, so it matches your desired port
6. You will need MongoDB
7. Authentication logic depends on passing JWT token within a Bearer authorization header in a request

## Routes
/refresh/   GET request, requires JWT cookie, updates refresh token and return new JWT cookie and access token  
/auth/login/   POST request, requires info in body, returns JWT cookie and access token  
/auth/register/   POST request, requires info in body, returns JWT cookie, access token and creates new user  
/auth/logout/   GET request, requires JWT cookie, empties refresh token in User model and clears cookie  
/user/   GET request, requires access token, returns info about user, sending a request  
         PUT request, requires access token and any new info in body, updates user info in model  
         DELETE request, requires access token and deletes his info everywhere  
/post/:id/   GET request, requires post id, returns post  
             PUT request, requires access token and any new info in body, updates post info in model and returns updates post  
             DELETE request, requires access token and deletes post's info everywhere  
/post/create/   POST request, requires access token and info in body, creates new post  
/user/:id/   GET request, requires user id and returns public user info  
/repost/   POST request, requires access token and "operationType" & "postId" fields in body  
/user/:userId/reposts/   GET request, requires user id and return all reports of user with such id  
/search/   GET request, requires query parameter, return all users with username AND all posts with title corresponding to query param  
/like/:postId   POSt request, requires acccess token, makes changes in user and post models info  
/dislike/:postId   POSt request, requires acccess token, makes changes in user and post models info  
