# Project Title

A brief description of what this project does and who it's for# EngiWorldBackend
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

## API Reference

#### Refresh tokens

GET request

```http
  /refresh/
```

Requires JWT cookie, updates refresh token and return new JWT cookie and access token

#### Login

POST request

```http
  /auth/login/
```

Requires info in body, returns JWT cookie and access token

#### Register

POST request

```http
  /auth/register/
```

Requires info in body, returns JWT cookie, access token and creates new user with default profile picture

#### Logout

GET request

```http
  /auth/logout/
```

Requires JWT cookie, empties refresh token in User model and clears cookie

#### Read user, sending the request

GET request

```http
  /user/
```

Requires access token, returns info about user, sending a request (info includes Buffer object or Base64 string for Image)

#### Update user, sending the request

PUT request

```http
  /user/
```

Requires access token and any new info in body, updates user info in model

#### Delete user, sending the request

DELETE request

```http
  /user/
```

Requires access token and deletes his info everywhere

#### Read post by ID

GET request

```http
  /post/:id/
```

Requires post id, returns post

#### Update post by ID

PUT request

```http
  /post/:id/
```

Requires access token and any new info in body, updates post info in model and returns updates post

#### Delete post by ID

DELETE request

```http
  /post/:id/
```

Requires access token and deletes post's info everywhere

#### Create new post

POST request

```http
  /post/create/
```

Requires access token and info in body, creates new post

#### Get user by ID

GET request

```http
  /user/:id/
```

Requires user id and returns public user info, including Buffer object or Base64 string for Image

#### Make or delete repost 

POST request

```http
  /repost/
```

Requires access token and "operationType" & "postId" fields in body

#### Get all reports of user by user ID

GET request

```http
  /user/:userId/reposts/
```

Requires user id and return all reports of user with such id

#### Search posts and users by query param

GET request

```http
  /search/
```

Requires query parameter, return all users with username AND all posts with title corresponding to query param

#### Like a post

POST request

```http
  /like/
```

Requires acccess token and postId in body, makes changes in user and post models info

#### Dislike a post

POST request

```http
  /dislike/
```

Requires access token and postId in body, makes changes in user and post models info

#### Follow / Unfollow user

POST request

```http
  /follow/
```

Requires access token and userId of followed user & operationType in body, makes changes in user models info
