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

  // Voucher management states
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [voucherMessage, setVoucherMessage] = useState('');
  const [newVoucher, setNewVoucher] = useState({
    amount: '',
    currency: 'USD',
  });

  // Recruitment applications states
  const [recruitmentApplications, setRecruitmentApplications] = useState<any[]>([]);
  const [recruitmentMessage, setRecruitmentMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchServiceApplications();
    fetchWhatsAppSettings();
    fetchVouchers();
    fetchRecruitmentApplications();
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

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/admin/vouchers', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setVouchers(data.vouchers || []);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  const fetchRecruitmentApplications = async () => {
    try {
      const response = await fetch('/api/admin/recruitments', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRecruitmentApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching recruitment applications:', error);
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
      // Upload file through API endpoint (S3)
      setUploadMessage('📤 Uploading file...');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        setUploadMessage('❌ File upload failed: ' + (uploadData.error || 'Unknown error'));
        console.error('File upload error:', uploadData);
        setUploading(false);
        return;
      }
      
      // Send document metadata to API
      setUploadMessage('💾 Saving document...');
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          category: documentCategory,
          fileName: uploadData.filename,
          originalName: uploadData.originalName,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          filePath: uploadData.url,
          storagePath: uploadData.path,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUploadMessage('✅ Document uploaded successfully!');
        setSelectedFile(null);
        setSelectedUserId('');
        setDocumentCategory('OTHER');
        setTimeout(() => setUploadMessage(''), 3000);
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to upload document');
        setUploadMessage('❌ ' + errorMsg);
        console.error('Document upload error details:', data);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      let imageUrl = '';
      
      // Upload image through API endpoint (S3) if selected
      const imageInput = document.getElementById('productImage') as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        const imageFile = imageInput.files[0];
        setProductMessage('📤 Uploading image...');
        
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        
        const uploadData = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          setProductMessage('❌ Image upload failed: ' + (uploadData.error || 'Unknown error'));
          console.error('Image upload error:', uploadData);
          return;
        }
        
        imageUrl = uploadData.url;
      }
      
      setProductMessage('💾 Saving product...');
      
      // Send product data to API
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          currency: newProduct.currency,
          inStock: newProduct.inStock,
          stockQuantity: parseInt(newProduct.stockQuantity),
          sizes: newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()) : [],
          imageUrl,
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
        if (imageInput) imageInput.value = '';
        setTimeout(() => setProductMessage(''), 3000);
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to add product');
        setProductMessage('❌ ' + errorMsg);
        console.error('Product error details:', data);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setProductMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    setProductMessage('⏳ Deleting product...');
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setProductMessage('✅ Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setProductMessage(''), 3000);
      } else {
        const data = await response.json();
        setProductMessage('❌ Failed to delete product: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setProductMessage('❌ Error deleting product');
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

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVoucher.amount || parseFloat(newVoucher.amount) <= 0) {
      setVoucherMessage('❌ Please enter a valid amount');
      return;
    }

    setVoucherMessage('⏳ Generating voucher...');

    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(newVoucher.amount),
          currency: newVoucher.currency,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoucherMessage(`✅ Voucher created! Code: ${data.voucher.code}`);
        setNewVoucher({ amount: '', currency: 'USD' });
        fetchVouchers();
        setTimeout(() => setVoucherMessage(''), 10000); // Show for 10 seconds so admin can copy
      } else {
        setVoucherMessage('❌ ' + (data.error || 'Failed to create voucher'));
      }
    } catch (error) {
      console.error('Error creating voucher:', error);
      setVoucherMessage('❌ Error creating voucher');
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
              onClick={() => setActiveTab('vouchers')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'vouchers'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              Vouchers
            </button>
            <button
              onClick={() => setActiveTab('recruitments')}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === 'recruitments'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-600 hover:text-navy'
              }`}
            >
              Recruitments
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

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Product Image</label>
                      <input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-navy hover:file:bg-gold-light"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload a product image (JPG, PNG, WebP)</p>
                    </div>

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

          {/* Vouchers Tab */}
          {activeTab === 'vouchers' && (
            <>
              <h2 className="font-heading text-2xl text-navy mb-6">Voucher Management</h2>

              {/* Create Voucher Form */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-heading text-xl text-navy mb-4">Create New Voucher</h3>
                
                <form onSubmit={handleCreateVoucher} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={newVoucher.amount}
                      onChange={(e) => setNewVoucher({ ...newVoucher, amount: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                      required
                    />
                    
                    <select
                      value={newVoucher.currency}
                      onChange={(e) => setNewVoucher({ ...newVoucher, currency: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition"
                    >
                      Generate Voucher
                    </button>
                  </div>

                  {voucherMessage && (
                    <div className={`p-4 rounded-lg text-center font-semibold ${
                      voucherMessage.includes('✅') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {voucherMessage}
                    </div>
                  )}
                </form>
              </div>

              {/* Vouchers List */}
              {vouchers.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Used By</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers.map((voucher) => (
                        <tr key={voucher._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-mono font-bold text-navy">{voucher.code}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{voucher.currency} {voucher.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              voucher.isUsed 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {voucher.isUsed ? 'USED' : 'AVAILABLE'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {voucher.usedBy ? voucher.usedBy.fullName : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(voucher.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">No vouchers created yet.</p>
                </div>
              )}
            </>
          )}

          {/* Recruitments Tab */}
          {activeTab === 'recruitments' && (
            <>
              <h2 className="font-heading text-2xl text-navy mb-6">Recruitment Applications</h2>

              {recruitmentApplications.length > 0 ? (
                <div className="space-y-6">
                  {recruitmentApplications.map((app) => (
                    <div key={app._id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-heading text-xl text-navy">{app.fullName}</h3>
                          <p className="text-sm text-gray-600">{app.email} • {app.phone}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Personal Information */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-navy mb-3 text-lg border-b pb-2">Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Full Name:</span>
                            <p className="text-gray-600">{app.fullName}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Date of Birth:</span>
                            <p className="text-gray-600">{new Date(app.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Place of Birth:</span>
                            <p className="text-gray-600">{app.placeOfBirth}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Nationality:</span>
                            <p className="text-gray-600">{app.nationality}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-navy mb-3 text-lg border-b pb-2">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Email:</span>
                            <p className="text-gray-600">{app.email}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Phone:</span>
                            <p className="text-gray-600">{app.phone}</p>
                          </div>
                          <div className="md:col-span-2 lg:col-span-1">
                            <span className="font-semibold text-gray-700">Address:</span>
                            <p className="text-gray-600">{app.address}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">City:</span>
                            <p className="text-gray-600">{app.city}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">State/Province:</span>
                            <p className="text-gray-600">{app.state}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Country:</span>
                            <p className="text-gray-600">{app.country}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Postal Code:</span>
                            <p className="text-gray-600">{app.postalCode}</p>
                          </div>
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-navy mb-3 text-lg border-b pb-2">Professional Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Occupation:</span>
                            <p className="text-gray-600">{app.occupation}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Employer:</span>
                            <p className="text-gray-600">{app.employer}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Years in Profession:</span>
                            <p className="text-gray-600">{app.yearsInProfession}</p>
                          </div>
                        </div>
                      </div>

                      {/* Masonic Information */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-navy mb-3 text-lg border-b pb-2">Masonic Information</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Why do you want to become a Freemason?</span>
                            <p className="text-gray-600 mt-1">{app.reason}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Knowledge of Freemasonry:</span>
                            <p className="text-gray-600 mt-1">{app.knowledgeOfFreemasonry}</p>
                          </div>
                          {app.recommendedBy && (
                            <div>
                              <span className="font-semibold text-gray-700">Recommended By:</span>
                              <p className="text-gray-600">{app.recommendedBy}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold text-gray-700">Previously Applied:</span>
                              <p className="text-gray-600">{app.previouslyApplied ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Relatives in Freemasonry:</span>
                              <p className="text-gray-600">{app.relativesInFreemasonry ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                          {app.relativesInFreemasonry && app.relativeDetails && (
                            <div>
                              <span className="font-semibold text-gray-700">Relative Details:</span>
                              <p className="text-gray-600 mt-1">{app.relativeDetails}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Character References */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-navy mb-3 text-lg border-b pb-2">Character References</h4>
                        <div className="space-y-4">
                          {app.references && app.references.map((ref: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <p className="font-semibold text-navy mb-2">Reference {index + 1}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="font-semibold text-gray-700">Name:</span>
                                  <p className="text-gray-600">{ref.name}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Relationship:</span>
                                  <p className="text-gray-600">{ref.relationship}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Phone:</span>
                                  <p className="text-gray-600">{ref.phone}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Email:</span>
                                  <p className="text-gray-600">{ref.email}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Background Information */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-navy mb-3 text-lg border-b pb-2">Background Information</h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold text-gray-700">Criminal Record:</span>
                              <p className="text-gray-600">{app.criminalRecord ? 'Yes' : 'No'}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Belief in Supreme Being:</span>
                              <p className="text-gray-600">{app.beliefInSupremeBeing ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                          {app.criminalRecord && app.criminalDetails && (
                            <div>
                              <span className="font-semibold text-gray-700">Criminal Record Details:</span>
                              <p className="text-gray-600 mt-1">{app.criminalDetails}</p>
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-700">Moral Character:</span>
                            <p className="text-gray-600 mt-1">{app.moralCharacter}</p>
                          </div>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="mb-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Voucher Code:</span>
                            <p className="text-gray-600 font-mono">{app.voucherCode}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Application Date:</span>
                            <p className="text-gray-600">{new Date(app.createdAt).toLocaleDateString()} at {new Date(app.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">No recruitment applications yet.</p>
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
