import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token or user inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Check if user has specific permission
export const requirePermission = (resource, action) => {
  return (req, res, next) => {
    const user = req.user;

    // Super admin has all permissions
    if (user.role === 'super_admin') {
      return next();
    }

    // Check if user has the required permission
    const hasPermission = user.permissions.some(permission => 
      permission.resource === resource && 
      (permission.action === action || permission.action === 'manage')
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: `${action} on ${resource}`
      });
    }

    next();
  };
};

// Check if user can access specific department
export const requireDepartmentAccess = (departmentId) => {
  return (req, res, next) => {
    const user = req.user;

    // Super admin and admin can access all departments
    if (user.role === 'super_admin' || user.role === 'admin') {
      return next();
    }

    // Department-specific users can only access their department
    if (user.department !== departmentId) {
      return res.status(403).json({ 
        error: 'Department access denied',
        userDepartment: user.department,
        requiredDepartment: departmentId
      });
    }

    next();
  };
};