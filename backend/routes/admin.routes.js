const express = require('express');
const router = express.Router();
const { getUsers, toggleBanUser, deleteUser, getDashboardStats } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/ban', toggleBanUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
