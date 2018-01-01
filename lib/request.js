var http = require("http");

var request = module.exports = function() {
	this._options = {};
	this._queue = [];
	this._send = false;
}

request.prototype.protocol = function(protocol) {
	if(typeof protocol !== "string") {
		throw new TypeError("argument protocol must be a string");
	}

	this._options["protocol"] = protocol;

	return this;
}

request.prototype.host = function(host) {
	if(typeof host !== "string") {
		throw new TypeError("argument host must be a string");
	}

	this._options["host"] = host;

	return this;
}

request.prototype.path = function(path) {
	if(typeof path !== "string") {
		throw new TypeError("argument path must be a string");
	}

	this._options["path"] = path;

	return this;
}

request.prototype.method = function(method) {
	if(typeof method !== "string") {
		throw new TypeError("argument method must be a string");
	}

	this._options["method"] = method;

	return this;
}

request.prototype.port = function(port) {
	if(typeof port !== "number") {
		throw new TypeError("argument port must be a string");
	}

	this._options["port"] = port;

	return this;
}

request.prototype.header = function(key, value) {
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}
	if(typeof value === "undefined") {
		throw new TypeError("argument value cannot be undefined");
	}

	if(this._options["headers"] === undefined) {
		this._options["headers"] = {};
	}

	this._options["headers"][key] = value;

	return this;
}

request.prototype.cookie = function(key, value) {
	if(typeof key !== "string") {
		throw new TypeError("argument key must be a string");
	}
	if(typeof value === "undefined") {
		throw new TypeError("argument value cannot be undefined");
	}

	if(this._options["headers"] === undefined) {
		this._options["headers"] = {};
	}

	var cookies = this._options["headers"]["cookie"] || "";

	if(cookies === "") {
		cookies += key + "=" + value;
	}
	else {
		cookies += "; " + key + "=" + value;
	}

	return this;
}

request.prototype.agent = function(agent) {
	if(typeof agent === "undefined") {
		throw new TypeError("argument agent cannot be undefined");
	}

	this._options["agent"] = agent;

	return this;
}

request.prototype.encoding = function(value) {
	if(typeof value !== "string") {
		throw new TypeError("argument value must be a string");
	}

	this.header("accept-encoding", value);

	return this;
}

request.prototype.language = function(value) {
	if(typeof value !== "string") {
		throw new TypeError("argument value must be a string");
	}
	
	this.header("accept-language", value);

	return this;
}

request.prototype.charset = function(value) {
	if(typeof value !== "string") {
		throw new TypeError("argument value must be a string");
	}
	
	this.header("accept-charset", value);

	return this;
}

request.prototype.type = function(value) {
	if(typeof value !== "string") {
		throw new TypeError("argument value must be a string");
	}
	
	this.header("accept", value);

	return this;
}

request.prototype.cache = function(value) {
	if(typeof value !== "string") {
		throw new TypeError("argument value must be a string");
	}
	
	this.header("cache-control", value);

	return this;
}

request.prototype.referer = function(value) {
	if(typeof value !== "string") {
		throw new TypeError("argument value must be a string");
	}
	
	this.header("referer", value);

	return this;
}

request.prototype.timeout = function(timeout) {
	if(typeof timeout !== "number") {
		throw new TypeError("argument timeout must be a number");
	}
	
	this._options["timeout"] = timeout;

	return this;
}

request.prototype.expect = function(key, val, extra) {
	if(typeof key !== "string") {
		throw new TypeError("argument timeout must be a string");
	}
	if(typeof val === "undefined") {
		throw new TypeError("argument val cannot be undefined");
	}

	this._queue[this._queue.length] = {
		"key": key,
		"val": val,
		"extra": extra
	}

	return this;
}

request.prototype.send = function(end) {
	this._send = true;
	
	var req = http.request(this._options, function(res) {
		var body = "";

		res.on('data', function(data) {
			body += data;
		}.bind(this));

		res.on('end', function(data) {
			run_queue(this._queue, res, body, end);
		}.bind(this));
	}.bind(this));

	req.on('error', function(err) {
		req.abort();
		ended(err, end);
	});

	req.end();

	return new request();
}

function run_queue(queue, res, body, end) {
	for(var i = 0; i < queue.length; i++) {
		var item = queue[i];

		switch(item.key) {
			case "body": 
				if(body !== item.val) {
					return ended(new Error("the body is not the same as " + item.val), end);
				}

				break;

			case "header": 
				if(res.headers[item.val] !== item.extra) {
					return ended(new Error("the header " + item.val + " is not the same as " + item.extra), end);
				}

				break;

			case "cookie": 
				var cookies = res.headers["set-cookie"];
				var found = false;

				for(var x = 0; x < cookies.length; x++) {
					var cookie = cookies[x];
					var key = cookie.substring(0, cookie.indexOf("="));
					var value = cookie.substring(cookie.indexOf("=") + 1, cookie.length);

					if(key === item.val) {
						if(value !== item.extra) {
							return ended(new Error("the cookie " + key + " is not the same as " + item.extra), end);
						}
						else {
							found = true;
						}
					}
				}

				if(!found) {
					return ended(new Error("the cookie " + item.val + " didn't exist"), end);
				}
				
				break;

			case "enc":
				if(res.headers["content-encoding"] !== item.val) {
					return ended(new Error("the encoding is not the same as " + item.val), end);
				}

				break;

			case "type":
				if(res.headers["content-type"] !== item.val) {
					return ended(new Error("the type is not the same as " + item.val), end);
				}

				break;
		
			case "lang":
				if(res.headers["content-language"] !== item.val) {
					return ended(new Error("the language is not the same as " + item.val), end);
				}

				break;
			
			case "length":
				var length = res.headers["content-length"];

				if(typeof length === "string" && typeof item.val === "number") {
					length = parseInt(length);
				}

				if(length !== item.val) {
					return ended(new Error("the length is not the same as " + item.val), end);
				}

				break;

			case "status":
				if(res.statusCode !== item.val) {
					return ended(new Error("the length is not the same as " + item.val), end);
				}

				break;

			default:
				throw new Error("the key " + item.key + " doesn't exist");
		}
	}

	ended(undefined, end);
}

function ended(err, end) {
	if(err === undefined && typeof end === "function") {
		end();
	}
	else {
		if(typeof end === "function") {
			end(err);
		}
		else if(err instanceof Error) {
			throw err;
		}
	}
}

/*
	var self = {};

	var http = require("http");

	var options = {};
	var request;
	var response;
	var end;
	var body = "";
	var send = false;
	var queue = [];

	var run_queue = function() {
		for(var i = 0; i < queue.length; i++) {
			var item = queue[i];

			if(item.key === "body") {
				if(body !== item.val) {
					return ending(new Error("the body is not the same as " + item.val));
				}
			}
			else if(item.key === "header") {
				if(response.headers[item.val] !== item.extra) {
					return ending(new Error("the header " + item.val + " is not the same as " + item.extra));
				}
			}
			else if(item.key === "cookie") {
				var cookies = response.headers["set-cookie"];
				var found = false;

				for(var x = 0; x < cookies.length; x++) {
					var cookie = cookies[x];
					var key = cookie.substring(0, cookie.indexOf("="));
					var value = cookie.substring(cookie.indexOf("=") + 1, cookie.length);

					if(key === item.val) {
						if(value !== item.extra) {
							return ending(new Error("the cookie " + key + " is not the same as " + item.extra));
						}
						else {
							found = true;
						}
					}
				}

				if(!found) {
					return ending(new Error("the cookie " + item.val + " didn't exist"));
				}
			}
			else if(item.key === "enc") {
				if(response.headers["content-encoding"] !== item.val) {
					return ending(new Error("the encoding is not the same as " + item.val));
				}
			}
			else if(item.key === "type") {
				if(response.headers["content-type"] !== item.val) {
					return ending(new Error("the type is not the same as " + item.val));
				}
			}
			else if(item.key === "lang") {
				if(response.headers["content-language"] !== item.val) {
					return ending(new Error("the language is not the same as " + item.val));
				}
			}
			else if(item.key === "length") {
				var length = response.headers["content-length"];

				if(typeof length === "string" && typeof item.val === "number") {
					length = parseInt(length);
				}

				if(length !== item.val) {
					return ending(new Error("the length is not the same as " + item.val));
				}
			}
			else if(item.key === "status") {
				if(response.statusCode !== item.val) {
					return ending(new Error("the length is not the same as " + item.val));
				}
			}
		}

		ending()
	}

	var ending = function(err) {
		if(err === undefined && typeof end === "function") {
			end();
		}
		else {
			if(typeof end === "function") {
				end(err);
			}
			else if(err instanceof Error) {
				throw err;
			}
		}
	}

	self.protocol = function(protocol) {
		if(typeof protocol !== "string") {
			throw new TypeError("argument protocol must be a string");
		}

		options["protocol"] = protocol;
		return self;
	}

	self.host = function(host) {
		if(typeof host !== "string") {
			throw new TypeError("argument host must be a string");
		}

		options["host"] = host;
		return self;
	}

	self.port = function(port) {
		if(typeof port !== "number") {
			throw new TypeError("argument port must be a string");
		}

		options["port"] = port;
		return self;
	}

	self.path = function(path) {
		if(typeof path !== "string") {
			throw new TypeError("argument path must be a string");
		}

		options["path"] = path;
		return self;
	}

	self.method = function(method) {
		if(typeof method !== "string") {
			throw new TypeError("argument method must be a string");
		}

		options["method"] = method;
		return self;
	}

	self.header = function(key, value) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}
		if(typeof value === "undefined") {
			throw new TypeError("argument value cannot be undefined");
		}

		if(options["headers"] === undefined) {
			options["headers"] = {};
		}

		options["headers"][key] = value;

		return self;
	}

	self.cookie = function(key, value) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}
		if(typeof value === "undefined") {
			throw new TypeError("argument value cannot be undefined");
		}

		if(options["headers"] === undefined) {
			options["headers"] = {};
		}

		var cookies = options["headers"]["cookie"] || "";

		if(cookies === "") {
			cookies += key + "=" + value;
		}
		else {
			cookies += "; " + key + "=" + value;
		}

		return self;
	}

	self.agent = function(agent) {
		if(typeof agent === "undefined") {
			throw new TypeError("argument agent cannot be undefined");
		}

		options["agent"] = agent;
		return self;
	}

	self.encoding = function(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}

		self.header("accept-encoding", value);
		return self;
	}

	self.language = function(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		self.header("accept-language", value);
		return self;
	}

	self.charset = function(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		self.header("accept-charset", value);
		return self;
	}

	self.type = function(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		self.header("accept", value);
		return self;
	}

	self.cache = function(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		self.header("cache-control", value);
		return self;
	}

	self.referer = function(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		self.header("referer", value);
		return self;
	}

	self.timeout = function(timeout) {
		if(typeof timeout !== "number") {
			throw new TypeError("argument timeout must be a number");
		}
		
		options["timeout"] = timeout;
		return self;
	}

	self.expect = function(key, val, extra) {
		if(typeof key !== "string") {
			throw new TypeError("argument timeout must be a string");
		}
		if(typeof val === "undefined") {
			throw new TypeError("argument val cannot be undefined");
		}

		queue[queue.length] = {
			"key": key,
			"val": val,
			"extra": extra
		}

		return self;
	}

	self.send = function(end_) {
		send = true;
		
		request = http.request(options, function(response_) {
			response = response_;

			response_.on('data', function(data) {
				body += data;
			});

			request.on('close', function() {
				run_queue();
			});
		});

		request.on('error', function(err) {
			ending(err);
		});

		request.end();

		end = end_;

		return new req();
	}

	return self;
}

module.exports = req;

*/