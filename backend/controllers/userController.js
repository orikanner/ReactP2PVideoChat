const authService = require("../services/authService");
const jwt = require('jsonwebtoken');


const signup = async (req, res) => {
  console.log(req.body);
  const result = await authService.register(req.body);
  res.status(result.status).json(result.data);
};

const signin = async (req, res) => {
  const result = await authService.login(req.body);
  res.status(result.status).json(result.data);
};

const validToken = async (req, res) => {
  
  try {
    if (!req.headers.authorization) throw new Error('No token provided');
    
    const token = req.headers.authorization.split(" ")[1]; // Bearer TOKEN
    if (!token) throw new Error('Bearer token malformed');

    // console.log(token);
    const decoded = jwt.verify(token, '123'); // Use environment variable for the secret
    // console.log("Decoded:", decoded); // Optionally log decoded token for debugging

    // Typically return user data or a success message instead of the token
    return res.status(200).json({ message: "Token is valid", user: decoded ,token:token});
  } catch (error) {
    console.error("Authentication validation failed:", error.message);
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = { signup, signin, validToken };
