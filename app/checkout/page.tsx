'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Get order data from session storage
    const pendingOrder = sessionStorage.getItem('pendingOrder');
    if (pendingOrder) {
      const order = JSON.parse(pendingOrder);
      setCartItems(order.items);
      setShippingAddress({
        ...order.shippingAddress,
        state: '',
        postalCode: '',
      });
    }
  }, []);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress,
          notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.removeItem('pendingOrder');
        router.push(`/order-confirmation/${data.order._id}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No items in cart</p>
          <Link
            href="/accessories"
            className="text-gold hover:text-gold-light font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 25;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-heading text-gold">⚒</div>
              <span className="text-xl font-heading text-gold">FREEMASON INTERNATIONAL</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-navy mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">Complete your order</p>
            <div className="h-1 w-24 bg-gold mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="font-heading text-xl text-navy mb-4">
                    Shipping Information
                  </h2>

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      required
                    />

                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={shippingAddress.address}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State/Province"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                      />
                    </div>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="font-heading text-xl text-navy mb-4">
                    Additional Notes (Optional)
                  </h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or delivery instructions..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gold text-navy font-bold rounded-lg text-lg hover:bg-gold-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>

                <Link
                  href="/accessories"
                  className="block text-center text-navy hover:text-gold transition font-semibold"
                >
                  Continue Shopping
                </Link>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="font-heading text-xl text-navy mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{item.productName}</span>
                        <span className="text-gray-700">
                          {item.quantity}x ${item.price.toFixed(2)}
                        </span>
                      </div>
                      {item.size && (
                        <div className="text-xs text-gray-500">Size: {item.size}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-heading text-lg">
                    <span className="text-navy">Total:</span>
                    <span className="text-gold">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Note:</span> This is a demonstration
                    order. In production, payment processing would be integrated here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
