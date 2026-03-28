const User = require('../models/User');

/**
 * GET /api/admin/users  — List all users with pagination
 */
const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({}).select('-password -refreshToken').skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
};

/**
 * PUT /api/admin/users/:id/ban  — Ban or unban a user
 */
const toggleBanUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (user.role === 'admin') {
    return res.status(403).json({ success: false, message: 'Cannot ban an admin user' });
  }

  user.isBanned = !user.isBanned;
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
    data: { isBanned: user.isBanned },
  });
};

/**
 * DELETE /api/admin/users/:id  — Delete a user account
 */
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (user.role === 'admin') {
    return res.status(403).json({ success: false, message: 'Cannot delete an admin user' });
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
};

/**
 * GET /api/admin/stats  — Dashboard stats
 */
const getDashboardStats = async (req, res) => {
  const [totalUsers, bannedUsers, adminUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isBanned: true }),
    User.countDocuments({ role: 'admin' }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers: totalUsers - bannedUsers,
      bannedUsers,
      adminUsers,
    },
  });
};

module.exports = { getUsers, toggleBanUser, deleteUser, getDashboardStats };
