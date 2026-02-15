# Quick Test Guide - Voucher Recruitment System

## Test Complete Workflow

### Step 1: Admin Creates Voucher
1. Login as admin at `/login`
   - Email: Use your admin account
   - Password: Your admin password

2. Navigate to **Dashboard** → Click **Admin Dashboard**

3. Click on **Vouchers** tab

4. Create a voucher:
   - Amount: `100`
   - Currency: `USD`
   - Click **Create Voucher**

5. **Copy the voucher code** that appears (e.g., `ABC23XYZ4H`)

### Step 2: User Purchases Voucher (Optional)
1. As a regular user, visit `/buy-voucher`
2. Select amount and currency
3. Click "Request Voucher via WhatsApp"
4. This opens WhatsApp with pre-filled message
5. In real scenario, admin would receive payment and create voucher

### Step 3: User Accesses Join Now
1. Login as a regular user (or signup if needed)
2. Click **Join Now** in navigation menu
3. Enter the voucher code you copied from Step 1
4. Click **Validate Voucher**

### Step 4: Fill Recruitment Form
Once voucher is validated, you'll see the comprehensive form:

**Personal Information**
- Full Legal Name: `John Mason Doe`
- Date of Birth: `1985-05-15`
- Place of Birth: `New York, USA`
- Nationality: `American`

** Information**
- Email: `john.doe@example.com`
- Phone: `+1234567890`
- Address: `123 Main Street`
- City: `New York`
- State/Province: `NY`
- Country: `United States`
- Postal Code: `10001`

**Professional Information**
- Occupation: `Software Engineer`
- Employer: `Tech Corp`
- Years in Profession: `10`

**Masonic Information**
- Why do you want to become a Freemason?: `I seek brotherhood, moral development, and the opportunity to contribute to society. Freemasonry's principles of integrity and charity align with my personal values.`
- What do you know about Freemasonry?: `I understand it to be a fraternal organization focused on moral and spiritual development, with a rich history of charitable work and community service.`
- Recommended by: (Optional) Leave blank or add name
- Check boxes as applicable

**Character References** (3 required)
Reference 1:
- Name: `Robert Smith`
- Relationship: `Colleague`
- Phone: `+1234567891`
- Email: `robert.smith@example.com`

Reference 2:
- Name: `Michael Johnson`
- Relationship: `Friend`
- Phone: `+1234567892`
- Email: `michael.j@example.com`

Reference 3:
- Name: `David Williams`
- Relationship: `Mentor`
- Phone: `+1234567893`
- Email: `david.w@example.com`

**Background Information**
- Criminal Record: Leave unchecked (or check and provide details)
- Moral Character: `I strive to live with integrity, honesty, and respect for others. I believe in treating people fairly and contributing positively to my community.`
- **IMPORTANT**: Check "I believe in a Supreme Being" ✓

Click **Submit Application**

### Step 5: Verify Submission
1. You should see success message
2. Click "Go to Dashboard"
3. Navigate to your dashboard at `/dashboard`

### Step 6: Admin Reviews Application
1. Login as admin
2. Go to **Admin Dashboard**
3. Click **Recruitment Applications** tab
4. You should see the application you just submitted
5. Click to view details
6. Update status to "Approved" or "Rejected"

## Verify Voucher Was Used

1. As admin, go to **Vouchers** tab
2. Find the voucher code you used
3. It should show:
   - Status: Used ✓
   - Used By: [User's name]
   - Used At: [Timestamp]

## Test Error Cases

### Invalid Voucher Code
1. Go to `/join-now`
2. Enter: `INVALID123`
3. Should show error: "Invalid voucher code"

### Used Voucher
1. Try to use the same voucher code again
2. Should show error indicating voucher already used

### Incomplete Form
1. Try to submit form without filling required fields
2. Browser should prevent submission with validation messages

### No Authentication
1. Logout
2. Try to access `/join-now`
3. Should redirect to login or show error

## Expected Database Records

After successful test:

**Vouchers Collection**
```javascript
{
  code: "ABC23XYZ4H",
  amount: 100,
  currency: "USD",
  isUsed: true,
  usedBy: ObjectId("..."),
  usedAt: ISODate("..."),
  createdBy: ObjectId("admin-id")
}
```

**Recruitments Collection**
```javascript
{
  userId: ObjectId("user-id"),
  voucher: ObjectId("voucher-id"),
  fullName: "John Mason Doe",
  email: "john.doe@example.com",
  // ... all other fields
  references: [
    { name: "Robert Smith", ... },
    { name: "Michael Johnson", ... },
    { name: "David Williams", ... }
  ],
  beliefInSupremeBeing: true,
  status: "pending",
  submittedAt: ISODate("...")
}
```

## Troubleshooting

### Voucher validation fails
- Check voucher code is exactly 10 characters
- Verify code exists in database
- Ensure user is logged in

### Form won't submit
- Make sure all required fields are filled
- "Belief in Supreme Being" must be checked
- All 3 references must be complete
- Check browser console for errors

### Admin can't see applications
- Verify user role is 'ADMIN' (uppercase)
- Check MongoDB connection
- Refresh the page

### WhatsApp integration not working
- Verify WhatsApp config in admin dashboard
- Check phone number format
- Ensure WhatsApp is installed on device

## Success Criteria

✅ Admin can create vouchers
✅ User can validate voucher code
✅ User can access form after validation
✅ User can submit complete application
✅ Voucher is marked as used after submission
✅ Admin can view all applications
✅ Admin can update application status
✅ Same voucher cannot be used twice

## URL Reference

- Buy Voucher: `http://localhost:3000/buy-voucher`
- Join Now: `http://localhost:3000/join-now`
- User Dashboard: `http://localhost:3000/dashboard`
- Admin Dashboard: `http://localhost:3000/dashboard/admin`

Replace `localhost:3000` with your Vercel URL: `https://mason-one.vercel.app`
