import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, FileText, Plus, Pencil, Trash2,
  Loader2, Search, X, ExternalLink, Shield, BarChart3,
  Globe, MapPin, ToggleLeft, ToggleRight, TrendingUp,
  IndianRupee, Sprout, Activity, CheckCircle2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import adminService from '../services/admin.service';
import { AppLayout, PageHeader } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const emptySchemeForm = {
  title: '',
  description: '',
  type: 'central',
  state: '',
  category: '',
  benefits: '',
  eligibility: '',
  link: '',
  ministry: '',
  isActive: true
};

// ============================================
// Stat Card Component
// ============================================
const StatCard = ({ icon, label, value, gradient, trend }) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <div className={`absolute inset-0 opacity-5 ${gradient}`} />
    <CardContent className="p-5 relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {value?.toLocaleString() ?? 0}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-primary-500" />
              <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// ============================================
// Tab Button Component
// ============================================
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
      active
        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

// ============================================
// Empty State Component
// ============================================
const AdminEmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-neutral-400" />
    </div>
    <p className="text-neutral-900 dark:text-white font-medium">{title}</p>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>
  </div>
);

// ============================================
// Status Badge Component
// ============================================
const StatusBadge = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    active 
      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
  }`}>
    {active ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
    {active ? 'Active' : 'Inactive'}
  </span>
);

// ============================================
// Type Badge Component
// ============================================
const TypeBadge = ({ type }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    type === 'central'
      ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
      : 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400'
  }`}>
    {type === 'central' ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
    {type === 'central' ? 'Central' : 'State'}
  </span>
);

// ============================================
// Role Badge Component
// ============================================
const RoleBadge = ({ role }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    role === 'admin'
      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
  }`}>
    {role === 'admin' && <Shield className="w-3 h-3" />}
    {role}
  </span>
);

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Stats
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Schemes
  const [schemes, setSchemes] = useState([]);
  const [isLoadingSchemes, setIsLoadingSchemes] = useState(true);
  const [schemeFilter, setSchemeFilter] = useState('all');

  // Users
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [form, setForm] = useState(emptySchemeForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Active tab
  const [activeTab, setActiveTab] = useState('schemes');

  useEffect(() => {
    fetchStats();
    fetchSchemes();
  }, []);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await adminService.getAdminStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      toast.error('Failed to load stats');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchSchemes = async () => {
    setIsLoadingSchemes(true);
    try {
      const params = {};
      if (schemeFilter !== 'all') params.type = schemeFilter;
      const res = await adminService.getAdminSchemes(params);
      if (res.success) setSchemes(res.data);
    } catch (err) {
      toast.error('Failed to load schemes');
    } finally {
      setIsLoadingSchemes(false);
    }
  };

  const fetchUsers = async (search = '') => {
    setIsLoadingUsers(true);
    try {
      const res = await adminService.getAllUsers({ search, limit: 50 });
      if (res.success) setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [schemeFilter]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(userSearch);
    }
  }, [activeTab]);

  const handleUserSearch = (e) => {
    e.preventDefault();
    fetchUsers(userSearch);
  };

  // Form Handlers
  const openCreateForm = () => {
    setEditingScheme(null);
    setForm(emptySchemeForm);
    setShowForm(true);
  };

  const openEditForm = (scheme) => {
    setEditingScheme(scheme);
    setForm({
      title: scheme.title,
      description: scheme.description,
      type: scheme.type,
      state: scheme.state || '',
      category: scheme.category || '',
      benefits: scheme.benefits || '',
      eligibility: scheme.eligibility || '',
      link: scheme.link || '',
      ministry: scheme.ministry || '',
      isActive: scheme.isActive
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value === 'central' ? { state: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    if (form.type === 'state' && !form.state.trim()) {
      toast.error('Please select a state for state-level schemes');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingScheme) {
        const res = await adminService.updateScheme(editingScheme._id, form);
        if (res.success) {
          toast.success('Scheme updated');
          setShowForm(false);
          fetchSchemes();
        }
      } else {
        const res = await adminService.createScheme(form);
        if (res.success) {
          toast.success('Scheme created');
          setShowForm(false);
          fetchSchemes();
          fetchStats();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save scheme');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await adminService.deleteScheme(deleteTarget._id);
      if (res.success) {
        toast.success('Scheme deleted');
        setDeleteTarget(null);
        fetchSchemes();
        fetchStats();
      }
    } catch (err) {
      toast.error('Failed to delete scheme');
    }
  };

  const handleToggleActive = async (scheme) => {
    try {
      const res = await adminService.updateScheme(scheme._id, { isActive: !scheme.isActive });
      if (res.success) {
        toast.success(scheme.isActive ? 'Scheme deactivated' : 'Scheme activated');
        fetchSchemes();
      }
    } catch (err) {
      toast.error('Failed to update scheme');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage schemes and monitor platform activity</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <span className="text-neutral-500 dark:text-neutral-400">Logged in as </span>
              <span className="font-medium text-neutral-900 dark:text-white">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoadingStats ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={<Users className="w-5 h-5" />} 
              label="Total Users" 
              value={stats.totalUsers}
              gradient="bg-gradient-to-br from-primary-500 to-primary-600"
              trend="+12% this month"
            />
            <StatCard 
              icon={<MessageSquare className="w-5 h-5" />} 
              label="Total Queries" 
              value={stats.totalQueries}
              gradient="bg-gradient-to-br from-sky-500 to-sky-600"
              trend="+28% this week"
            />
            <StatCard 
              icon={<Activity className="w-5 h-5" />} 
              label="Conversations" 
              value={stats.totalConversations}
              gradient="bg-gradient-to-br from-secondary-500 to-secondary-600"
            />
            <StatCard 
              icon={<FileText className="w-5 h-5" />} 
              label="Active Schemes" 
              value={stats.activeSchemes}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-3">
          <TabButton
            active={activeTab === 'schemes'}
            onClick={() => setActiveTab('schemes')}
            icon={FileText}
            label="Schemes"
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            icon={Users}
            label="Users"
          />
        </div>

        {/* Schemes Tab */}
        {activeTab === 'schemes' && (
          <Card className="animate-fadeIn">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-primary-500" />
                    Government Schemes
                  </CardTitle>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Manage central and state-specific schemes for farmers
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={schemeFilter}
                    onChange={(e) => setSchemeFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="central">Central</option>
                    <option value="state">State</option>
                  </select>
                  <button 
                    onClick={openCreateForm} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Scheme
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingSchemes ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : schemes.length === 0 ? (
                <AdminEmptyState 
                  icon={FileText}
                  title="No schemes found"
                  subtitle='Click "Add Scheme" to create one'
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">Title</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">Type</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">State</th>
                        <th className="text-center py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                        <th className="text-center py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemes.map((scheme, index) => (
                        <tr 
                          key={scheme._id} 
                          className={`border-b border-neutral-100 dark:border-neutral-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors ${
                            index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50/50 dark:bg-neutral-800/30'
                          }`}
                        >
                          <td className="py-4 px-5">
                            <div className="font-medium text-neutral-900 dark:text-white">{scheme.title}</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-xs mt-0.5">{scheme.description}</div>
                          </td>
                          <td className="py-4 px-5">
                            <TypeBadge type={scheme.type} />
                          </td>
                          <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300 hidden md:table-cell">
                            {scheme.category || <span className="text-neutral-400">-</span>}
                          </td>
                          <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300 hidden lg:table-cell">
                            {scheme.state || <span className="text-primary-600 dark:text-primary-400 font-medium">All India</span>}
                          </td>
                          <td className="py-4 px-5 text-center">
                            <button 
                              onClick={() => handleToggleActive(scheme)} 
                              title={scheme.isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                              className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              {scheme.isActive ? (
                                <ToggleRight className="w-7 h-7 text-primary-500" />
                              ) : (
                                <ToggleLeft className="w-7 h-7 text-neutral-400" />
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center justify-center gap-2">
                              {scheme.link && (
                                <a 
                                  href={scheme.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="p-2 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                                  title="Open portal"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              <button 
                                onClick={() => openEditForm(scheme)} 
                                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setDeleteTarget(scheme)} 
                                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="animate-fadeIn">
            <CardHeader className="border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-500" />
                    Registered Users
                  </CardTitle>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    View and search all platform users
                  </p>
                </div>
                <form onSubmit={handleUserSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2.5 w-64 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-200"
                  >
                    Search
                  </button>
                </form>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingUsers ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : users.length === 0 ? (
                <AdminEmptyState 
                  icon={Users}
                  title="No users found"
                  subtitle="Try a different search term"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">Name</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">State</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Role</th>
                        <th className="text-left py-4 px-5 text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, index) => (
                        <tr 
                          key={u._id} 
                          className={`border-b border-neutral-100 dark:border-neutral-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors ${
                            index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50/50 dark:bg-neutral-800/30'
                          }`}
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-neutral-900 dark:text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300">{u.email}</td>
                          <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300 hidden md:table-cell">{u.phone || <span className="text-neutral-400">-</span>}</td>
                          <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300 hidden lg:table-cell">{u.location?.state || <span className="text-neutral-400">-</span>}</td>
                          <td className="py-4 px-5 hidden lg:table-cell">
                            <RoleBadge role={u.role} />
                          </td>
                          <td className="py-4 px-5 text-neutral-500 dark:text-neutral-400 text-xs">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create / Edit Scheme Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div 
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {editingScheme ? 'Edit Scheme' : 'Add New Scheme'}
                </h3>
              </div>
              <button 
                onClick={() => setShowForm(false)} 
                className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="e.g. PM-KISAN Samman Nidhi"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-all"
                  placeholder="Brief description of the scheme"
                />
              </div>

              {/* Type + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  >
                    <option value="central">Central (All India)</option>
                    <option value="state">State-Specific</option>
                  </select>
                </div>
                {form.type === 'state' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Category + Ministry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g. Income Support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Ministry</label>
                  <input
                    name="ministry"
                    value={form.ministry}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g. Ministry of Agriculture"
                  />
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Benefits</label>
                <input
                  name="benefits"
                  value={form.benefits}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="e.g. ₹6,000 per year in 3 installments"
                />
              </div>

              {/* Eligibility */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Eligibility</label>
                <input
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="e.g. All land-holding farmer families"
                />
              </div>

              {/* Portal Link */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Government Portal Link</label>
                <input
                  name="link"
                  value={form.link}
                  onChange={handleFormChange}
                  type="url"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="https://pmkisan.gov.in"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-4 py-3 px-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Status</label>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className="focus:outline-none hover:scale-110 transition-transform"
                >
                  {form.isActive ? (
                    <ToggleRight className="w-8 h-8 text-primary-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-neutral-400" />
                  )}
                </button>
                <span className={`text-sm font-medium ${form.isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500'}`}>
                  {form.isActive ? 'Active - Visible to farmers' : 'Inactive - Hidden'}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-200"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div 
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Delete Scheme</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                Are you sure you want to delete <span className="font-semibold text-neutral-900 dark:text-white">"{deleteTarget.title}"</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-600/25 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AdminDashboard;
