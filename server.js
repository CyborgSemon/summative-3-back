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

app.post(`/registerUser`, (req, res)=>{
    const user = new Users({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        dob: req.body.dob
        // registerDate: Date
    });
});

app.post(`/newListing`, (req, res)=>{
    const listing = new Listings({
        _id: new mongoose.Types.ObjectId(),
    	title: req.body.title,
    	description: req.body.description,
    	price: req.body.price,
    	fileName: req.file.path,
    	originalName: req.file.originalname
    });

    listing.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err));
});

// const storage = multer.diskStorage({
//  destination: (req, file, cb) =>{
//      cb(null, './uploads');
//  },
//  filename: (req, file, cb)=>{
//  cb(null, Date.now() + `-` + file.originalname)
//}
//});

app.listen(port, ()=> {
    console.log(`application is running on port ${port}`);
});
