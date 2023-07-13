export const check=async(req,res)=>{
    if (req.userRole === 'admin') {
        // Only admins can access this route
        res.send('Admin route');
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
}

