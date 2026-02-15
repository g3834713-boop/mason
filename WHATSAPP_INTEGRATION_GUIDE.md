# WhatsApp Order Integration - Setup Guide

## Overview
The Freemason International website now includes WhatsApp integration for accessories orders. Customers can order directly via WhatsApp instead of using a checkout form.

## How It Works

### For Customers:
1. Customer browses accessories on `/accessories` page
2. Customer adds items to cart and click **"📱 Order on WhatsApp"** button
3. A pre-formatted message is created with:
   - Customer name, email, phone
   - List of items with quantities and prices
   - Subtotal, shipping, tax, and total
4. WhatsApp Web/App opens with the message ready to send
5. Admin receives the order and can confirm/process

### For Admin Setup:
1. Go to Admin Dashboard
2. Navigate to **Settings** tab
3. Enter your WhatsApp Business phone number (format: `12015550123`)
4. Click **"Save WhatsApp Settings"**
5. All customer orders will now be sent to that number

## Features Implemented

### Pages & Components:
- ✅ `/app/accessories/page.tsx` - Updated with WhatsApp order button
- ✅ `/app/checkout/page.tsx` - Kept for future reference (not currently used)
- ✅ `/app/order-confirmation/[id]/page.tsx` - Can be used for traditional checkout flow later

### API Endpoints:
- ✅ `GET /api/admin/whatsapp-config` - Retrieve WhatsApp settings
- ✅ `POST /api/admin/whatsapp-config` - Save WhatsApp phone number
- ✅ `GET /api/products?all=true` - Fetch all products (admin view)
- ✅ `POST /api/admin/products` - Add new product
- ✅ `DELETE /api/admin/products/[id]` - Delete product

### Admin Dashboard:
- ✅ **Settings Tab** - Configure WhatsApp business number
- ✅ **Members Tab** - View and manage member applications
- ✅ **Documents Tab** - Upload documents to members
- ✅ **Products Tab** - Manage accessories inventory

## WhatsApp Message Format

```
🛒 Freemason Accessories Order Request

Customer Details:
Name: John Doe
Email: john@example.com
Phone: +1-234-567-8900

📦 Items Ordered:
• Freemason Ring (Size: 10)
  Qty: 1 x $149.99 = $149.99
• Freemason Bible
  Qty: 1 x $49.99 = $49.99

💰 Order Summary:
Subtotal: $199.98
Shipping: $25.00
Tax (10%): $22.50
Total: $247.48

Please confirm this order and provide shipping details.
```

## Configuration

### WhatsApp Business Number Format:
- **Format:** Country code + number (digits only)
- **US Example:** `12015550123` (for +1 201-555-0123)
- **UK Example:** `442071838750` (for +44 20 7183 8750)
- **No spaces, dashes, or + symbol**

### Get Your Business Number:
1. Visit https://www.whatsapp.com/business/
2. Create a WhatsApp Business account
3. Get and verify your phone number
4. Add the number to the Settings page in admin dashboard

## Technical Files Modified

1. **app/accessories/page.tsx**
   - Added `handleWhatsAppOrder()` function
   - Fetch WhatsApp config from API
   - Changed checkout button to WhatsApp order button

2. **app/dashboard/admin/page.tsx**
   - Added Settings tab
   - Added WhatsApp configuration UI
   - Added `handleSaveWhatsAppSettings()` function
   - Added `fetchWhatsAppSettings()` function

3. **app/api/admin/whatsapp-config/route.ts** (NEW)
   - GET endpoint to retrieve saved WhatsApp number
   - POST endpoint to save WhatsApp number
   - Admin-only access with role verification

4. **components/Navigation.tsx**
   - Added authentication state detection
   - Added links to Documents and Accessories pages
   - Conditional rendering for authenticated users

## Testing Checklist

- [ ] Admin can access Settings tab in admin dashboard
- [ ] Admin can enter WhatsApp business number
- [ ] WhatsApp number is saved correctly
- [ ] Customer can add items to cart on accessories page
- [ ] "Order on WhatsApp" button opens WhatsApp with pre-filled message
- [ ] Message includes all order details correctly formatted
- [ ] WhatsApp message is sent to the configured business number
- [ ] Message displays with proper formatting (bold, emojis, line breaks)

## Troubleshooting

**WhatsApp doesn't open:**
- Ensure WhatsApp is installed on the device
- Check if WhatsApp Web is available (https://web.whatsapp.com)
- Verify the phone number format (no spaces or symbols)

**Message not received:**
- Confirm the WhatsApp business number is formatted correctly
- Ensure the number is registered and active on WhatsApp
- Check if the number is receiving messages from other sources

**Phone number format error:**
- Remove all special characters: no + , - ( ) spaces
- Include full country code (e.g., 1 for US, 44 for UK)
- Example: `12015550123` not `+1 (201) 555-0123`

## Future Enhancements

- Add WhatsApp message template customization
- Send order confirmations via WhatsApp
- Implement order tracking via WhatsApp
- Add WhatsApp payment integration (when available)
- Create admin WhatsApp dashboard for order management
