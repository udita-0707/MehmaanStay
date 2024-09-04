const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')

//Setting up the database
main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://localhost:27017/quest");
}
//Setting up the database

//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Setting up the routes
app.get("/", (req, res) => {
    res.send("Hello World"); //basic api to get started with express
})

//Test Listing Route
// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing ({
//         title: "Sample Title",
//         description: "Sample Description",
//         price: 1000,
//         location: "Sample Location",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log(sampleListing);
//     res.send("Listings route successfully tested!!!");
// })

//Index route
//for checking
// app.get("/listings", async(req, res) => {
//     await Listing.find({}).then((res)=>{
//         console.log(res);
//     });
//     res.send("All listings displayed successfully");
// })

app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
})


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})


//Show Route
app.get("/listings/:id", async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})


//Create Route
app.post("/listings", async(req, res) => {
    // way1 => const {title, description, price, location, country} = req.body;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    // console.log(listing);
    res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit", async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

//Update Route
app.put("/listings/:id", async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})


//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });
//Setting up the routes
app.listen(8080, () => {
    console.log("Server is running on port 8080");
})