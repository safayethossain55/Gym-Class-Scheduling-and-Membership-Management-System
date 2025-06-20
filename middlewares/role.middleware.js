module.exports = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({ message: 'Unauthorized: No user role found' });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Access denied for your role' });
      }

      next(); 
    } catch (error) {
      res.status(500).json({ message: 'Server error in role check' });
    }
  };
};
