const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async ({ name, email, password, isVet }) => {
    try {
        const user = await User.create({ name, email, password, isVet });
        const token = jwt.sign({ id: user.id, isVet,name }, '123', { expiresIn: '1d' });
        return { status: 201, data: { message: 'User registered successfully', userId: user.id,name:name,email:email,isVet:isVet,token } };
    } catch (error) {
        return { status: 500, data: { message: 'Error registering user' } };
    }
};

const login = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { status: 401, data: { message: 'Incorrect email or password' } };
        }
        const token = jwt.sign({ id: user.id, isVet: user.isVet,name:user.name }, '123', { expiresIn: '1d' });
        return { status: 200, data: { token, userId: user.id,name:user.name ,isVet:user.isVet} };
    } catch (error) {
        return { status: 500, data: { message: 'Error logging in' } };
    }
};

module.exports = { register, login };
