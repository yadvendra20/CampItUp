var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = 3000;

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine","ejs");

var campgrounds = [
		{name : "Salmon Creek", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjbbdiRRtOALDWKO_-wJAr5wW14geuVHqDlJnqg_slQr9q64RE"},
		{name : "Granite Hill", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6xHKVf1VCnxehLW6C7gNdc6VXzWhPARuxiYlpWlbn8dLSu8e5sQ"},
		{name : "Mountain Goat's Rest", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeSDkpFvi_eCIP_ZNDQJ0lbb3uYONrZM8bNDx4vvOf7y01IqfD"},
	{name : "Salmon Creek", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjbbdiRRtOALDWKO_-wJAr5wW14geuVHqDlJnqg_slQr9q64RE"},
		{name : "Granite Hill", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6xHKVf1VCnxehLW6C7gNdc6VXzWhPARuxiYlpWlbn8dLSu8e5sQ"},
		{name : "Mountain Goat's Rest", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeSDkpFvi_eCIP_ZNDQJ0lbb3uYONrZM8bNDx4vvOf7y01IqfD"},
	{name : "Salmon Creek", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjbbdiRRtOALDWKO_-wJAr5wW14geuVHqDlJnqg_slQr9q64RE"},
		{name : "Granite Hill", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6xHKVf1VCnxehLW6C7gNdc6VXzWhPARuxiYlpWlbn8dLSu8e5sQ"},
		{name : "Mountain Goat's Rest", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeSDkpFvi_eCIP_ZNDQJ0lbb3uYONrZM8bNDx4vvOf7y01IqfD"}
	];

app.get("/",function(req,res){
	res.render("landing");
})

app.get("/campgrounds",(req,res)=>{
	res.render("campgrounds", {campgrounds : campgrounds});
});

app.get("/campgrounds/new",(req,res) => {
	res.render("new.ejs");
});

app.post("/campgrounds",(req,res) =>{
	//res.send("You hit the post route...!!");
	//get the data from form and add to the campgrounds array
	var newCampground = {
		name: req.body.name,
		image: req.body.image
	}
	campgrounds.push(newCampground);
	
	//redirect back to the campgrounds page
	res.redirect("/campgrounds");
});

app.listen(port,function(){
	console.log("The YelpCamp server has started");
})