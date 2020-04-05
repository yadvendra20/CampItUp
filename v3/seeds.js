var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image: "https://cdn.pixabay.com/photo/2018/11/05/23/21/may-creek-twilight-3797080__340.jpg",
		Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Desert Mesa",
		image: "https://cdn.pixabay.com/photo/2015/09/14/13/57/campground-939588__340.jpg",
		Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "Canyon Floor",
		image: "https://image.shutterstock.com/image-photo/family-vacation-travel-holiday-trip-260nw-691677433.jpg",
		Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}
];

function seedDB() {
	//Remove all the data
	Campground.deleteMany({},(err)=>{
		// if(err)
		// 	console.log(err);
		// console.log("Removed campgrounds!");
		// //add a few campgrounds
		// data.forEach((seed)=>{
		// 	Campground.create(seed,(err,campground)=>{
		// 		if(err){
		// 			console.log(err);
		// 		}
		// 		else{
		// 			console.log("Added a campground");
		// 			//Create a comment
		// 			Comment.create({
		// 				text: "This place is great, but I wish there was an Internet",
		// 				author: "Homer"
		// 			}, (err,comment)=>{
		// 				if(err){
		// 					console.log(err);
		// 				} else {
		// 					campground.comments.push(comment);
		// 					campground.save();
		// 					console.log("Created a new comment");
		// 				}
		// 			});
		// 		}
		// 	});
		// });
		//add a few comments
	});
}
module.exports = seedDB;