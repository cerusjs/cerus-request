module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];

	self.request = function() {
		return require("./lib/request")();
	}

	return self;
}