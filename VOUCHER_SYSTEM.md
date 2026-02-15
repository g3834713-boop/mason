# Freemason Recruitment Voucher System

## Overview
The voucher system enables controlled access to the Freemason recruitment application process. Users must purchase a voucher to access the comprehensive recruitment form.

## System Flow

### 1. Voucher Purchase (Client Side)
- **Page**: `/buy-voucher`
- **Process**:
  1. User selects voucher amount (50, 100, 200, 500, or custom)
  2. User selects currency (USD, EUR, GBP)
  3. User clicks "Request Voucher via WhatsApp"
  4. WhatsApp message is auto-generated with amount and currency
  5. User sends message to admin
  6. Admin reviews payment request

### 2. Voucher Generation (Admin Side)
- **Page**: `/dashboard/admin` → Vouchers Tab
- **Process**:
  1. Admin enters voucher amount
  2. Admin selects currency
  3. Admin clicks "Create Voucher"
  4. System generates unique 10-character code
  5. Voucher is saved to database
  6. Admin shares voucher code with user

### 3. Voucher Validation (Client Side)
- **Page**: `/join-now`
- **Process**:
  1. User enters 10-digit voucher code
  2. System validates code against database
  3. If valid and unused: proceeds to recruitment form
  4. If invalid/used: shows error message
  5. Link provided to purchase voucher if needed

### 4. Recruitment Application (Client Side)
- **Page**: `/join-now` (after voucher validation)
- **Process**:
  1. User fills comprehensive recruitment form
  2. Form includes:
     - Personal information
     - Contact details
     - Professional background
     - Masonic knowledge and interest
     - Three character references
     - Background information
     - Belief in Supreme Being (required)
  3. User submits application
  4. System marks voucher as "used"
  5. Application saved to database

### 5. Application Review (Admin Side)
- **Page**: `/dashboard/admin` → Recruitment Applications Tab
- **Process**:
  1. Admin views all recruitment applications
  2. Applications show submission date and status
  3. Admin can review full application details
  4. Admin can update application status (pending/approved/rejected)

## Database Models

### Voucher Model
```typescript
{
  code: string;           // 10-character unique code (uppercase, alphanumeric)
  amount: number;         // Voucher value
  currency: string;       // 'USD', 'EUR', or 'GBP'
  createdBy: ObjectId;    // Admin who created the voucher
  isUsed: boolean;        // Whether voucher has been redeemed
  usedBy?: ObjectId;      // User who used the voucher
  usedAt?: Date;          // When voucher was used
  createdAt: Date;
  updatedAt: Date;
}
```

### Recruitment Model
```typescript
{
  user: ObjectId;                    // User who submitted application
  voucher: ObjectId;                 // Voucher used for application
  
  // Personal Information
  fullName: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  nationality: string;
  
  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  // Professional Information
  occupation: string;
  employer: string;
  yearsInProfession: number;
  
  // Masonic Information
  reason: string;                    // Why join Freemasonry
  knowledgeOfFreemasonry: string;
  recommendedBy?: string;
  previouslyApplied: boolean;
  relativesInFreemasonry: boolean;
  relativeDetails?: string;
  
  // Character References (3 required)
  references: [{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }];
  
  // Background
  criminalRecord: boolean;
  criminalDetails?: string;
  moralCharacter: string;
  beliefInSupremeBeing: boolean;     // Required = true
  
  // Application Status
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: ObjectId;
}
```

## API Endpoints

### Voucher Endpoints

#### `POST /api/admin/vouchers`
Create new voucher (Admin only)
```json
Request:
{
  "amount": 100,
  "currency": "USD"
}

Response:
{
  "success": true,
  "voucher": {
    "_id": "...",
    "code": "ABC123XYZ4",
    "amount": 100,
    "currency": "USD",
    "isUsed": false
  }
}
```

#### `GET /api/admin/vouchers`
List all vouchers (Admin only)
```json
Response:
{
  "success": true,
  "vouchers": [...]
}
```

#### `POST /api/vouchers/validate`
Validate voucher code (User)
```json
Request:
{
  "code": "ABC123XYZ4"
}

Response:
{
  "valid": true,
  "amount": 100,
  "currency": "USD"
}
```

### Recruitment Endpoints

#### `POST /api/recruitments`
Submit recruitment application (User)
```json
Request:
{
  "voucherCode": "ABC123XYZ4",
  "fullName": "John Doe",
  "email": "john@example.com",
  // ... all other required fields
}

Response:
{
  "success": true,
  "application": {...}
}
```

#### `GET /api/recruitments`
Get user's applications (User)
```json
Response:
{
  "success": true,
  "applications": [...]
}
```

#### `GET /api/admin/recruitments`
Get all recruitment applications (Admin only)
```json
Response:
{
  "success": true,
  "applications": [...]
}
```

#### `PATCH /api/admin/recruitments/:id`
Update application status (Admin only)
```json
Request:
{
  "status": "approved"
}

Response:
{
  "success": true,
  "application": {...}
}
```

## Voucher Code Generation

Voucher codes are generated using the following rules:
- **Length**: 10 characters
- **Format**: Uppercase alphanumeric
- **Excluded characters**: O, 0, I, 1 (to avoid confusion)
- **Character set**: ABCDEFGHJKLMNPQRSTUVWXYZ23456789 (30 characters)
- **Uniqueness**: Checked against database before creation

Example codes:
- `ABC23XYZ4H`
- `XYZ789PQRS`
- `MNP456TUVW`

## WhatsApp Integration

When purchasing a voucher, users can request it via WhatsApp:
```
Hello! I would like to purchase a Freemason recruitment voucher.

Amount: $100.00
Currency: USD

Please confirm payment details and send me the voucher code.

Thank you!
```

## Security Features

1. **One-Time Use**: Each voucher can only be used once
2. **Authentication Required**: Users must be logged in to purchase or use vouchers
3. **Admin-Only Creation**: Only admins can generate vouchers
4. **Usage Tracking**: System tracks who used voucher and when
5. **Validation Before Form**: Voucher must be validated before accessing recruitment form

## User Journey

1. **Discovery**: User visits site and clicks "Join Now" in navigation
2. **Voucher Entry**: User shown voucher code input screen
3. **Purchase Option**: If no voucher, user clicks "Buy One Now"
4. **WhatsApp Request**: User sends payment request via WhatsApp
5. **Admin Creates Voucher**: Admin receives payment, creates voucher
6. **Code Sharing**: Admin sends voucher code to user
7. **Code Entry**: User enters code on "Join Now" page
8. **Form Access**: Code validated, recruitment form displayed
9. **Application Submission**: User completes and submits form
10. **Admin Review**: Admin reviews application in dashboard
11. **Status Update**: Admin approves/rejects application
12. **User Notification**: User receives email notification (future feature)

## Admin Features

### Voucher Management
- Create vouchers with custom amounts
- View all vouchers (used and unused)
- See who created each voucher
- Track voucher usage (who used it and when)

### Recruitment Management
- View all recruitment applications
- Filter by status (pending/approved/rejected)
- Review complete application details
- Update application status
- Track review history

## Future Enhancements

1. **Email Notifications**: Auto-email voucher codes to users
2. **Payment Integration**: Direct payment gateway instead of WhatsApp
3. **Voucher Expiration**: Add expiry dates to vouchers
4. **Bulk Voucher Generation**: Create multiple vouchers at once
5. **Application Comments**: Allow admins to add notes to applications
6. **Interview Scheduling**: Schedule interviews with applicants
7. **Document Upload**: Allow applicants to upload supporting documents
8. **Application Status Tracking**: User portal to track application progress

## Testing the System

### Test as User:
1. Navigate to `/join-now`
2. Enter a valid voucher code
3. Fill out recruitment form
4. Submit application
5. Check `/dashboard` for application status

### Test as Admin:
1. Navigate to `/dashboard/admin`
2. Click "Vouchers" tab
3. Create new voucher
4. Share code with test user
5. Click "Recruitment Applications" tab
6. Review submitted applications
7. Update application status

## Troubleshooting

### Voucher not validating
- Check code is exactly 10 characters
- Verify code hasn't been used already
- Confirm code exists in database

### Form not submitting
- Ensure all required fields are filled
- Verify "Belief in Supreme Being" is checked
- Check browser console for errors
- Confirm user is authenticated

### Admin can't create vouchers
- Verify user role is 'ADMIN' (uppercase)
- Check JWT token is valid
- Confirm MongoDB connection is active

## Database Queries

### Find unused vouchers:
```javascript
db.vouchers.find({ isUsed: false })
```

### Find pending applications:
```javascript
db.recruitments.find({ status: 'pending' })
```

### Check voucher usage:
```javascript
db.vouchers.find({ isUsed: true }).populate('usedBy')
```
