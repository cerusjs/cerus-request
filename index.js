module.exports = function() {
	var plugin = {};
	
	var package = require("./package.json");
	var request = require("./lib/request");

	plugin.name = package["name"];
	plugin.version = package["version"];

	plugin.request = function() {
		return new request();
	}

	return plugin;
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