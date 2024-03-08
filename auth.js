require('dotenv').config()
const jwt = require("jsonwebtoken");
//const secret = process.env.encryptionKey;
const secret = "ECommerceAPI";



// Creates Access Token
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    return jwt.sign(data, secret, {});
}



// Verify User
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization

    if (typeof token === "undefined") {
        return res.status(401).send({
            auth: "Failed",
            message: "Verification Failed - No Token"
        })

    } else {
        token = token.slice(7, token.length)

        jwt.verify(token, secret, function (err, decodedToken) {
            if (err) {
                return res.status(401).send({
                    auth: "Failed",
                    message: err.message
                })

            } else {
                req.user = decodedToken;
                next();
            }
        })
    }
}



// Verify if User is Admin
module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();

    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden - User Not Admin"
        })
    }
}



// Checks if User is Logged In
module.exports.isLoggedIn = (req, res, next) => {
	if (req.user) {
		next();

	} else {
		res.status(401).send({
            auth: "Failed",
            message: "User Not Logged In"
        });
	}
}