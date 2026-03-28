import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, ShieldExclamationIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data.users);
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBanToggle = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/ban`);
      setUsers((prev) =>
        prev.map((u) => u._id === userId ? { ...u, isBanned: res.data.data.isBanned } : u)
      );
      toast.success(res.data.message);
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setActionLoading(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setActionLoading(null);
    }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'text-blue-400' },
    { label: 'Active Users', value: stats.activeUsers, icon: ChartBarIcon, color: 'text-green-400' },
    { label: 'Banned Users', value: stats.bannedUsers, icon: ShieldExclamationIcon, color: 'text-red-400' },
    { label: 'Admin Users', value: stats.adminUsers, icon: ShieldExclamationIcon, color: 'text-yellow-400' },
  ] : [];

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-cinema-black)] pt-20 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-white mb-2">Admin Dashboard</h1>
        <p className="text-[var(--color-cinema-muted)] mb-8">Manage users and platform data</p>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {statCards.map((card) => (
              <motion.div
                key={card.label}
                className="glass rounded-2xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
                <p className="text-3xl font-black text-white">{card.value}</p>
                <p className="text-sm text-[var(--color-cinema-muted)] mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Users Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-cinema-border)]">
            <h2 className="text-lg font-bold text-white">User Management</h2>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 rounded w-1/4" />
                    <div className="skeleton h-2.5 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-cinema-border)]">
                    {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[var(--color-cinema-muted)] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-cinema-border)]">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-[var(--color-cinema-muted)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--color-cinema-muted)]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {user.role !== 'admin' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleBanToggle(user._id)}
                              disabled={actionLoading === user._id}
                              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50 ${
                                user.isBanned
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              }`}
                            >
                              {user.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={actionLoading === user._id}
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium transition-all disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
