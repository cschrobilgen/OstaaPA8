const express = require('express');
const mongoose = require('mongoose');
const app = express(); 
app.use(express.static('public_html'));
app.use(express.json());
app.set("json spaces", 2);
const port = 3000;

// Chris Schrobilgen
// CSC 337
// Server side code to initialize a MongoDB and handle url requests made by the client to append and display
// database documents via JSON.

// Creating the MongoDB
const mongoDBURL = 'mongodb://127.0.0.1/ostaa'; 
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
mongoose.connection.on('error', () => { 
    console.log('Connection error') 
});

// Creating schemas for the users and items
const Schema = mongoose.Schema;
// Items
const ItemSchema = new Schema({
    title: String,
    description: String,
    image: String,
    price: Number,
    stat: String 
});
// User
const UserSchema = new Schema({
    username: String,
    password: String,
    listings: [String],
    purchases: [String]
});
const Item = mongoose.model('Item', ItemSchema);
const User = mongoose.model('User', UserSchema);

// Get all users
app.get('/get/users', async (req, res) => {
    const users = await User.find({}).exec()
    .then((results) => {
        console.log(results)
        res.send(results);
    })
    .catch((error) => {
        console.log('Could not retrieve users');
        console.log(error);
    })
});

// Get all items
app.get('/get/items', async (req, res) => {
    const users = await Item.find({}).exec()
    .then((results) => {
        console.log(results);
        res.send(results);
    })
    .catch((error) => {
        console.log('Could not retrieve items');
        console.log(error);
    })
});

// Get listings for a user by username
app.get('/get/listings/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    .then((results) => {
        console.log(results.listings);
        res.send(results.listings);
    })
    .catch((error) => {
        console.log('Could not retrieve listings for ' + req.params.username);
        console.log(error);
    })
});

// Get purchases for a user by username
app.get('/get/purchases/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    .then((results) => {
        console.log(results.purchases);
        res.send(results.purchases);
    })
    .catch((error) => {
        console.log('Could not retrieve purchases for ' + req.params.username);
        console.log(error);
    })
});

// Search users by keyword in the username
app.get('/search/users/:keyword', async (req, res) => {
    const keyword = await req.params.keyword;

    const users = await User.find({ username: { $regex: keyword } })
    .then((results) => {
        console.log(results);
        res.send(results);
    })
    .catch((error) => {
        console.log('Could not find users with the keyword ' + req.params.username);
        console.log(error);
    })
});

// Search items by keyword in the description
app.get('/search/items/:keyword', async (req, res) => {
    const keyword = await req.params.keyword;

    const items = await Item.find({ description: { $regex: keyword } })
    .then((results) => {
        console.log(results);
        res.send(results)
    })
    .catch((error) => {
        console.log('Could not find users with the keyword ' + req.params.username);
        console.log(error);
    })
});

// Add a new user
app.post('/add/user', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    const newUser = await user.save();
    res.json(newUser);
});

// Add a new item for a user by username
app.post('/add/item/:username', async (req, res) => {
    const username = req.params.username;
    const { title, description, image, price, status } = req.body;
    const item = new Item({ title, description, image, price, status });
    const newItem = item.save();
    
    //Removing "new ObjectID()" from the object ID
    const itemID = item._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");

    const updatedUser = await User.findOneAndUpdate(
        { username: username }, 
        { $push: { listings: itemID } }, 
    );
    res.json(updatedUser);
});

// Listening on port 3000
app.listen(port, () => {
    console.log(`Ostaa app is running on port ${port}`);
});