const express = require(`express`);
const app = express();
const port = 3000;
const bodyParser = require(`body-parser`);
const cors = require(`cors`);
const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const fs = require(`fs`);
const multer = require(`multer`);

const config = require(`./config.json`);

const Users = require(`./models/users`);
const Listings = require(`./models/listings`);
const Comments = require(`./models/comments`);

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
        cb(null, `./uploads`);
    },
    filename: (req, file, cb)=> {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const filterFile = (req, file, cb) => {
    if(file.mimetype === `image/jpeg` || file.mimetype === `image/png`){
        cb(null, true);
    }else {
        req.validationError = `invalid extension`;
        cb(null, false, req.validationError);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: filterFile
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

app.use(`/uploads`, express.static(`uploads`));

app.use((req, res, next)=> {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get(`/`, (req, res)=> {
    res.send(`Welcome to our Pop Culture Merchandise Niche Market App`);
});

// CREATE add a new user
app.post(`/registerUser`, (req, res)=> {
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

// CREATE add a new listing
app.post(`/newListing`, upload.single(`filePath`), (req, res)=> {
    console.log(req.body);
    console.log(req.file);
    const listing = new Listings({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        filePath: req.file.path,
        originalName: req.body.originalName,
        uploaderId: req.body.userId
    });

    console.log(`test 1`);
    listing.save().then(result => {
        console.log(`test 2`);
        res.send(result);
    }).catch((err)=> {
        console.log(`test 3`);
        res.send(err);
    });
});

// CREATE adding a comment
app.post(`/addAComment`, (req, res)=> {
    const comment = new Comments({
        _id: new mongoose.Types.ObjectId(),
        commentUsername: req.body.commentUsername,
        commentText: req.body.commentText,
        commentDate: req.body.commentDate,
        commentReply: {
            reply: req.body.reply,
            replyId: req.body.replyId
        },
        commentUserId: req.body.userId,
        listingId: req.body.listingId,
    });

    comment.save().then(result =>{
        res.send(result);
    }).catch(err => res.send(err));
});

// READ for the home page items
app.get(`/home`, (req, res)=> {
    Listings.find().then((results)=> {
        let finalArray = [];
        finalArray.push(results[Math.floor(Math.random() * results.length)]);
        results.map((result, i)=> {
            if (i < 8) {
                finalArray.push(result);
            }
        });
        res.send(finalArray);
    }).catch((err)=> {
        console.log(err);
        res.send(err);
    });
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

// READ get all listings
app.get(`/allListings`, (req, res)=> {
    Listings.find().then((result)=> {
        res.send(result);
    });
});

// READ get products based off id
app.post(`/product`, (req, res)=> {
    Listings.findById(req.body.id, (err, product)=> {
        res.send(product);
    }).catch((err)=> {
        res.send(`Can not find that item`);
    });
});

// READ get comment by id
app.post(`/getComment`, (req, res)=> {
    Comments.findById(req.body.id, (err, product)=> {
        res.send(product);
    }).catch((err)=> {
        res.send(`Can not find that item`);
    });
});

// READ get all comments based of the listing id
app.post(`/comments`, (req, res)=> {
    Comments.find().then((rawResult)=> {
        let finalResult = [];
        rawResult.map((comment)=> {
            if (comment.listingId == req.body.listingId) {
                finalResult.push(comment);
            }
        });
        if (finalResult.length > 0) {
            res.send(finalResult);
        } else {
            res.send(`No comments found`);
        }
    });
});

// UPDATE listing based off id
app.patch(`/updateListing`, (req, res)=> {
    const id = req.body.id;
    Listings.findById(id, (err, listing)=> {
        if (listing.user_id == req.body.userId) {
            const newListing = {
                title: req.body.name,
                description: req.body.price,
                price: req.body.price
            };
            Listings.updateOne({ _id : id }, newListing).then(result => {
                res.send(result);
            }).catch(err => res.send(err));
        } else {
            res.send(`401`);
        }
    }).catch(err => res.send(`cannot find listing with that id`));
});

// DELETE delete a listing based of id
app.delete(`/deleteListing`, (req, res)=> {
    Listings.deleteOne({
        _id: req.body.id
    }, (err)=> {
        if (err) {
            res.send(`failed to delete`);
        } else {
            res.send(`deleted`);
        }
    });
});

// UPDATE update a comment text
app.patch(`/updateComment`, (req, res)=> {
    const id = req.body.commentId;
    Comments.findById(id, (err, comment)=> {
        if (comment.commentUserId == req.body.userId) {
            const newComment = {
                commentText: req.body.text,
            };
            Comments.updateOne({
                _id : id
            }, newComment).then(result => {
                res.send(result);
            }).catch(err => res.send(err));
        } else {
            res.send(`401`);
        }
    }).catch(err => res.send(`cannot find comment with that id`));
});

// DELETE delete comment based off owner id
app.delete(`/deleteComment`, (req, res)=> {
    const id = req.body.commentId;
    Comments.findById(id, (err, comment)=> {
        if (comment) {
            if (comment.listingId == req.body.listingId && comment.commentUserId == req.body.userId) {
                Comments.deleteOne({
                    id: id
                }, (err)=> {
                    if (err) {
                        res.send(`Failed to delete comment`);
                    } else {
                        res.send(`Comment deleted`);
                    }
                });
            } else {
                res.send(`You dont have permission to delete this comment`);
            }
        } else {
            res.send(`No comment found`);
        }
    });
});

app.listen(port, ()=> {
    console.log(`application is running on port ${port}`);
});
