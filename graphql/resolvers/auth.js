const User = require("../../models/user");

const bcrypt = require("bcryptjs");

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({
                email: args.userInput.email })
            if (existingUser) {
                window.alert('User already exists');
                return;
            }
            const hashedPw = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPw
            });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id };
        }
        catch (err) {
            throw err;
        }
    }
};