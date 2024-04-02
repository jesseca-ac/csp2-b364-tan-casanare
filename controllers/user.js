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
module.exports.loginUser = (req, res) => {
    if (req.body.email.toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
        User.findOne({ email: req.body.email })
            .then(result => {
                if (result == null) {
                    return res.status(404).send({ error: "No Email Found" });
                }

                else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                    if (isPasswordCorrect) {
                        return res.status(200).send({ access: auth.createAccessToken(result) })

                    }

                    else {
                        return res.status(401).send({ message: "Email and password do not match" });
                    }
                }
            })
            .catch(err => {
                return res.status(500).send({ error: `User Not Found: ${err}` });
            })
    }

    else {
        return res.status(400).send({ error: "Email format invalid" });
    }
}

// RESET PASSWORD
module.exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.user;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).send({ message: 'Reset Successful' });
    }

    catch (err) {
        res.status(500).send({ message: `Reset Error: ${err}` });
    }
};


// GET OWN USER DETAILS
module.exports.getProfile = (req, res) => {
    const userId = req.user.id;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: 'User Not Found' });
            }

            else {
                return res.status(200).send({ user });
            }

        })

        .catch(err => {
            return res.status(500).send({ error: `GET Profile Failed: ${err}` })
        })
};


// UPDATE OWN USER DETAILS
module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, mobileNo, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, mobileNo, email },
            { new: true }
        );
        res.status(200).send({ message: "Profile Updated Successfully", updatedUser })

    }

    catch (err) {
        res.status(500).send({ error: `Failed to Update Profile: ${err}` });
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


// GET OTHER USER DETAILS (admin access required)
module.exports.getUser = (req, res) => {
    const userEmail = req.body.email;
    User.findOne({ email: userEmail })
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: 'User Not Found' });
            }

            else {
                return res.status(200).send({ user });
            }

        })

        .catch(err => {
            return res.status(500).send({ error: `GET Profile Failed: ${err}` })
        })
};