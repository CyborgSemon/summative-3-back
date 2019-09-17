const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const fs = require(`fs`);
const multer = require(`multer`);

const config = require(`./config.json`);

const Users = require('./models/users');
const Listings = require('./models/listings');

mongoose.connect(`mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.CLUSTER_NAME}.mongodb.net/${config.TABLE_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on(`error`, console.error.bind(console, `connection error:`));
db.once(`open`, ()=> {
    console.log(`we are connected mongo db`);
});

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + `-` + file.originalname)
    }
});

const filterFile = (req, file, cb) => {
    if(file.mimetype === `image/jpeg` || file.mimetype === `image/png`){
        cb(null, true);
    }else {
        req.validationError = `invalid extension`;
        cb(null, false, req.validationError);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filterFile
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
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
    const hash = bcrypt.hashSync(req.body.password);
    const user = new Users({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        username: req.body.username,
        password: hash,
        email: req.body.email,
        dob: req.body.dob,
        registerDate: req.body.registerDate
    });

    user.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err));
});

app.post(`/newListing`, upload.single(`filePath`), (req, res)=>{
    // console.log(req);
    // console.log(req.body);
    // console.log(req.file);
    const listing = new Listings({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        filePath: req.file.path,
        originalName: req.body.originalname
    });

    listing.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err));
});

app.listen(port, ()=> {
    console.log(`application is running on port ${port}`);
});
