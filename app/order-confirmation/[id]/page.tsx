'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  _id: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
  }>;
  totalAmount: number;
  status: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  notes: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        router.push('/accessories');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/accessories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-gold mb-4 animate-pulse">⚒</div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      PENDING: '⏳',
      PROCESSING: '📦',
      SHIPPED: '🚚',
      DELIVERED: '✓',
      CANCELLED: '✕',
    };
    return icons[status] || '?';
  };

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
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">✓</div>
              <div>
                <h1 className="font-heading text-2xl text-green-800">
                  Order Confirmed!
                </h1>
                <p className="text-green-700">
                  Thank you for your purchase. Your order has been received.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Order Header */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600">Order Number</p>
                    <p className="font-heading text-2xl text-navy font-mono">
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                    <span className="mr-2">{getStatusIcon(order.status)}</span>
                    {order.status}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-heading text-xl text-navy mb-4">Items Ordered</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.productName}
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-heading text-lg text-gold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-heading text-xl text-navy mb-4">
                  Shipping Address
                </h2>
                <div className="text-gray-700">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2 text-sm">{order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="font-heading text-xl text-navy mb-4">
                    Special Notes
                  </h2>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Summary & Actions */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 mb-6">
                <h2 className="font-heading text-lg text-navy mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${order.totalAmount * 0.85}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>$25.00</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>${(order.totalAmount * 0.85 * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-heading text-lg">
                  <span className="text-navy">Total:</span>
                  <span className="text-gold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">What's Next?</span>
                    <br />
                    You'll receive an email confirmation shortly with tracking
                    information. Your order is currently {order.status.toLowerCase()}.
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  className="block w-full py-3 bg-gold text-navy font-bold rounded-lg text-center hover:bg-gold-light transition"
                >
                  View Your Orders
                </Link>

                <Link
                  href="/accessories"
                  className="block w-full py-3 border-2 border-navy text-navy font-bold rounded-lg text-center hover:bg-navy hover:text-white transition"
                >
                  Continue Shopping
                </Link>

                <Link
                  href="/"
                  className="block w-full py-3 text-center text-navy hover:text-gold transition font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
