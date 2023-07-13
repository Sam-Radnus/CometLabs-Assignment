import jwt from 'jsonwebtoken';

export const authMiddleware = async(req, res, next) => {
  try {
    // 1. Extract the access token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    
    // 2. Verify the JWT token
    if (!token) {
      throw new Error('Access token not found');
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    // 3. Extract the user's role from the decoded token
    const userRole = decodedToken.role;
    
    // 4. Attach the role information to the request object
    req.userRole = userRole;
    
    // Call the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;
