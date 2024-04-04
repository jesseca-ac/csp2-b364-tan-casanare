//require('dotenv').config()
const jwt = require("jsonwebtoken");
const secret = "CourseBookingAPI";

// Creates Access Token
module.exports.createAccessToken = (user) => {
    // The data will be received from the registration form
    // When the user logs in, a token will be created with user's information
    const data = {
        id : user._id,
        email : user.email,
        isAdmin : user.isAdmin
    };

    // Generate a JSON web token using the jwt's sign method
    // Generates the token using the form data and the secret code with no additional options provided
    return jwt.sign(data, secret, {});
    
};

// Verify User
module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);

    // "req.headers.authorization" contains sensitive data and especially our token
    let token = req.headers.authorization;

    // This if statement will first check if a token variable contains "undefined" or a proper jwt.  we will check token's data type with "typeof", if it is "undefined" we will send a message to the client. Else if it is not, then we return the token.
    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
        console.log(token);     
        token = token.slice(7, token.length);
        console.log(token);

        //[SECTION] Token decryption
        /*
        Analogy
            Open the gift and get the content
        - Validate the token using the "verify" method decrypting the token using the secret code.
        - token - the jwt token passed from the request headers.
        - secret - the secret word from earlier which validates our token
        - function(err,decodedToken) - err contains the error in verification, decodedToken contains the decoded data within the token after verification
        */
        // "err" is a built-in variable of express to handle errors
        jwt.verify(token, secret, function(err, decodedToken){
            
            //If there was an error in verification, an erratic token, a wrong secret within the token, we will send a message to the client.
            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message
                });

            } else {

                // Contains the data from our token
                console.log("result from verify method:")
                console.log(decodedToken);
                
                // Else, if our token is verified to be correct, then we will update the request and add the user's decoded details.
                req.user = decodedToken;

                // next() is an expressJS function which allows us to move to the next function in the route. It also passes details of the request and response to the next function/middleware.
                next();
            }
        })
    }
};

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