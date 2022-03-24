const User = require("../../models/user");

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

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
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('Invalid user and password combination');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Invalid user and password combination');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesecretkeythatyouneed',
            { expiresIn: '1h' });
        return { userId: user.id, token: token, tokenExpiration: 1 };
    }
};