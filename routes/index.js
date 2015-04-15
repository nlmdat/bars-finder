var finder = require('../finder/finder');


module.exports = function(app, query, passport, bars) {

	app.get("/", function(req, res) {
		var results = null;
		if (req.query["search"]) {
			results = finder(req.body["search"]);
		}
		res.render("index", {results: results, query: req.query["search"], nav: "home"});
	});

	app.get("/login", function(req, res) {
		if (req.user) res.redirect("/");
		res.render("login", {message: req.flash("loginMessage"), auth: true});
	});

	app.post("/login", passport.authenticate("local-login", {
			failureRedirect: "/login",
			failureFlash: true,
		}), function(req, res) {
			res.cookie("username", req.user.username);
			if (req.body.remember) {
				res.cookie("maxAge", 1000 * 60 * 3);
			} else {
				res.cookie("expires", "false");
			}
			res.redirect("/");
		}
	);

	app.get("/signup", function(req, res) {
		res.render("signup", {message: req.flash("signupMessage"), auth: true});
	});

	app.post("/signup", passport.authenticate("local-signup", {
			successRedirect: "/",
			failureRedirect: "/signup",
			failureFlash: true
		})
	);

	app.get("/logout", function(req, res) {
		req.logout();
		res.redirect("/");
	});

	app.get("/bars/:id", function(req, res) {
		console.log(req.params.id);
		bars.fetchBarDetails(query, req.params.id, function(data) {
			if (req.user && req.user.id == req.params.id && data) {
				data.editable = true;
			}
			res.render("bars", {nav: "bars", data: data, id: req.params.id});
		});
	});

	app.post("/bars/:id", function(req, res) {
		if (!req.user || req.user.id != req.params.id) {
			res.send("Error: must login as bar to edit.");
		} else {
			bars.changeBarDetails(query, req.params.id, req.body, function(data) {
				res.send(data);
			});
		}
	});

	app.get("/schedule/:id", function(req, res) {
		console.log(req.params.id);
		bars.fetchSchedule(query, req.params.id, function(data) {
			if (req.user && req.user.id == req.params.id && data) {
				data.editable = true;
			}
			/*var sch = new Array(7);
			for (var i = 0; i< 7;i++) sch[i]=[];
			sch[0].push({detail:"Roger Federer - Rafael Nadal", time:"21:00"});
			sch[1].push({detail:"Sharapova - Venus Williams", time:"21:00"});
			bars.changeSchedule(query, 2, JSON.stringify(sch), function (data) {
			res.render("schedule", {nav: "schedule", data: data, id: req.params.id});
			})*/
			res.render("schedule", {nav: "schedule", data: data, id: req.params.id});
		});
	});

	app.post("/schedule/:id", function(req, res) {
		if (!req.user || req.user.id != req.params.id) {
			res.send("Error: must login as bar to edit.");
		} else {
			console.log(req.body.schedule);
			bars.changeSchedule(query, req.params.id, req.body.schedule, function(data) {
				res.send(data);
			});
		}
	});
}
