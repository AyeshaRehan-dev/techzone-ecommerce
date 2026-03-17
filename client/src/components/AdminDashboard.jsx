import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', or 'users'
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    category: 'Laptops',
    imageURL: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/products', formData);
      setSuccessMessage('Product added successfully!');
      setFormData({
        name: '',
        price: '',
        brand: '',
        category: 'Laptops',
        imageURL: '',
        description: ''
      });
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        setError('Error deleting product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Admin Control
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your elite tech inventory and orders.</p>
          </div>
          <div className="flex bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800/50 shadow-inner">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Orders {orders.length > 0 && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-[10px]">{orders.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Users {users.length > 0 && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-[10px]">{users.length}</span>}
            </button>
          </div>
        </div>

        {activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Add Product Form */}
            <div className="xl:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 sticky top-32 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">New Prototype</h2>
                
                {successMessage && (
                  <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-2xl mb-6 text-center text-sm font-bold animate-pulse">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1 block">Full Specifications</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Model Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="price"
                      placeholder="Price ($)"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all font-medium"
                      required
                    />
                    <input
                      type="text"
                      name="brand"
                      placeholder="Brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all font-medium"
                      required
                    />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all font-medium"
                  >
                    <option>Laptops</option>
                    <option>Accessories</option>
                    <option>Audio</option>
                    <option>Monitors</option>
                  </select>
                  <input
                    type="url"
                    name="imageURL"
                    placeholder="Premium Image URL"
                    value={formData.imageURL}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all font-medium"
                    required
                  />
                  <textarea
                    name="description"
                    placeholder="Visionary Description..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white transition-all font-medium"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:scale-[1.02] text-white rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'UPLOADING...' : 'DEPLOY PRODUCT'}
                  </button>
                </form>
              </div>
            </div>

            {/* Product Management Table */}
            <div className="xl:col-span-2">
              <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-700/50 bg-gray-900/40">
                  <h2 className="text-2xl font-bold">Active Inventory</h2>
                  <p className="text-gray-500 text-sm">Real-time stock of premium electronics.</p>
                </div>
                
                {loading ? (
                  <div className="p-20 text-center text-gray-500 italic">Syncing with TechZone servers...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-900/80 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-5">Gadget</th>
                          <th className="px-8 py-5">Price</th>
                          <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {products.map((product) => (
                          <tr key={product._id} className="group hover:bg-blue-500/5 transition-all">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-gray-900 rounded-2xl overflow-hidden shrink-0 border border-gray-700/50 shadow-inner group-hover:scale-110 transition-transform">
                                  <img src={product.imageURL} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{product.name}</p>
                                  <p className="text-[10px] font-black uppercase text-blue-500/60 tracking-widest">{product.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 font-black text-emerald-400 text-lg">${product.price}</td>
                            <td className="px-8 py-6 text-right">
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-3 text-gray-600 hover:text-red-400 bg-gray-900/50 hover:bg-red-400/10 rounded-2xl border border-gray-700/50 hover:border-red-500/30 transition-all hover:rotate-12"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          /* Orders Management Table */
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-700/50 bg-gray-900/40">
              <h2 className="text-2xl font-bold">Customer Transactions</h2>
              <p className="text-gray-500 text-sm">Monitor and fulfill incoming gadget requests.</p>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-20 text-center text-gray-400">No active orders in the database.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/80 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Order ID / Customer</th>
                      <th className="px-8 py-5">Items</th>
                      <th className="px-8 py-5">Total</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-blue-500/5 transition-all">
                        <td className="px-8 py-6">
                          <p className="text-xs font-mono text-gray-400 mb-1">{order._id}</p>
                          <p className="font-bold text-white">{order.username}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                        </td>
                        <td className="px-8 py-6 max-w-xs">
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => (
                              <span key={idx} className="bg-gray-900 px-2 py-1 rounded text-[10px] text-gray-400 border border-gray-700">
                                {item.name} x{item.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6 font-bold text-emerald-400">${order.totalPrice.toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400 animate-pulse'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <select 
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-[10px] font-bold uppercase focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                            defaultValue={order.status}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Users Management Table */
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-700/50 bg-gray-900/40">
              <h2 className="text-2xl font-bold">Registered Operatives</h2>
              <p className="text-gray-500 text-sm">Database of all authorized portal users.</p>
            </div>
            
            {users.length === 0 ? (
              <div className="p-20 text-center text-gray-400">No registered users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/80 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5">User ID / Username</th>
                      <th className="px-8 py-5">Email</th>
                      <th className="px-8 py-5">Role</th>
                      <th className="px-8 py-5 text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-blue-500/5 transition-all">
                        <td className="px-8 py-6">
                          <p className="text-xs font-mono text-gray-400 mb-1">{u._id}</p>
                          <p className="font-bold text-white">{u.username}</p>
                        </td>
                        <td className="px-8 py-6 text-gray-300 font-medium">{u.email}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right text-gray-500 text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
