# 🚀 Quick Start Guide - WhatsApp Ordering System

## For Admin Users

### 1️⃣ Configure WhatsApp Business Number (First Time Setup)

```
Dashboard → Settings Tab → WhatsApp Business Configuration
```

**Steps:**
1. Sign up at: https://www.whatsapp.com/business/
2. Get your business phone number
3. In Admin Dashboard, enter: `{country_code}{phone_number}` (digits only)
4. Click "Save WhatsApp Settings"

**Example:**
- US: `12015550123` (for +1-201-555-0123)
- UK: `442071838750` (for +44-207-183-8750)

### 2️⃣ Manage Products

```
Dashboard → Products Tab
```

**Add New Product:**
- Click "Add Product"
- Fill in: Name, Category, Price, Stock Quantity, Sizes (optional)
- Click "Add Product"

**Categories Available:**
- Uniform (👔)
- Ring (💍)
- Bible (📖)
- Perfume (💎)
- Accessory (🎁)
- Other (⭐)

### 3️⃣ Upload Documents for Members

```
Dashboard → Documents Tab
```

**Steps:**
1. Select a member from dropdown
2. Choose document category
3. Select file (JPEG, PDF, etc.)
4. Click "Upload Document"

**Document Types:**
- Certificate
- Membership Card
- Letter
- Form
- Other

---

## For Customers

### 1️⃣ Browse Accessories

Visit: **http://localhost:3001/accessories**

Features:
- 📂 Filter by category
- 🛒 Add items to cart
- 📏 Select sizes when available
- 💰 See real-time total

### 2️⃣ Place Order via WhatsApp

1. Add items to cart
2. Click **"📱 Order on WhatsApp"** button
3. WhatsApp opens with pre-filled order message
4. Review & send message
5. Admin receives order and responds

**What's Included in Message:**
- ✅ Your name, email, phone
- ✅ Products ordered with quantities
- ✅ Price breakdown
- ✅ Total amount

---

## 📊 Admin Dashboard Tabs Explained

| Tab | Function |
|-----|----------|
| **Members** | Manage member applications (approve/reject) |
| **Documents** | Upload certificates, cards, forms to members |
| **Products** | Add/Delete accessories for sale |
| **Settings** | Configure WhatsApp business number |

---

## 🎯 Default Test Data

### Admin Login:
- Email: `admin@freemason.com`
- Password: `admin123`

### Test Product (Pre-added):
- Category: UNIFORM
- Stock: 50 units
- Price: $199.99

---

## 🔗 Key URLs

| Page | URL |
|------|-----|
| Home | / |
| Accessories Shop | /accessories |
| Member Dashboard | /dashboard |
| Admin Dashboard | /dashboard/admin |
| Member Documents | /documents |
| Signup | /signup |
| Login | /login |

---

## ⚠️ Troubleshooting

**Problem**: WhatsApp doesn't open
- ✅ Check WhatsApp installed on device
- ✅ Add `https://web.whatsapp.com` to browser exceptions
- ✅ Verify phone number format

**Problem**: Message format looks wrong
- ✅ WhatsApp automatically formats message
- ✅ Emojis and line breaks will display correctly

**Problem**: Orders not arriving
- ✅ Verify WhatsApp business number in Settings
- ✅ Ensure phone number is registered on WhatsApp
- ✅ Check WhatsApp account notifications are enabled

---

## 💡 Pro Tips

1. **Bulk Product Upload**: Add most products once, then manage from admin
2. **Order Management**: Save WhatsApp chat with customer for records
3. **Document Distribution**: Upload welcome packet to all approved members
4. **Customer Service**: Use WhatsApp Business features for faster responses

---

## 📞 Support Commands (Future Enhancement Ideas)

Could add WhatsApp bot to handle:
- Order status: "What's my order status?"
- Product info: "Tell me about the ring"
- Tracking: "Where's my package?"
- Returns: "How to return item?"

---

🎉 **System Ready to Use!**

Visit `/accessories` now and test the WhatsApp ordering! 📱
