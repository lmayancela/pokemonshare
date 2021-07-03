const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
//const auth = require('./config/auth.js');


const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb://localhost/authDemo');
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
      try {
        let username = req.body.username
        let age = req.body.age
        req.user.username = username
        req.user.age = age
        req.user.imageURL = req.body.imageURL
        await req.user.save()
        res.redirect('/profile')
      } catch (error) {
        next(error)
      }

    })

// All pokemon code is here

var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
const Team = require('./models/Team');
let localteam = []

function cleanupData(data){
  const final = {}

  function parseType(data){
    const parsedData = []
    data.forEach(element => parsedData.push(element.type.name))
    return parsedData;
  }

  function parseStats(data){
    const parsedData = []
    data.forEach(element => parsedData.push(element.base_stat))
    return parsedData;
  }


  Object.assign(final, {
    name: data.name,
    stats: parseStats(data.stats),
    type: parseType(data.types),
    sprite: data.sprites.front_default,
  });

  return final
}

async function lookupPokemon(name){
  await P.getPokemonByName(name.toLowerCase()).then(function(response){
    if(response != undefined) {
      let cleaned_data = cleanupData(response)
      localteam.push(cleaned_data)
      console.log('Pokemon lookup Success!');
    } else {
      console.log('Pokemon lookup Undefined');
    }
  }).catch(function(error) {
    console.log('Pokemon lookup Error');
  });
}

// ALl app.get routes
app.get('/createTeam',
  isLoggedIn,
  async (req, res, next) => {
    res.locals.curr_team = localteam
    res.render('createTeam');
  });

app.get('/profile',
    isLoggedIn,
    async (req,res) => {
      res.locals.teams = await Team.find({ userId: req.user._id })
      res.render('profile')
    })

app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
      try {
        res.locals.profiles = await User.find({})
        res.render('profiles')
      }
      catch(e){
        next(e)
      }
    }
  )

app.use('/publicprofile/:userId',
    async (req,res,next) => {
      try {
        let userId = req.params.userId
        res.locals.profile = await User.findOne({_id: userId})
        res.locals.teams = await Team.find({ userId: userId })
        res.render('publicprofile')
      }
      catch(e){
        console.log("Error in /profile/userId:")
        next(e)
      }
    }
  )


// All app.post routes
app.post('/addPokemon',
  isLoggedIn,
  async (req, res, next) => {
    let name = req.body.name
    await lookupPokemon(name)
    console.log("Local team: " + localteam)
    res.redirect('createTeam');
  });

app.post('/clearTeam',
  isLoggedIn,
  async (req,res,next) => {
    localteam = []
    res.redirect('createTeam');
  });

app.post('/saveTeam',
  isLoggedIn,
  async (req,res,next) => {
    let new_team = new Team({
      name: req.body.name,
      pokemon: JSON.stringify(localteam),
      userId: req.user._id,
    });
    await new_team.save();
    localteam = []
    res.redirect('createTeam');
  });



// End of pokemon code
app.use('/data',(req,res) => {
  res.json([{a:1,b:2},{a:5,b:3}]);
})

const User = require('./models/User');

app.get("/test",async (req,res,next) => {
  try{
    const u = await User.find({})
    console.log("found u "+u)
  }catch(e){
    next(e)
  }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
