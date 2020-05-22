const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { RegisterValidator, LoginValidator } = require('../middlewares/Validator');

const UserController = {};

UserController.create = async (req, res) => {
    const { name, email, password, role } = req.body;
    const validator = RegisterValidator({ name, email, password, role });
    if (validator.error){
        req.session.alert = {error: validator.error};
        return res.redirect('/users');
    };
    const userExists = await User.findOne({ email: validator.value.email });
    if (userExists) {
        req.session.alert = { error:  "User already exist with this email account."};
        return res.redirect('/users');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email: validator.value.email, password: hashedPassword, role});
    try {
        const savedUser = await newUser.save();
        req.session.alert = { success:  `New user (${savedUser.email}) has been created successfully!`};
        return res.redirect('/users');
    } catch (error) {
        req.session.alert = { error:  "User already exist with this email account."};
        res.redirect('/users');
    }
}


UserController.getUsers = async (req, res) => {
    const users = await User.find({});
    res.render('users', {users});
};

UserController.deleteUser = async (req, res) => {
    console.log(req.params.id)
    const user = await User.findByIdAndDelete({_id: req.params.id});
    req.session.alert = { success:  `A user (${user.email}) has been deleted successfully!`};
    res.redirect('/users');
};

UserController.getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id
        });
        if (user) return res.send({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
        res.send("User Doesn't Exist");
    } catch (e) {
        console.error(e);
    }
};

UserController.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate({_id: req.params.id}, {$set: req.body});
    req.session.alert = { success:  `A user (${user.email}) has been updated successfully!`};
    res.redirect('/users');
};

UserController.login = async (req, res) => {
    const { email, password } = req.body;
    const validator = LoginValidator({ email, password });
    if (validator.error){
        req.session.alert = {error: validator.error};
        return res.redirect('/');
    };
    const user = await User.findOne({ email: validator.value.email });
    if (!user) {
        req.session.alert = {error: "User doesn't exist with this email account."};
        return res.redirect('/');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        req.session.alert = {error: "Invalid Password!"};
        return res.redirect('/');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: "7d" });
    res.header('auth-token', token).send(token);
}

module.exports = UserController;