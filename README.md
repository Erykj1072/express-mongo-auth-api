# Authentication API 

I personally tend to reuse this code alot when I'm starting new projects... so here it is take it... at your own risk of course

## Includes
 
* Passport Authentication: Google, Facebook
* Local Authentication: Login, Register, Email Password Reset
* JWT token 
* Private route middleware

## Follow these steps to get it up and running

### Create .env file in root directory

```
DB_CONNECTION=<mongo-uri>
TOKEN_SECRET=<random-string>
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

router.get("/user", private, (req, res) => {
  const user = req.user._id;
  try {
    res.status(200).json("Weclome " + user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
```

As simple as it gets :)
