<h1 align="center">
Nestjs-Post-Api 
</h1>


## Description
Crud Post RestApi 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```


# HealthCheck
      api/healthz



# Crud endpoints
## Auth
- ### Register
      Method : POST
      api/auth/register
- ### Login
      Method : POST
      api/auth/login
- ### Logout
      Method : POST
      api/auth/logout
- ### Me 
      Method : Get
      api/auth/me

- ### Refrech Tokens 
      Method : Post
      api/auth/refresh

## post
  - ### Create Post
        Method : Post
        api/posts 
  - ### Get ALL Posts 
        Method : Get
        api/posts
  - ### Get Post 
        Method : Get
        api/posts  
  - ### Update Post 
        Method : PATCH
        api/posts/id
  - ### Delete Post
        Method : DELETE
        api/post/id 