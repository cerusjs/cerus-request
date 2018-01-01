module.exports = function() {
	var package = require("./package.json");

	this.name = package["name"];
	this.version = package["version"];
	var request = require("./lib/request");

	this.request = function() {
		return new request();
	}

	return this;
}

/*
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
*/