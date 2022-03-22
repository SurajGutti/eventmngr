const Event = require("../../models/event");
const User = require("../../models/user");

const bcrypt = require("bcryptjs");

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    }
    catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return { ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        }
        catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '6239ba90fcd7d2ec2736ffed'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) };
            const creator = await User.findById('6239ba90fcd7d2ec2736ffed');
            if (!creator) {
                window.alert('User not found');
                return;
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        }
        catch (err) {
            throw err;
        }
    },
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
}