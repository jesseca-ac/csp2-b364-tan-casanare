require('dotenv').config()
const jwt = require("jsonwebtoken");
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

    // console.log() is used to confirm that "req.user" is added if the "verify" method comes first
    // Else, it will be undefined.
    // console.log("result from verifyAdmin method");
    // console.log(req.user);

    // Checks if the owner of the token is an admin.
    if(req.user.isAdmin){
        // If it is, move to the next middleware/controller using next() method.
        next();
    } else {
        // Else, end the request-response cycle by sending the appropriate response and status code.
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }

}