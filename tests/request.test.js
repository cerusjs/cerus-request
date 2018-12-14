const expect = require("chai").expect;
const http = require("http");
const request = require("../index")().request;
const server = (func) => {
	const _server = http.createServer((req, res) => {
		if(typeof func === "function") {
			func(req, res);
		}
	});

	return _server;
}

describe("request", () => {
	describe("constructor", () => {
		context("with no parameters", () => {
			it("shouldn't throw an error", () => {
				const func = () => {
					request();
				}

				expect(func).to.not.throw();
			});
		});
	});

	describe("#send", () => {
		context("with no running server", () => {
			it("should throw an error", () => {
				request()
				.send(err => {
					const func = () => {
						throw err;
					}

					expect(func).to.throw();
				});
			});
		});


		context("with a running server", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.send(err => {
						if(err) throw err;

						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#host", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.host("localhost")
					.send(err => {
						if(err) throw err;

						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#port", () => {
		context("with a number as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(8080, () => {
					request()
					.port(8080)
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#protocol", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.protocol("http:")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#path", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.path("/test")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#method", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.method("POST")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#header", () => {
		context("with two strings as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.header("Accepts", "This is a header")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});

		context("with multiple headers", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.header("Header1", "This is header one")
					.header("Header2", "This is header two")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#cookie", () => {
		context("with two strings as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => {
					expect(req.headers["cookie"]).to.equal("Test=This is a cookie");
					res.end();
				});

				_server.listen(80, () => {
					request()
					.cookie("Test", "This is a cookie")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});

		context("with multiple cookies", () => {
			it("should send them both", done => {
				const _server = server((req, res) => {
					expect(req.headers["cookie"]).to.equal("Test1=This is cookie one; Test2=This is cookie two");
					res.end();
				});

				_server.listen(80, () => {
					request()
					.cookie("Test1", "This is cookie one")
					.cookie("Test2", "This is cookie two")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#agent", () => {
		context("with a boolean as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.agent(false)
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});

		context("with an agent as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.agent(http.globalAgent)
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#encoding", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.encoding("deflate")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#language", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.language("en")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#charset", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.charset("utf-8")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#type", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.type("text/html")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#cache", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.cache("no-cache")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#referer", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.referer("localhost")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#timeout", () => {
		context("with a string as parameter", () => {
			it("should send the request", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.timeout(10000)
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#body", () => {
		context("with no content-length set", () => {
			it("should send the body with content-length" , done => {
				const _server = server((req, res) => {
					req.on("data", function(data) {
						expect(data.toString()).to.equal("test");
						res.end();
					});
				});

				_server.listen(80, () => {
					request()
					.body("test")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});

		context("with a pre-set content-length", () => {
			it("should not override body content-length", done => {
				const _server = server((req, res) => {
					expect(req.headers["content-length"]).to.equal("100");
					res.end();
				});

				_server.listen(80, () => {
					request()
					.header("content-length", "100")
					.body("test")
					.send(err => {
						if(err) throw err;
						
						_server.close();
						done();
					});
				});
			});
		});
	});

	describe("#expect", () => {
		context("with a non-existant key", () => {
			it("should throw an error", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.expect("test", "test")
					.send(err => {
						const func = () => {
							if(err) throw err;
						};

						_server.close();
						expect(func).to.throw();
						done();
					});
				});
			});
		});

		context("with the key 'body'", () => {
			context("with an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => res.end("string124", "utf-8"));

					_server.listen(80, () => {
						request()
						.expect("body", "string123")
						.send(err => {
							const func = () => {
								if(err) throw err;
							};

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => res.end("string123", "utf-8"));

					_server.listen(80, () => {
						request()
						.expect("body", "string123")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});

		context("with the key 'header'", () => {
			context("with an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("test", "Test");
						res.end();
					});
					
					_server.listen(80, () => {
						request()
						.expect("header", "test", "NotTest")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("test", "Test");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("header", "test", "Test")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});

		context("with the key 'cookie'", () => {
			context("with no cookies and an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => res.end());

					_server.listen(80, () => {
						request()
						.expect("cookie", "test", "non-existant")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a single cookie and another cookie expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("set-cookie", "test2=value");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("cookie", "test1", "non-existant")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a single cookie and an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("set-cookie", "test=value");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("cookie", "test", "notvalue")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a single cookie and a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("set-cookie", "test=value");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("cookie", "test", "value")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});

			context("with multiple cookies and an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("set-cookie", ["test1=value1", "test2=value2"]);
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("cookie", "test1", "notvalue1")
						.expect("cookie", "test2", "notvalue2")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with multiple cookies and a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("set-cookie", ["test1=value1", "test2=value2"]);
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("cookie", "test1", "value1")
						.expect("cookie", "test2", "value2")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});

		context("with the key 'enc'", () => {
			context("with an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("content-encoding", "utf-8");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("enc", "deflate")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("content-encoding", "utf-8");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("enc", "utf-8")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});

		context("with the key 'type'", () => {
			context("with an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("content-type", "text/plain");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("type", "text/html")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("content-type", "text/plain");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("type", "text/plain")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});

		context("with the key 'lang'", () => {
			context("with an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("content-language", "en");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("lang", "nl")
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => {
						res.setHeader("content-language", "en");
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("lang", "en")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});

		context("with the key 'length'", () => {
			context("with an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => res.end("abcde", "utf-8"));

					_server.listen(80, () => {
						request()
						.expect("length", 10)
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => res.end("abcde", "utf-8"));

					_server.listen(80, () => {
						request()
						.expect("length", 5)
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});

			context("with a string value expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => res.end("abcde", "utf-8"));

					_server.listen(80, () => {
						request()
						.expect("length", "5")
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});

		context("with the key 'status'", () => {
			context("with an incorrect expectation", () => {
				it("should throw an error", done => {
					const _server = server((req, res) => {
						res.statusCode = 400;
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("status", 200)
						.send(err => {
							const func = () => {
								if(err) throw err;
							}

							_server.close();
							expect(func).to.throw();
							done();
						});
					});
				});
			});

			context("with a correct expectation", () => {
				it("shouldn't throw an error", done => {
					const _server = server((req, res) => {
						res.statusCode = 400;
						res.end();
					});

					_server.listen(80, () => {
						request()
						.expect("status", 400)
						.send(err => {
							_server.close();

							if(err) throw err;

							done();
						});
					});
				});
			});
		});
	});

	describe("chain", () => {
		context("chained multiple requests", () => {
			it("should behave normally", done => {
				const _server = server((req, res) => res.end());

				_server.listen(80, () => {
					request()
					.send()
					.send(err => {
						_server.close();

						if(err) throw err;

						done();
					});
				});
			});
		});
	});
});