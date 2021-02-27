# Authentication API 

I personally tend to reuse this code alot when I'm starting new projects... so here it is take it... at your own risk of course.

## Includes
 
* Passport Authentication: Google, Facebook.
* Local Authentication: Login, Register, Email Password Reset.
* JWT Access and Refresh Tokens.
* Private route middleware.

## Follow these steps to get it up and running

### Create .env file in root directory

```
DB_CONNECTION=<mongo-uri>
TOKEN_SECRET=<random-string>
REFRESH_TOKEN_SECRET=<random-string>
GOOGLE_CLIENT_ID=<XXXXXXXXXX>
GOOGLE_CLIENT_SECRET=<XXXXXXXXX>
FACEBOOK_CLIENT_ID=<XXXXXXXXXX>
FACEBOOK_CLIENT_SECRET=<XXXXXXXXXX>
```
### Install all the neccessary packages

```npm i```

### Start

```npm start```


## How to use private route middleware

This can be applied to routes you create. You simply import it at the top and add it to your route. This also gives you access to the user._id which you can use in your queries to get user specific data.

### Example
```
const private = requires("private")

app.get("/protected", private, (req, res) => {
  const user = req.user._id
  res.json("Welcome to protected route user: " + user);
});
```

## How to refresh an accessToken

accessTokens are set to expire after 15mins. To refresh your accessToken post the refreshToken to the /api/auth/token route.

As simple as it gets :)
