var http = require("http");

class request {
	constructor() {
		this._options = {};
		this._queue = [];
		this._send = false;
	}

	protocol(protocol) {
		if(typeof protocol !== "string") {
			throw new TypeError("argument protocol must be a string");
		}

		this._options["protocol"] = protocol;

		return this;
	}

	host(host) {
		if(typeof host !== "string") {
			throw new TypeError("argument host must be a string");
		}

		this._options["host"] = host;

		return this;
	}

	path(path) {
		if(typeof path !== "string") {
			throw new TypeError("argument path must be a string");
		}

		this._options["path"] = path;

		return this;
	}

	method(method) {
		if(typeof method !== "string") {
			throw new TypeError("argument method must be a string");
		}

		this._options["method"] = method;

		return this;
	}

	port(port) {
		if(typeof port !== "number") {
			throw new TypeError("argument port must be a string");
		}

		this._options["port"] = port;

		return this;
	}

	header(key, value) {
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

	cookie(key, value) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}
		if(typeof value === "undefined") {
			throw new TypeError("argument value cannot be undefined");
		}

		if(this._options["headers"] === undefined) {
			this._options["headers"] = {};
		}

		var cookies = this._options["headers"]["cookie"];

		if(typeof cookies !== "string") {
			cookies = key + "=" + value;
		}
		else {
			cookies += "; " + key + "=" + value;
		}

		this._options["headers"]["cookie"] = cookies;

		return this;
	}

	agent(agent) {
		if(typeof agent === "undefined") {
			throw new TypeError("argument agent cannot be undefined");
		}

		this._options["agent"] = agent;

		return this;
	}

	encoding(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}

		this.header("accept-encoding", value);

		return this;
	}

	language(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		this.header("accept-language", value);

		return this;
	}

	charset(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		this.header("accept-charset", value);

		return this;
	}

	type(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		this.header("accept", value);

		return this;
	}

	cache(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		this.header("cache-control", value);

		return this;
	}

	referer(value) {
		if(typeof value !== "string") {
			throw new TypeError("argument value must be a string");
		}
		
		this.header("referer", value);

		return this;
	}

	timeout(timeout) {
		if(typeof timeout !== "number") {
			throw new TypeError("argument timeout must be a number");
		}
		
		this._options["timeout"] = timeout;

		return this;
	}

	body(body) {
		if(typeof body !== "string") {
			throw new TypeError("the argument body must be a string");
		}

		this._options["body"] = body;

		return this;
	}

	expect(key, value, extra) {
		if(typeof key !== "string") {
			throw new TypeError("argument key must be a string");
		}
		if(typeof value === "undefined") {
			throw new TypeError("argument value cannot be undefined");
		}

		this._queue[this._queue.length] = {
			key, value, extra
		};

		return this;
	}

	send(end) {
		this._send = true;
		var options = this._options;

		if(options["body"]) {
			options["headers"] = options["headers"] || {};
			options["headers"]["content-length"] = options["headers"]["content-length"] || options["body"].length;
		}
		
		var req = http.request(options, function(res) {
			var body = "";

			res.on("data", function(data) {
				body += data;
			}.bind(this));

			res.on("end", function() {
				run_queue(this._queue, res, body, end);
			}.bind(this));
		}.bind(this));

		req.on("error", function(err) {
		 	ended(err, end);
		});
		
		if(options["body"]) {
			req.write(options["body"]);
		}

		req.end();

		return new request();
	}
}

module.exports = request;

var run_queue = function(queue, res, body, end) {
	for(var i = 0; i < queue.length; i++) {
		var item = queue[i];

		switch(item.key) {
			case "body": 
				if(body !== item.value) {
					return ended(new Error("the body is not the same as " + item.value), end);
				}

				break;

			case "header": 
				if(res.headers[item.value] !== item.extra) {
					return ended(new Error("the header " + item.value + " is not the same as " + item.extra), end);
				}

				break;

			case "cookie": 
				var cookies = res.headers["set-cookie"];
				var found = false;

				if(cookies === undefined) {
					return ended(new Error("there were no cookies send"), end);
				}

				for(var x = 0; x < cookies.length; x++) {
					var cookie = cookies[x];
					var key = cookie.substring(0, cookie.indexOf("="));
					var value = cookie.substring(cookie.indexOf("=") + 1, cookie.length);

					if(key === item.value) {
						if(value !== item.extra) {
							return ended(new Error("the cookie " + key + " is not the same as " + item.extra), end);
						}

						found = true;
					}
				}

				if(!found) {
					return ended(new Error("the cookie " + item.value + " didn't exist"), end);
				}
				
				break;

			case "enc":
				if(res.headers["content-encoding"] !== item.value) {
					return ended(new Error("the encoding is not the same as " + item.value), end);
				}

				break;

			case "type":
				if(res.headers["content-type"] !== item.value) {
					return ended(new Error("the type is not the same as " + item.value), end);
				}

				break;
		
			case "lang":
				if(res.headers["content-language"] !== item.value) {
					return ended(new Error("the language is not the same as " + item.value), end);
				}

				break;
			
			case "length":
				var length = res.headers["content-length"];

				if(typeof length === "string" && typeof item.value === "number") {
					length = parseInt(length);
				}

				if(length !== item.value) {
					return ended(new Error("the length is not the same as " + item.value), end);
				}

				break;

			case "status":
				if(res.statusCode !== item.value) {
					return ended(new Error("the length is not the same as " + item.value), end);
				}

				break;

			default:
				return ended("the key " + item.key + " doesn't exist", end);
		}
	}

	ended(undefined, end);
};

var ended = function(err, end) {
	if(typeof end === "function") {
		return end(err);
	}

	throw new Error("both the arguments seem to be undefined");
};