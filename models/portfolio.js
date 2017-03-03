var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var portfolioSchema = new Schema({
	name:String,
	links:[String],
	username:String
});


mongoose.model('portfolio', portfolioSchema);