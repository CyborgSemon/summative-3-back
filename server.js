const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);

const config = require(`./config.json`);

const Users = require('./models/users');
const Listings = require('./models/listings');

mongoose.connect(`mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.CLUSTER_NAME}.mongodb.net/${config.TABLE_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on(`error`, console.error.bind(console, `connection error:`));
db.once(`open`, ()=> {
    console.log(`we are connected mongo db`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlenconded({
    extended: false
}));
app.use(cors());

app.use((req, res, next)=> {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get(`/`, (req, res)=> {
    res.send(`Welcome to our Pop Culture Merchandise Niche Market App`);
});



// READ users for login
app.post(`/login`, (req, res)=> {
    Users.findOne({
        username: req.body.username
    }, (err, userCheck)=> {
        if (userCheck) {
            if (bcrypt.compareSync(req.body.password, userCheck.password)) {
                res.send(userCheck);
            } else {
                res.send(`Invalid Password`);
            }
        } else {
            res.send(`Invalid Username`);
        }
    });
});

// READ all listings
app.get(`/allListings`, (req, res)=> {
    Listings.find().then((result)=> {
        res.send(result);
    })
});

// READ products based off id
app.post(`/product`, (req, res)=> {
    Listings.findById(req.body.id, (err, product)=> {
        res.send(product);
    }).catch((err)=> {
        res.send(`Can not find that item`);
    });
});

app.listen(port, ()=> {
    console.log(`application is running on port ${port}`);
});
