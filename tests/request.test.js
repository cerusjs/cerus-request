var expect = require("chai").expect;
var http = require("http");
var request = require("../index")().request;
var server = function(func) {
	var server_ = http.createServer(function(req, res) {
		if(typeof func === "function") {
			func(req, res);
		}
	});

	return server_;
}

describe("request", function() {
	describe("constructor", function() {
		context("with no parameters", function() {
			it("shouldn't throw an error", function() {
				var func = function() {
					request();
				}

				expect(func).to.not.throw();
			});
		});
	});

	describe("#send", function() {
		context("with no running server", function() {
			it("should throw an error", function() {
				request()
				.send(function(err) {
					var func = function() {
						throw err;
					}

					expect(func).to.throw();
				});
			});
		});


		context("with a running server", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.send(function(err) {
						if(err) throw err;

						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#host", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.host();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.host("localhost")
					.send(function(err) {
						if(err) throw err;

						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#port", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.port();
				}

				expect(func).to.throw();
			});
		});

		context("with a number as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(8080, function() {
					request()
					.port(8080)
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#protocol", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.protocol();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.protocol("http:")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#path", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.path();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.path("/test")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#method", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.method();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.method("POST")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#header", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.header();
				}

				expect(func).to.throw();
			});
		});

		context("with one string as parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.header("test");
				}

				expect(func).to.throw();
			});
		});

		context("with two strings as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.header("Accepts", "This is a header")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});

		context("with multiple headers", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.header("Header1", "This is header one")
					.header("Header2", "This is header two")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#cookie", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.cookie();
				}

				expect(func).to.throw();
			});
		});

		context("with one string as parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.cookie("test");
				}

				expect(func).to.throw();
			});
		});

		context("with two strings as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					expect(req.headers["cookie"]).to.equal("Test=This is a cookie");
					res.end();
				});
				server_.listen(80, function() {
					request()
					.cookie("Test", "This is a cookie")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});

		context("with multiple cookies", function() {
			it("should send them both", function(done) {
				var server_ = server(function(req, res) {
					expect(req.headers["cookie"]).to.equal("Test1=This is cookie one; Test2=This is cookie two");
					res.end();
				});
				server_.listen(80, function() {
					request()
					.cookie("Test1", "This is cookie one")
					.cookie("Test2", "This is cookie two")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#agent", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.agent();
				}

				expect(func).to.throw();
			});
		});

		context("with a boolean as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.agent(false)
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});

		context("with an agent as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.agent(http.globalAgent)
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#encoding", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.encoding();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.encoding("deflate")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#language", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.language();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.language("en")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#charset", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.charset();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.charset("utf-8")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#type", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.type();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.type("text/html")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#cache", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.cache();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.cache("no-cache")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#referer", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.referer();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.referer("localhost")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#timeout", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request()
					.timeout();
				}

				expect(func).to.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should send the request", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.timeout(10000)
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#body", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request().body();
				}

				expect(func).to.throw();
			});
		});

		context("with no content-length set", function() {
			it("should send the body with content-length" , function(done) {
				var server_ = server(function(req, res) {
					req.on("data", function(data) {
						expect(data.toString()).to.equal("test");
						res.end();
					});
				});
				server_.listen(80, function() {
					request()
					.body("test")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});

		context("with a pre-set content-length", function() {
			it("should not override body content-length", function(done) {
				var server_ = server(function(req, res) {
					expect(req.headers["content-length"]).to.equal("100");
					res.end();
				});
				server_.listen(80, function() {
					request()
					.header("content-length", "100")
					.body("test")
					.send(function(err) {
						if(err) throw err;
						
						server_.close();
						done();
					});
				});
			});
		});
	});

	describe("#expect", function() {
		context("with no arguments", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request().expect();
				}

				expect(func).to.throw();
			});
		});

		context("with one string as arguments", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request().expect("test");
				}

				expect(func).to.throw();
			});
		});

		context("with a non-existant key", function() {
			it("should throw an Error", function(done) {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.expect("test", "test")
					.send(function(err) {
						var func = function() {
							if(err) {
								throw err;
							}
						}

						server_.close();
						expect(func).to.throw();
						done();
					});
				});
			});
		});

		context("with one string as arguments", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					request().expect("test");
				}

				expect(func).to.throw();
			});
		});

		context("with the key 'body'", function() {
			context("with an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.end("string124", "utf-8");
					});
					server_.listen(80, function() {
						request()
						.expect("body", "string123")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.end("string123", "utf-8");
					});
					server_.listen(80, function() {
						request()
						.expect("body", "string123")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});

		context("with the key 'header'", function() {
			context("with an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("test", "Test");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("header", "test", "NotTest")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("test", "Test");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("header", "test", "Test")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});

		context("with the key 'cookie'", function() {
			context("with no cookies and an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("cookie", "test", "non-existant")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a single cookie and another cookie expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("set-cookie", "test2=value");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("cookie", "test1", "non-existant")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a single cookie and an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("set-cookie", "test=value");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("cookie", "test", "notvalue")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a single cookie and a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("set-cookie", "test=value");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("cookie", "test", "value")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});

			context("with multiple cookies and an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("set-cookie", ["test1=value1", "test2=value2"]);
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("cookie", "test1", "notvalue1")
						.expect("cookie", "test2", "notvalue2")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with multiple cookies and a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("set-cookie", ["test1=value1", "test2=value2"]);
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("cookie", "test1", "value1")
						.expect("cookie", "test2", "value2")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});

		context("with the key 'enc'", function() {
			context("with an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("content-encoding", "utf-8");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("enc", "deflate")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("content-encoding", "utf-8");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("enc", "utf-8")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});

		context("with the key 'type'", function() {
			context("with an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("content-type", "text/plain");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("type", "text/html")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("content-type", "text/plain");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("type", "text/plain")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});

		context("with the key 'lang'", function() {
			context("with an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("content-language", "en");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("lang", "nl")
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.setHeader("content-language", "en");
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("lang", "en")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});

		context("with the key 'length'", function() {
			context("with an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.end("abcde", "utf-8");
					});
					server_.listen(80, function() {
						request()
						.expect("length", 10)
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.end("abcde", "utf-8");
					});
					server_.listen(80, function() {
						request()
						.expect("length", 5)
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});

			context("with a string value expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.end("abcde", "utf-8");
					});
					server_.listen(80, function() {
						request()
						.expect("length", "5")
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});

		context("with the key 'status'", function() {
			context("with an incorrect expectation", function() {
				it("should throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.statusCode = 400;
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("status", 200)
						.send(function(err) {
							var func = function() {
								if(err) {
									throw err;
								}
							}

							server_.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", function() {
				it("shouldn't throw an error", function(done) {
					var server_ = server(function(req, res) {
						res.statusCode = 400;
						res.end();
					});
					server_.listen(80, function() {
						request()
						.expect("status", 400)
						.send(function(err) {
							server_.close();

							if(err) {
								throw err;
							}

							done();
						});
					});
				});
			});
		});
	});

	describe("chain", function() {
		context("chained multiple requests", function() {
			it("should behave normally", function() {
				var server_ = server(function(req, res) {
					res.end();
				});
				server_.listen(80, function() {
					request()
					.send()
					.send(function(err) {
						server_.close();

						if(err) {
							throw err;
						}

						done();
					});
				});
			});
		});
	});
});