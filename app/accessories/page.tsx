'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  inStock: boolean;
  stockQuantity: number;
  sizes?: string[];
}

interface CartItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  size?: string;
}

export default function AccessoriesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showCart, setShowCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [whatsappNumber, setWhatsappNumber] = useState('1234567890');

  useEffect(() => {
    fetchProducts();
    fetchWhatsAppConfig();
  }, []);

  const fetchWhatsAppConfig = async () => {
    try {
      const response = await fetch('/api/admin/whatsapp-config', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setWhatsappNumber(data.phoneNumber);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp config:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product, size?: string) => {
    const existingItem = cart.find(
      (item) => item.productId === product._id && item.size === size
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          productName: product.name,
          category: product.category,
          quantity: 1,
          price: product.price,
          size,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart(
      cart.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before ordering.');
      return;
    }

    try {
      const response = await fetch('/api/user/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        alert('Please login to place an order.');
        router.push('/login');
        return;
      }

      const userData = await response.json();
      const user = userData.user;

      // Create formatted message
      let message = `*🛒 Freemason Accessories Order Request*\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${user.fullName}\n`;
      message += `Email: ${user.email}\n`;
      message += `Phone: ${user.phone}\n\n`;
      
      message += `*📦 Items Ordered:*\n`;
      cart.forEach((item) => {
        message += `• ${item.productName}`;
        if (item.size) {
          message += ` (Size: ${item.size})`;
        }
        message += `\n  Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}\n`;
      });

      const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = 25;
      const tax = cartTotal * 0.1;
      const total = cartTotal + shipping + tax;

      message += `\n*💰 Order Summary:*\n`;
      message += `Subtotal: $${cartTotal.toFixed(2)}\n`;
      message += `Shipping: $${shipping.toFixed(2)}\n`;
      message += `Tax (10%): $${tax.toFixed(2)}\n`;
      message += `*Total: $${total.toFixed(2)}*\n\n`;
      message += `Please confirm this order and provide shipping details.`;

      // WhatsApp Business number (configured by admin)
      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      console.log('WhatsApp Number:', whatsappNumber);
      console.log('Opening WhatsApp Link:', whatsappLink);

      // Create a link and click it (better than window.open for mobile compatibility)
      const link = document.createElement('a');
      link.href = whatsappLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clear cart after initiating order
      setTimeout(() => {
        setCart([]);
        setShowCart(false);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const filteredProducts =
    selectedCategory === 'ALL'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    'ALL',
    'UNIFORM',
    'RING',
    'BIBLE',
    'PERFUME',
    'ACCESSORY',
    'OTHER',
  ];

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      UNIFORM: '👔',
      RING: '💍',
      BIBLE: '📖',
      PERFUME: '💎',
      ACCESSORY: '🎁',
      OTHER: '⭐',
    };
    return emojis[category] || '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-gold mb-4 animate-pulse">⚒</div>
          <p className="text-gray-600">Loading accessories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-heading text-gold">⚒</div>
              <span className="text-sm sm:text-xl font-heading text-gold hidden sm:inline">FREEMASON INTERNATIONAL</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-gold transition text-sm sm:text-base">
                Dashboard
              </Link>
              <Link href="/documents" className="text-gray-300 hover:text-gold transition text-sm sm:text-base">
                Documents
              </Link>
              <Link href="/accessories" className="text-gold border-b-2 border-gold text-sm sm:text-base">
                Accessories
              </Link>
              {/* Cart Icon */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative px-3 py-2 border-2 border-gold text-gold rounded hover:bg-gold hover:text-navy transition"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-navy mb-2">
              Freemason Accessories & Merchandise
            </h1>
            <p className="text-gray-600">
              Shop for official Freemason merchandise, uniforms, rings, and more
            </p>
            <div className="h-1 w-24 bg-gold mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="font-heading text-lg text-navy mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat
                          ? 'bg-gold text-navy font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Products' : `${getCategoryEmoji(cat)} ${cat.replace(/_/g, ' ')}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                    >
                      {/* Product Image */}
                      <div className="bg-gray-200 h-64 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-6xl text-gold">
                            {getCategoryEmoji(product.category)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-heading text-xl text-navy mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="mb-4">
                          <span className="font-heading text-2xl text-gold">
                            {product.currency} {product.price.toFixed(2)}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.inStock ? (
                              <span className="text-green-600 font-semibold">
                                ✓ In Stock
                              </span>
                            ) : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                          </div>
                        </div>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="mb-4">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                              Size:
                            </label>
                            <select
                              value={selectedSize[product._id] || ''}
                              onChange={(e) =>
                                setSelectedSize({
                                  ...selectedSize,
                                  [product._id]: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold text-sm"
                            >
                              <option value="">Select size</option>
                              {product.sizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                          onClick={() =>
                            addToCart(product, selectedSize[product._id])
                          }
                          disabled={!product.inStock}
                          className="w-full py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">No products in this category</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-navy">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.productName}
                          </p>
                          {item.size && (
                            <p className="text-xs text-gray-500">Size: {item.size}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.size
                              )
                            }
                            className="px-2 py-1 border border-gray-300 rounded"
                          >
                            −
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.size
                              )
                            }
                            className="px-2 py-1 border border-gray-300 rounded"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-800">Subtotal:</span>
                    <span className="font-heading text-2xl text-gold">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Shipping and taxes calculated at checkout
                  </p>
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition mb-2"
                  >
                    📱 Order on WhatsApp
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-full py-3 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-navy transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowCart(false)}
        ></div>
      )}
    </div>
  );
}
