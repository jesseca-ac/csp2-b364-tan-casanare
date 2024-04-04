const User = require("../models/User");
const bcrypt = require('bcrypt');
const auth = require("../auth");


// REGISTER USER
module.exports.registerUser = (req,res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({ error: "Email invalid" });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ error: "Mobile number invalid" });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be atleast 8 characters" });
    // If all needed requirements are achieved
    } else {
        // Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
        // Uses the information from the request body to provide all the necessary information
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        // Saves the created object to our database
        // Then, return result to the handler function. No return keyword used because we're using arrow function's implicit return feature
        // catch the error and return to the handler function. No return keyword used because we're using arrow function's implicit return feature
        return newUser.save()
        .then((user) => res.status(201).send({ message: "Registered Successfully" }))
        .catch(err => {
            console.error("Error in saving: ", err)
            return res.status(500).send({ error: "Error in saving"})
        })
    }

};


// LOGIN USER
module.exports.loginUser = (req,res) => {
    // The "findOne" method returns the first record in the collection that matches the search criteria
    // We use the "findOne" method instead of the "find" method which returns all records that match the search criteria
    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {

            // User does not exist
            if(result == null){

                // Send the message to the user
                return res.status(404).send({ error: "No Email Found" });

            // User exists
            } else {

                // Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
                // The "compareSync" method is used to compare a non encrypted password from the login form to the encrypted password retrieved from the database and returns "true" or "false" value depending on the result
                // A good coding practice for boolean variable/constants is to use the word "is" or "are" at the beginning in the form of is+Noun
                    //example. isSingle, isDone, isAdmin, areDone, etc..
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                // If the passwords match/result of the above code is true
                if (isPasswordCorrect) {

                    // Generate an access token
                    // Uses the "createAccessToken" method defined in the "auth.js" file
                    // Returning an object back to the client application is common practice to ensure information is properly labeled and real world examples normally return more complex information represented by objects
                    return res.status(200).send({ access : auth.createAccessToken(result)})

                // Passwords do not match
                } else {

                    return res.status(401).send({ message: "Email and password do not match" });

                }

            }

        })
        .catch(err => err);
    } else {
        return res.status(400).send({ error: "Invalid Email" })
    }
};

// RESET PASSWORD
module.exports.resetPassword = async (req, res) => {

    try {

        // Add a console.log() to check if you can pass data properly from postman
        // console.log(req.body);

        // Add a console.log() to show req.user, our decoded token, does not contain userId property but instead id
        // console.log(req.user);

        const { newPassword } = req.body;

        // update userId to id because our version of req.user does not have userId property but id property instead.
        const { id } = req.user; // Extracting user ID from the authorization header

        // Hashing the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update userId update to id
        // Updating the user's password in the database
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        // Sending a success response
        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });

    }

};


// GET OWN USER DETAILS
module.exports.getProfile = (req, res) => {

    // The "return" keyword ensures the end of the getProfile method.
    // Since getProfile is now used as a middleware it should have access to "req.user" if the "verify" method is used before it.
    // Order of middlewares is important. This is because the "getProfile" method is the "next" function to the "verify" method, it receives the updated request with the user id from it.
    return User.findById(req.user.id)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Exclude sensitive information like password
        user.password = undefined;

        return res.status(200).send({ user });
    })
    .catch(err => {
        console.error("Error in fetching user profile", err)
        return res.status(500).send({ error: 'Failed to fetch user profile' })
    });

};


// UPDATE OWN USER DETAILS
module.exports.updateProfile = async (req, res) => {
    try {

        // Add a console.log() to check if you can pass data properly from postman
        // console.log(req.body);

        // Add a console.log() to show req.user, our decoded token, does have id property
        // console.log(req.user);
            
        // Get the user ID from the authenticated token
        const userId = req.user.id;

        // Retrieve the updated profile information from the request body
        // Update the req.body to use mobileNo instead of mobileNumber to match our schema
        const { firstName, lastName, mobileNo } = req.body;

        // Update the user's profile in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, mobileNo },
            { new: true }
        );

        res.send(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to update profile' });
    }
}

// SET USER AS ADMIN (admin access required)
module.exports.setAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;

        const userToUpdate = await User.findOne({ _id: userId });

        if (!userToUpdate) {
            return res.status(404).send({ error: `User not found` });
        }

        userToUpdate.isAdmin = req.body.isAdmin;
        await userToUpdate.save();

        let newAdminStatus = userToUpdate.isAdmin ? "now" : "no longer"
        res.status(200).send({ message: `${userToUpdate.firstName} is ${newAdminStatus} an Admin` });
    }
    
    catch (err) {
        res.status(500).send({ error: `Failed to set user as Admin: ${err.message}` });
    }
};
