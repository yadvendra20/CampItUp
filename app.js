//REQUIRED VARIABLES
var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	flash          = require("connect-flash"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	User           = require("./models/user.js"),
	Campground     = require("./models/campground"),
	Comments       = require("./models/comment"),
	seedDB         = require("./seeds"),
	port           = 3000;



//seedDB();

//INITIAL SETUP
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "The universe is very complex",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware which runs for every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//DEFAULT ROUTE
app.get("/",function(req,res){
	res.render("landing");
})

//INDEX routing
app.get("/campgrounds",(req,res)=>{
	//Get all the campgrounds from the database
	//console.log(req.user);
	Campground.find({},(err,allCampgrounds)=>{
		if(err){
			console.log(err);
		}else{
			//console.log(res.locals.message);
			res.render("campgrounds/campgrounds", {campgrounds : allCampgrounds});
		}
	})
});

//NEW routing
app.get("/campgrounds/new",isLoggedIn,(req,res) => {
	res.render("campgrounds/new");
});

//CREATE routing
app.post("/campgrounds",isLoggedIn,(req,res) =>{
	//res.send("You hit the post route...!!");
	//get the data from form and add to the campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc,author: author};
	Campground.create(newCampground,(err,campground)=>{
		if(err){
			console.log(err);
		}else{
			//redirect back to the campgrounds page
			//console.log(campground);
			res.redirect("/campgrounds");	
		}
	});
});

//SHOW routing - shows more info about a campground
app.get("/campgrounds/:id",(req,res)=>{
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
		if(err){
			console.log(err);
		} else {
			//console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show",{campground: foundCampground});	
		}
	});
});

// EDIT CAMPGROUND ROUTE
app.get("/campgrounds/:id/edit",checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		res.render("campgrounds/edit",{campground: foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
app.put("/campgrounds/:id",checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/campgrounds/:id",checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.redirect("/campgrounds");
		}
	})
});

// ==========================
// Comments Routes
// ==========================

//create a comment
app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			console.log(err);
		} else {
			res.render("comments/new",{campground: campground});
		}
	});
});

//submit a comment
app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			console.log(err);
		} else {
			Comments.create(req.body.comment,(err,comment)=>{
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					//console.log(comment);
					req.flash("error","Successfully added a comment!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//EDIT COMMENT ROUTE
app.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,(req,res)=>{
	Comments.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE ROUTE
app.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,(req,res)=>{
	Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//DELETE ROUTE
app.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,(req,res)=>{
	Comments.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// ==========================
// Auth Routes
// ==========================

//show register form
app.get("/register",(req,res)=>{
	res.render("register");
});

//handling signup request
app.post("/register",(req,res)=>{
	User.register(new User({username: req.body.username}),req.body.password, (err,user)=>{
		if(err){
			req.flash("error",err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to CampItUp, " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login page
app.get("/login",(req,res)=>{
	res.render("login");
});

//handling login request
app.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),(req,res)=>{});

//logout route
app.get("/logout",(req,res)=>{
	//console.log(req.user);
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
});


//middlewares
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that!");
	res.redirect("/login");
}

function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,(err,foundCampground)=>{
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error","You don't have permission to do that!");
					res.redirect("back");
				}	
			}
		});
	} else {
		req.flash("error","You need to be logged in to do that!");
		res.redirect("back");
	}
}

function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		Comments.findById(req.params.comment_id,(err,foundComment)=>{
			if(err){
				console.log(err);
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error","You don't have a permission to do that!");
					res.redirect("back");
				}	
			}
		});
	} else {
		req.flash("error","You need to be logged in to do that!");
		res.redirect("back");
	}
}

app.listen(port,function(){
	console.log("The YelpCamp server has started");
})