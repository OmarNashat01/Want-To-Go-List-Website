
var express = require('express');
var path = require('path');
var fs = require('fs');
var alert = require('alert');
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
var mongoDBSession = require('connect-mongodb-session')(session);
const { ObjectId } = require('mongodb');
const { stringify } = require('querystring');
var app = express();
const PORT = process.env.PORT || 3000;


const store = new mongoDBSession({
  uri: 'mongodb://127.0.0.1:27017/myDB',
  collection: 'Sessions'
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ resave: true, secret: 'secret', saveUninitialized: false, store: store, cookie: { maxAge: 1000 * 60 * 60 } }));


app.get('/', function (req, res) {
  res.redirect('login');

});

app.get('/login', function (req, res) {
  res.render('login');
});



app.get('/home', function (req, res) {
  if (req.session.authenticated)
    res.render('home');
  else
    res.redirect('login');
});
app.get('/annapurna', function (req, res) {
  if (req.session.authenticated)
    res.render('annapurna');
  else
    res.redirect('login');
});
app.get('/bali', function (req, res) {
  if (req.session.authenticated)
    res.render('bali');
  else
    res.redirect('login');
});

app.get('/cities', function (req, res) {
  if (req.session.authenticated)
    res.render('cities');
  else
    res.redirect('login');
});

app.get('/hiking', function (req, res) {
  if (req.session.authenticated)
    res.render('hiking');
  else
    res.redirect('login');
});

app.get('/inca', function (req, res) {
  if (req.session.authenticated)
    res.render('inca');
  else
    res.redirect('login');
});

app.get('/islands', function (req, res) {
  if (req.session.authenticated)
    res.render('islands');
  else
    res.redirect('login');
});

app.get('/registration', function (req, res) {
  res.render('registration');
});
app.get('/rome', function (req, res) {
  if (req.session.authenticated)
    res.render('rome');
  else
    res.redirect('login');
});
app.get('/paris', function (req, res) {
  if (req.session.authenticated)
    res.render('paris');
  else
    res.redirect('login');
});

app.get('/santorini', function (req, res) {
  if (req.session.authenticated)
    res.render('santorini');
  else
    res.redirect('login');
});
app.get('/searchresults', function (req, res) {
  if (req.session.authenticated)
    res.render('searchresults');
  else
    res.redirect('login');
});
app.post('/search', function (req, res) {

  const potentialsearchres = ['bali', 'santorini', 'paris', 'rome', 'inca', 'annapurna'];
  const result = [];
  potentialsearchres.forEach(city => {
    if (city.includes(req.body.Search)) {


      result.push(city);

    }

  });



  
  res.render('searchresults', { result });
});





MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
  if (err) throw err;
  var db = client.db('myDB');

});


app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username == "admin" && password == "admin"){
    req.session.authenticated = true;
    req.session.username = username;
    res.redirect('home');
    return;
  }

  const client = await MongoClient.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true
  });
  const db = client.db('myDB');
  const collection = db.collection('myCollection');
  const user = await collection.findOne({ username });
  
  if (!user) {

    return res.status(401).send(`
    Username or password is incorrect!
      <br>
      <a href="/login">Go back to login page</a>
    `);
  }
  if (password != user.password) {
    return res.status(401).send(`
    Username or password is incorrect!
      <br>
      <a href="/login">Go back to login page</a>
    `);
  }
  else {
    req.session.authenticated = true;
    req.session.username = user.username;
    res.redirect('home');
  }
});

app.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).send(`
    Please provide both username and password
      <br>
      <a href="/registration">Go back to registeration page</a>
    `);
    return;
  }
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true
  });
  var db = client.db('myDB');
  const collection = db.collection('myCollection');
  const user = await collection.findOne({ username });

  if (!user) {
    collection.insertOne({ username, password, wanttogo: [] }, (err, result) => {
      if (err) {
        console.log('Error inserting document:', err);
        res.status(500).send('Error registering user');
        return;
      }


      res.send(`
  Successfully registered!
    <br>
    <a href="/login">Go to login page</a>
  `);


    });

  }
  else {
    return res.status(400).send(`
    User already exists!
      <br>
      <a href="/registration">Go back to registeration page</a>
    `);
  }



});








app.post('/paris', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
    if (err) throw err;
    var db = client.db('myDB');

    var exist = await db.collection('myCollection').findOne({ username: req.session.username, wanttogo: { $elemMatch: { name: "Paris" } } });

    if (!exist) {
      db.collection('myCollection').updateOne({ username: req.session.username }, { $push: { wanttogo: { name: "Paris" } } });

    }
    else {
      alert("This Destination Already Exist");
    }
    res.render('paris');



  });
});

app.post('/annapurna', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
    if (err) throw err;
    var db = client.db('myDB');

    var exist = await db.collection('myCollection').findOne({ username: req.session.username, wanttogo: { $elemMatch: { name: "Annapurna" } } });

    if (!exist) {
      db.collection('myCollection').updateOne({ username: req.session.username }, { $push: { wanttogo: { name: "Annapurna" } } });

    }
    else {
      alert("This Destination Already Exist");
    }
    res.render('annapurna');



  });


});


app.post('/bali', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
    if (err) throw err;
    var db = client.db('myDB');

    var exist = await db.collection('myCollection').findOne({ username: req.session.username, wanttogo: { $elemMatch: { name: "Bali" } } });

    if (!exist) {
      db.collection('myCollection').updateOne({ username: req.session.username }, { $push: { wanttogo: { name: "Bali" } } });

    }
    else {
      alert("This Destination Already Exist");
    }
    res.render('bali');



  });


});

app.post('/inca', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
    if (err) throw err;
    var db = client.db('myDB');

    var exist = await db.collection('myCollection').findOne({ username: req.session.username, wanttogo: { $elemMatch: { name: "Inca" } } });

    if (!exist) {
      db.collection('myCollection').updateOne({ username: req.session.username }, { $push: { wanttogo: { name: "Inca" } } });

    }
    else {
      alert("This Destination Already Exist");
    }
    res.render('inca');

    

  });


});

app.post('/rome', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
    if (err) throw err;
    var db = client.db('myDB');

    var exist = await db.collection('myCollection').findOne({ username: req.session.username, wanttogo: { $elemMatch: { name: "Rome" } } });

    if (!exist) {
      db.collection('myCollection').updateOne({ username: req.session.username }, { $push: { wanttogo: { name: "Rome" } } });

    }
    else {
      alert("This Destination Already Exist");
    }
    res.render('rome');

   

  });


});

app.post('/santorini', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
    if (err) throw err;
    var db = client.db('myDB');

    var exist = await db.collection('myCollection').findOne({ username: req.session.username, wanttogo: { $elemMatch: { name: "Santorini" } } });

    if (!exist) {
      db.collection('myCollection').updateOne({ username: req.session.username }, { $push: { wanttogo: { name: "Santorini" } } });

    }
    else {
      alert("This Destination Already Exist");
    }
    res.render('santorini');



  });


});



app.get('/wanttogo', function (req, res) {
  if (req.session.authenticated) {

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://127.0.0.1:27017", async function (err, client) {
      if (err) throw err;
      var db = client.db('myDB');

      var exist = await db.collection('myCollection').findOne({ username: req.session.username });

      var a = await exist.wanttogo;
      res.render('wanttogo', { wtg: a });
    });
  }
  else
    res.redirect('login');
});

//app.listen(3000);
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});