# authdemo
Simple Express/Mongoose server showing how to use google authentication with a "To Do List"

The google authentication keys must be setup by visiting https://console.developers.google.com
to get a clientID and a clientSecret

When you deploy this to a URL you need to set 4 environment variables
* clientID     -- from your OAUTH provider
* clientSecret -- from your OAUTH provider
* callbackURL  -- http://YOURDOMAIN/login/authorized
* MONGODB_URI  -- ... the URI of your mongo database

To run this locally in a bash shell you can set the environment variables with the following commands
``` shell
bash
export clientID="ZZZZZZZZZ"
export clientSecret="ZZZZZZZZZ"
export callbackURL="https://....../login/authorized"
export MONGODB_URI="mongodb://........"
```
You can also put these commands in a shell script...

To run this on heroku you can set the heroku environment variables by logging into http://heroku.com, selecting your app, and clicking on the settings tab which reveals the "reveal config variables" button.
You can also set the environment variables in heroku with the heroku command line interface:
```
heroku config:set clientId:"ZZZZZZZZ"
```
etc.

You start the app locally with
```
npm start
```
and on heroku with
```
heroku open
```



