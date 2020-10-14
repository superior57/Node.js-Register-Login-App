var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', (req, res, next) => {
	res.redirect('/login');
	return res.render('index.ejs');
});


router.post('/', (req, res, next) => {
	console.log(req.body);
	var personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					var c;
					User.findOne({}, (err, data) => {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						var newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', (req, res, next) => {
	if (req.session.userId) {
		res.redirect('/profile');		
	} else {
		return res.render('login.ejs');
	}
});

router.post('/login', (req, res, next) => {
	const { email, password } = req.body;
	if( email == "admin@admin.com" && password == "test123" ) {
		req.session.userId = "1";
		console.log(req.session.userId);
		// res.send({ "Success": "Success!" });
		console.log("dddd");
		res.redirect('/profile');
		res.send();
	} else {
		res.send({ "Success": "Wrong password!" });
	}
});

router.get('/profile', (req, res, next) => {
	if(req.session.userId) {
		const data = {
			"name": "Admin",
			"email": "admin@admin.com"
		};
		console.log("123");
		return res.render('data.ejs', data);
	} else {
		res.redirect('/login');	
	}
});

router.get('/logout', (req, res, next) => {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});

router.post('/forgetpass', (req, res, next) => {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, (err, data) => {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			// res.send({"Success":"Success!"});
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

module.exports = router;