const express = require(`express`);
const app = express();
const port = 3000;
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);

const config = require(`./config.json`);

const Users = require(`./models/users`);
const Listings = require(`./models/listings`);

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

app.post(`/listing/:id`, function(req, res){
    const id = req.params.id;
    Listing.findById(id, function (err, listing) {
        if (listing.user_id == req.body.userId) {
            res.send(listing);
        } else {
            res.send(`401`);
        }
    });
});

app.patch(`/updateListing`, function(req, res){
    const id = req.body.id;
    Listing.findById(id, function(err, listing){
        if (listing.user_id == req.body.userId) {
            const newListing = {
                title: req.body.name,
                description: req.body.price,
                price: req.body.price
            };
            Listing.updateOne({ _id : id }, newListing).then(result => {
                res.send(result);
            }).catch(err => res.send(err));
        } else {
            res.send(`401`);
        }
    }).catch(err => res.send(`cannot find listing with that id`));

});

app.delete(`/listing/:id`, function(req, res){
    const id = req.params.id;
    Listing.deleteOne({ _id: id }, function (err) {
        res.send(`deleted`);
    });
});

app.listen(port, ()=> {
    console.log(`application is running on port ${port}`);
});
