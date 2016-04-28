"use strict";

var path = require("path");


module.exports = function(router) {

	function hasRoute(value) {
		let length = router.stack.length;
		for (var i = 0; i < length; i++) {
			var route = router.stack[i];
			if (route.route && route.route.methods.get) {
				console.log(route.route.path);
				if(route.regexp.test(value)) {
					return true;
				}
			}
		}
		return false;
	}


	router.use(function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		if (hasRoute(req.path)) {
			req.session.returnTo = path.join(req.baseUrl, req.path);
		}
		res.redirect('/login');
	});

	router.use(function (req, res, next) {
		res.locals.user = req.user;
		next();
	});


}
