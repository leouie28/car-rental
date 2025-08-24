import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "secret_key"

export const authenticateClient = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Attach the user object (or userId) to the req object
    req.userId = user.id; // Assuming your JWT payload contains an 'id' field
    next(); // Move to the next middleware or route handler
  });
}