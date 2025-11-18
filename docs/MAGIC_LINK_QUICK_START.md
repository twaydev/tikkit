# Magic Link Authentication - Quick Start Guide

## TL;DR
Passwordless authentication via email magic links - users receive a one-time link to sign in without passwords. Already supported by Supabase, just needs frontend implementation.

---

## 🎯 Core Features (From BDD Spec)

1. **Passwordless Login**: Users enter email → receive link → click to login
2. **One-Time Use**: Links expire after 1 hour and can only be used once
3. **Auto Account Creation**: New emails automatically get accounts
4. **Security**: Rate limiting, audit logging, IP tracking
5. **Integration**: Works with 2FA, RBAC, and existing auth

---

## 🚀 Quick Implementation Steps

### Step 1: Basic Magic Link (30 min)
```bash
# 1. Create magic link page
touch app/auth/magic-link/page.tsx

# 2. Create magic link form component
touch components/magic-link-form.tsx

# 3. Update login form to add magic link option
# Edit: components/login-form.tsx
```

**Supabase API Call (already available)**:
```typescript
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: `${window.location.origin}/auth/confirm`,
  },
});
```

**Verification (already implemented)**:
The existing `/auth/confirm/route.ts` already handles magic link verification via `verifyOtp()`.

---

### Step 2: Configure Supabase (10 min)

**In Supabase Dashboard:**
1. Go to Authentication > Email Templates > Magic Link
2. Customize email template with branding
3. Set link expiration to 1 hour
4. Add redirect URLs:
   - `http://localhost:3000/auth/confirm`
   - `https://yourdomain.com/auth/confirm`

---

### Step 3: Security Hardening (45 min)

**Rate Limiting**:
```typescript
// lib/utils/rate-limiter.ts
export const MAGIC_LINK_RATE_LIMIT = {
  maxAttempts: 3,    // 3 requests
  windowMs: 3600000, // per hour
};
```

**Audit Logging**:
```sql
-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  action VARCHAR(100),
  user_email VARCHAR(255),
  ip_address VARCHAR(45),
  status VARCHAR(20),
  created_at TIMESTAMPTZ
);
```

---

### Step 4: User Experience (30 min)

**Success Flow**:
1. User enters email → Show "Check your email" message
2. User clicks link → Show "Logging you in..." spinner
3. Redirect to dashboard → Show "Login successful" toast

**Error Flow**:
- Expired link → "Link expired, request new one"
- Used link → "Link already used, request new one"
- Invalid link → "Invalid link, try again"

---

## 📋 Basic vs Advanced Implementation

### ✅ Basic (MVP - 2-3 hours)
- [ ] Magic link request page
- [ ] Magic link form component
- [ ] Update login form
- [ ] Email template configuration
- [ ] Basic error handling

### 🚀 Advanced (Full Feature - 8-10 hours)
- [ ] Rate limiting (client + server)
- [ ] Audit logging with IP tracking
- [ ] 2FA/MFA integration
- [ ] User preferences/settings
- [ ] Admin analytics dashboard
- [ ] Comprehensive error pages
- [ ] BDD test implementation

---

## 🧪 Testing Checklist

### Manual Testing
```bash
# 1. Request magic link
curl -X POST https://your-project.supabase.co/auth/v1/otp \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 2. Check email inbox
# 3. Click magic link
# 4. Verify successful login
# 5. Try clicking link again (should fail)
# 6. Wait 1 hour, try old link (should fail)
```

### Automated Testing
```bash
# Run BDD tests
npm run test:e2e -- --grep "@magiclink"

# Run unit tests
npm run test -- rate-limiter
```

---

## 🔧 Configuration Files

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### Supabase Config
```toml
# supabase/config.toml
[auth.email]
enable_signup = true
enable_confirmations = true
max_frequency = "5m"
```

---

## 🎨 UI Components Needed

1. **Magic Link Form** (`components/magic-link-form.tsx`)
   - Email input
   - Send button
   - Success message
   - Error handling

2. **Magic Link Page** (`app/auth/magic-link/page.tsx`)
   - Container layout
   - Logo/branding
   - Form wrapper

3. **Login Form Update** (`components/login-form.tsx`)
   - Add "Login with Magic Link" button
   - OR divider
   - Navigation to magic link page

4. **Error Page Enhancement** (`app/auth/error/page.tsx`)
   - Expired link error
   - Used link error
   - Invalid link error
   - Retry button

---

## 🔐 Security Best Practices

### ✅ DO
- Rate limit requests (3 per email per hour)
- Log all authentication attempts
- Show generic messages for security
- Validate email format
- Track IP addresses
- Implement CSRF protection (via Supabase)

### ❌ DON'T
- Reveal if email exists in system
- Allow unlimited magic link requests
- Reuse tokens
- Allow expired links
- Skip audit logging
- Expose internal errors to users

---

## 📊 Success Metrics

Track these after deployment:
- Magic link request count
- Success/failure rate
- Average time to click link
- Rate limit hit rate
- User preference (magic link vs password)
- New account creation via magic link

---

## 🐛 Common Issues & Solutions

### Issue: Email not received
**Solution**: Check spam folder, verify Supabase email service status

### Issue: Link shows "expired" immediately
**Solution**: Check system time sync, verify Supabase time settings

### Issue: Link shows "already used"
**Solution**: Working as intended - request new link

### Issue: Rate limit too aggressive
**Solution**: Adjust `max_frequency` in Supabase config

### Issue: Magic link doesn't work with 2FA
**Solution**: Implement MFA challenge page (see full plan)

---

## 📚 Resources

- **Full Implementation Plan**: `MAGIC_LINK_IMPLEMENTATION_PLAN.md`
- **BDD Feature File**: `tests/features/magiclink.feature`
- **Supabase Docs**: https://supabase.com/docs/guides/auth/auth-magic-link
- **Next.js Auth**: https://nextjs.org/docs/authentication

---

## 🎯 First Steps (Today)

1. ✅ Review the full implementation plan
2. ⬜ Create basic magic link page and form
3. ⬜ Test magic link flow locally
4. ⬜ Configure Supabase email template
5. ⬜ Deploy to staging for testing

---

## 💡 Pro Tips

1. **Start Simple**: Get basic flow working first, add security later
2. **Test Email Delivery**: Use real email provider, not Supabase defaults in production
3. **User Education**: Add help text explaining magic links to users
4. **Monitor Usage**: Track how many users prefer magic link vs password
5. **Fallback**: Always keep password login as backup option

---

**Status**: Ready to implement  
**Estimated Time**: 2-3 hours (basic) | 8-10 hours (advanced)  
**Priority**: High  
**Dependencies**: Supabase Auth (already available)

