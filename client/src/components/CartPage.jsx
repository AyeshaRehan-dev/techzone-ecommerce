import axios from 'axios';
import { Link } from 'react-router-dom';
import StripeCheckout from './StripeCheckout';

const CartPage = ({ cartItems, clearCart, user }) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Group identical items and calculate quantities
  const groupedItems = cartItems.reduce((acc, item) => {
    const existing = acc.find(i => i._id === item._id || i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08; 
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleOrderInitiate = (e) => {
    e.preventDefault();
    if (!shippingData.address || !shippingData.city || !shippingData.postalCode || !shippingData.country) {
      return alert('Please fill in all shipping details first.');
    }
    setShowStripe(true);
  };

  const finalizeOrder = async (paymentId) => {
    setIsOrdering(true);
    const userId = user.id || user._id;
    
    try {
      const orderData = {
        userId: userId,
        username: user.username,
        items: groupedItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageURL: item.imageURL,
          product: item._id
        })),
        shippingAddress: shippingData,
        totalPrice: total,
        paymentId: paymentId
      };

      await axios.post('/api/orders', orderData);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Order could not be saved. Please contact support.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="bg-gray-800/40 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-400 text-lg mb-8">Thank you for shopping at TechZone. You can track your order in the "My Orders" section.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-orders" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all">
              View My Orders
            </Link>
            <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex items-center mb-8 gap-4">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Your Shopping Cart</h1>
      </div>

      {groupedItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-3xl">
          <h3 className="text-xl text-gray-400 mb-6">Your cart is completely empty.</h3>
          <Link to="/" className="inline-block px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors">
            Browse Gadgets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {groupedItems.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 rounded-2xl">
                <div className="w-full sm:w-32 h-48 sm:h-32 shrink-0 bg-gray-900 rounded-xl overflow-hidden">
                  <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex flex-col justify-between flex-grow py-2">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                      <p className="text-xl font-bold text-blue-400">${item.price}</p>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{item.brand}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-gray-400 bg-gray-900 px-3 py-1 rounded-lg">
                      Qty: {item.quantity}
                    </span>
                    <p className="font-semibold text-white">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-4">Secure Checkout</h2>
              
              <form onSubmit={handleOrderInitiate} className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Shipping Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Street Address"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={shippingData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={shippingData.city}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="postalCode"
                    required
                    placeholder="Postal Code"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={shippingData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="country"
                    required
                    placeholder="Country"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={shippingData.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-4 my-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-white pt-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                {showStripe ? (
                  <div className="mt-4 pt-6 border-t border-gray-700 animate-fadeIn">
                    <StripeCheckout 
                      amount={total.toFixed(2)} 
                      onSuccess={finalizeOrder}
                      onCancel={() => setShowStripe(false)}
                    />
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full py-4 rounded-xl font-black text-xs tracking-widest transition-all shadow-lg bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:scale-[1.02] shadow-blue-500/20 active:scale-95"
                  >
                    PROCEED TO PAYMENT
                  </button>
                )}
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-700 flex justify-center gap-4 grayscale opacity-30 scale-75">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
