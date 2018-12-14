var http = require("http");

class request {
	constructor() {
		this._options = {};
		this._queue = [];
		this._send = false;
	}

	protocol(protocol) {
		this._options["protocol"] = protocol;

		return this;
	}

	host(host) {
		this._options["host"] = host;

		return this;
	}

	path(path) {
		this._options["path"] = path;

		return this;
	}

	method(method) {
		this._options["method"] = method;

		return this;
	}

	port(port) {
		this._options["port"] = port;

		return this;
	}

	header(key, value) {
		if(this._options["headers"] === undefined) {
			this._options["headers"] = {};
		}

		this._options["headers"][key] = value;

		return this;
	}

	cookie(key, value) {
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
		this._options["agent"] = agent;

		return this;
	}

	encoding(value) {
		return this.header("accept-encoding", value);
	}

	language(value) {
		return this.header("accept-language", value);
	}

	charset(value) {
		return this.header("accept-charset", value);
	}

	type(value) {
		return this.header("accept", value);
	}

	cache(value) {
		return this.header("cache-control", value);
	}

	referer(value) {
		return this.header("referer", value);
	}

	timeout(timeout) {
		this._options["timeout"] = timeout;

		return this;
	}

	body(body) {
		this._options["body"] = body;

		return this;
	}

	expect(key, value, extra) {
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

	_run_queue(response, body, end_function) {
		for(let i = 0; i < this._queue.length; i++) {
			const queue_item = this._queue[i];
	
			switch(queue_item.key) {
				case "body": 
					if(body !== queue_item.value) return this._ended(new Error(`the body is not the same as ${queue_item.value}, but is ${body}`), end_function);
	
					break;
	
				case "header": 
					if(response.headers[queue_item.value] !== queue_item.extra) {
						return this._ended(new Error(`the header ${queue_item.value} is not the same as ${queue_item.extra}`), end_function);
					}
	
					break;
	
				case "cookie": 
					const cookies = response.headers["set-cookie"];
					let found = false;
	
					if(cookies === undefined) return this._ended(new Error("there were no cookies send"), end_function);
	
					for(let x = 0; x < cookies.length; x++) {
						const cookie = cookies[x];
						const key = cookie.substring(0, cookie.indexOf("="));
						const value = cookie.substring(cookie.indexOf("=") + 1, cookie.length);
	
						if(key === queue_item.value) {
							if(value !== queue_item.extra) return this._ended(new Error(`the cookie ${key} is not the same as ${queue_item.extra}`), end_function);
	
							found = true;
						}
					}
	
					if(!found) return this._ended(new Error(`the cookie ${queue_item.value} didn't exist`), end_function);
					
					break;
	
				case "enc":
					if(response.headers["content-encoding"] !== queue_item.value) {
						return this._ended(new Error(`the encoding is not the same as ${queue_item.value}`), end_function);
					}
	
					break;
	
				case "type":
					if(response.headers["content-type"] !== queue_item.value) {
						return this._ended(new Error(`the type is not the same as ${queue_item.value}`), end_function);
					}
	
					break;
			
				case "lang":
					if(response.headers["content-language"] !== queue_item.value) {
						return this._ended(new Error(`the language is not the same as ${queue_item.value}`), end_function);
					}
	
					break;
				
				case "length":
					let length = response.headers["content-length"];
	
					if(typeof length === "string") length = parseInt(length);
	
					if(length != queue_item.value) return this._ended(new Error(`the length is not the same as ${queue_item.value}`), end_function);
	
					break;
	
				case "status":
					if(response.statusCode !== queue_item.value) {
						return this._ended(new Error(`the status is not the same as ${queue_item.value}`), end_function);
					}
	
					break;
	
				default:
					return this._ended(`the key ${queue_item.key} doesn't exist`, end_function);
			}
		}
	
		this._ended(undefined, end_function);
	}

	_ended(error, end_function) {
		if(typeof end_function === "function") {
			return end_function(error);
		}
		else if(error instanceof Error) {
			throw error;
		}
	}
}