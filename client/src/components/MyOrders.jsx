import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/myorders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 p-12 rounded-3xl text-center">
            <p className="text-gray-400 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 p-6 rounded-3xl shadow-xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                  <div>
                    <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Order ID</p>
                    <p className="text-white font-mono break-all text-xs">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-emerald-400 font-bold">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-700/50 pt-4 mt-4">
                  <p className="text-sm font-semibold text-gray-400 mb-3">Items:</p>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.imageURL} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                          <p className="text-gray-200">{item.name} <span className="text-gray-500 text-sm">x{item.quantity}</span></p>
                        </div>
                        <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
