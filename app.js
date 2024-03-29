require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const flash = require('connect-flash');


mongoose
  .connect('mongodb://localhost/celebrity', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


app.use(session({
  secret: "Secret-Key",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));


//creates universal variable in all hbs files
//creates user in session 
app.use((req,res,next)=>{
  
  res.locals.theUser = req.session.currentuser;

  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');

  next();

})


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
app.use('/', index);

const celebRoutes = require('./routes/celeb-routes');
app.use('/celebrity', celebRoutes);

const movieRoutes = require('./routes/movie-routes');
app.use('/movies', movieRoutes);

const userRoutes = require('./routes/user-routes');
app.use('/user', userRoutes);

const adminRoutes = require('./routes/admin-routes');
app.use('/admin', adminRoutes);

module.exports = app;
