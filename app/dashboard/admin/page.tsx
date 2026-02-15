'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  city: string;
  occupation: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    status: '',
  });
  
  // WhatsApp Settings
  const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  
  // Document upload states
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentCategory, setDocumentCategory] = useState('OTHER');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Service Applications states
  const [serviceApplications, setServiceApplications] = useState<any[]>([]);
  const [appMessage, setAppMessage] = useState('');

  // Product management states
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productMessage, setProductMessage] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'UNIFORM',
    price: '',
    currency: 'USD',
    imageUrl: '',
    inStock: true,
    stockQuantity: '',
    sizes: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchServiceApplications();
    fetchWhatsAppSettings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchWhatsAppSettings = async () => {
    try {
      const response = await fetch('/api/admin/whatsapp-config', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setWhatsappPhoneNumber(data.phoneNumber);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?all=true');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchServiceApplications = async () => {
    try {
      const response = await fetch('/api/admin/service-applications', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setServiceApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching service applications:', error);
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/service-applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppMessage('✅ Status updated successfully!');
        fetchServiceApplications();
        setTimeout(() => setAppMessage(''), 3000);
      } else {
        setAppMessage('❌ Failed to update status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      setAppMessage('❌ Error updating status');
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (filters.search) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.country) {
      filtered = filtered.filter(user => user.country === filters.country);
    }

    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedUserId) {
      setUploadMessage('Please select a file and user');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', selectedUserId);
      formData.append('category', documentCategory);

        const response = await fetch('/api/admin/documents', {
        method: 'POST',
          credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage('Document uploaded successfully!');
        setSelectedFile(null);
        setSelectedUserId('');
        setDocumentCategory('OTHER');
        setTimeout(() => setUploadMessage(''), 3000);
      } else {
        setUploadMessage('Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadMessage('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductMessage('');
    
    // Validation
    if (!newProduct.name || !newProduct.price || !newProduct.stockQuantity) {
      setProductMessage('❌ Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stockQuantity: parseInt(newProduct.stockQuantity),
          sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(s => s),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProductMessage('✅ Product added successfully!');
        fetchProducts();
        setShowProductForm(false);
        setNewProduct({
          name: '',
          description: '',
          category: 'UNIFORM',
          price: '',
          currency: 'USD',
          imageUrl: '',
          inStock: true,
          stockQuantity: '',
          sizes: '',
        });
        setTimeout(() => setProductMessage(''), 3000);
      } else {
        setProductMessage('❌ ' + (data.error || 'Failed to add product'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setProductMessage('❌ Error adding product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
          credentials: 'include',
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSaveWhatsAppSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/whatsapp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        body: JSON.stringify({ phoneNumber: whatsappPhoneNumber }),
      });

      if (response.ok) {
        setWhatsappMessage('WhatsApp settings saved successfully!');
        setTimeout(() => setWhatsappMessage(''), 3000);
      } else {
        setWhatsappMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setWhatsappMessage('Error saving settings');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Country', 'City', 'Occupation', 'Status', 'Date'];
    const csvData = filteredUsers.map(user => [
      user.fullName,
      user.email,
      user.phone,
      user.country,
      user.city,
      user.occupation,
      user.status,
      new Date(user.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'freemason-members.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-gold mb-4 animate-pulse">⚒</div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    pending: users.filter(u => u.status === 'PENDING').length,
    approved: users.filter(u => u.status === 'APPROVED').length,
    rejected: users.filter(u => u.status === 'REJECTED').length,
  };

  const uniqueCountries = Array.from(new Set(users.map(u => u.country))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-heading text-gold">⚒</div>
              <span className="text-xl font-heading text-gold">ADMIN DASHBOARD</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-gold transition"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-navy transition duration-300 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'documents'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'products'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('service-applications')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'service-applications'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              Service Applications
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'settings'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-navy">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved</h3>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Rejected</h3>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
              />
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition"
              >
                Export CSV
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.occupation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user._id, e.target.value)}
                          className={`text-sm font-semibold rounded px-3 py-1 border-2 ${
                            user.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : user.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No users found matching your filters.</p>
            </div>
          )}
          </>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="font-heading text-2xl text-navy mb-4">
                  Upload Documents to Members
                </h2>
                
                <form onSubmit={handleDocumentUpload} className="space-y-4">
                  {uploadMessage && (
                    <div className={`p-4 rounded-lg ${
                      uploadMessage.includes('success')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {uploadMessage}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                      required
                    >
                      <option value="">Select Member</option>
                      {users.filter(u => u.status === 'APPROVED').map(user => (
                        <option key={user._id} value={user._id}>
                          {user.fullName} ({user.email})
                        </option>
                      ))}
                    </select>

                    <select
                      value={documentCategory}
                      onChange={(e) => setDocumentCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                    >
                      <option value="CERTIFICATE">Certificate</option>
                      <option value="MEMBERSHIP_CARD">Membership Card</option>
                      <option value="LETTER">Letter</option>
                      <option value="FORM">Form</option>
                      <option value="OTHER">Other</option>
                    </select>

                    <input
                      type="file"
                      onChange={(e) => setSelectedFile((e.target as HTMLInputElement).files?.[0] || null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl text-navy">Manage Products</h2>
                <button
                  onClick={() => setShowProductForm(!showProductForm)}
                  className="px-6 py-2 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition"
                >
                  {showProductForm ? 'Cancel' : 'Add Product'}
                </button>
              </div>

              {showProductForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="font-heading text-xl text-navy mb-4">Add New Product</h3>
                  
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                      
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                      >
                        <option value="UNIFORM">Uniform</option>
                        <option value="RING">Ring</option>
                        <option value="BIBLE">Bible</option>
                        <option value="PERFUME">Perfume</option>
                        <option value="ACCESSORY">Accessory</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <textarea
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                      rows={3}
                      required
                    ></textarea>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />
                      
                      <select
                        value={newProduct.currency}
                        onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>

                      <input
                        type="number"
                        placeholder="Stock Quantity"
                        value={newProduct.stockQuantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                        required
                      />

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newProduct.inStock}
                          onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-gray-700">In Stock</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Sizes (comma-separated e.g. S, M, L, XL)"
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                    />

                    <button
                      type="submit"
                      className="w-full py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition"
                    >
                      Add Product
                    </button>

                    {productMessage && (
                      <div className={`mt-4 p-4 rounded-lg text-center text-sm font-semibold ${
                        productMessage.includes('✅') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {productMessage}
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-heading text-lg text-navy mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.category}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-heading text-xl text-gold">${product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Stock</p>
                        <p className={`font-bold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stockQuantity}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="w-full py-2 text-red-600 font-semibold border border-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {products.length === 0 && !showProductForm && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">No products yet. Add your first product!</p>
                </div>
              )}
            </>
          )}

          {/* Service Applications Tab */}
          {activeTab === 'service-applications' && (
            <>
              <h2 className="font-heading text-2xl text-navy mb-6">Service Applications</h2>

              {appMessage && (
                <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${
                  appMessage.includes('✅') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {appMessage}
                </div>
              )}

              {serviceApplications.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-navy text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Service Type</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Urgency</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceApplications.map((app) => (
                        <tr key={app._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{app.userFullName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{app.userEmail}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              {app.serviceType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              app.urgency === 'EXPEDITED' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.urgency}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateApplicationStatus(app._id, e.target.value)}
                              className={`px-3 py-1 rounded text-sm font-semibold cursor-pointer ${
                                app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                app.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="APPROVED">APPROVED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleUpdateApplicationStatus(app._id, 'APPROVED')}
                              className="px-3 py-1 bg-gold text-navy rounded text-xs font-semibold hover:bg-gold-light transition"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">No service applications yet.</p>
                </div>
              )}
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <>
              <h2 className="font-heading text-2xl text-navy mb-6">Settings</h2>

              {/* WhatsApp Configuration */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-heading text-xl text-navy mb-4">
                  🟢 WhatsApp Business Configuration
                </h3>
                
                {whatsappMessage && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    whatsappMessage.includes('success')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {whatsappMessage}
                  </div>
                )}

                <form onSubmit={handleSaveWhatsAppSettings} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      WhatsApp Business Phone Number
                    </label>
                    <p className="text-gray-600 text-sm mb-2">
                      Enter your business phone number (with country code, no spaces or symbols).
                      <br />
                      Example: 12015550123 (for +1 201-555-0123)
                    </p>
                    <input
                      type="text"
                      value={whatsappPhoneNumber}
                      onChange={(e) => setWhatsappPhoneNumber(e.target.value)}
                      placeholder="12015550123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">💡 How to get your WhatsApp Business Phone Number:</span>
                      <br />
                      1. Sign up for WhatsApp Business at: <a href="https://www.whatsapp.com/business/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">whatsapp.com/business</a>
                      <br />
                      2. Get a phone number with your country's dialing code
                      <br />
                      3. Copy the number (digits only, remove + and spaces) and paste here
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition"
                  >
                    Save WhatsApp Settings
                  </button>
                </form>

                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm">
                    <span className="font-semibold">✓ Current Status:</span> When customers click "Order on WhatsApp",
                    their orders will be sent to: <span className="font-mono font-bold">{whatsappPhoneNumber}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
