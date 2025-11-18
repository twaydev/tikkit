# Supabase MFA Implementation Plan

## Overview
Supabase supports three Multi-Factor Authentication (MFA) methods. This document outlines the implementation plan for all available MFA options.

## Current Status
✅ **TOTP (Time-based One-Time Password)** - Implemented
- Uses authenticator apps (Google Authenticator, Authy, etc.)
- QR code enrollment
- 6-digit verification codes

## Available MFA Methods

### 1. TOTP (Time-based One-Time Password) ✅ IMPLEMENTED
**Status**: Fully implemented in `components/settings/two-factor-auth.tsx`

**Features**:
- QR code enrollment
- Manual secret entry
- 6-digit verification codes
- Recovery codes (placeholder implementation)

**API Methods Used**:
- `supabase.auth.mfa.enroll({ factorType: "totp" })`
- `supabase.auth.mfa.challenge({ factorId })`
- `supabase.auth.mfa.verify({ factorId, challengeId, code })`
- `supabase.auth.mfa.unenroll({ factorId })`
- `supabase.auth.mfa.listFactors()`

---

### 2. Phone/SMS MFA 📱 TO IMPLEMENT
**Status**: Not yet implemented

**How it works**:
- User enrolls with phone number
- During login, receives SMS with OTP code
- Enters code to complete authentication

**Implementation Requirements**:
1. **Supabase Configuration**:
   - Enable SMS provider (Twilio, MessageBird, etc.) in Supabase Dashboard
   - Configure `[auth.mfa.phone]` settings
   - Set up SMS provider credentials

2. **Frontend Components Needed**:
   - Phone number input field
   - OTP verification input
   - SMS sending functionality
   - Phone number verification flow

3. **API Methods**:
   ```typescript
   // Enroll phone factor
   supabase.auth.mfa.enroll({
     factorType: "phone",
     phone: "+1234567890"
   })

   // Challenge (sends OTP)
   supabase.auth.mfa.challenge({
     factorId: factor.id
   })

   // Verify OTP
   supabase.auth.mfa.verify({
     factorId: factor.id,
     challengeId: challenge.id,
     code: "123456"
   })
   ```

4. **UI Flow**:
   - Add phone number input
   - Send verification code button
   - OTP input field
   - Verify and enable button
   - Display enrolled phone number
   - Option to change/remove phone number

**Files to Create/Modify**:
- `components/settings/phone-mfa.tsx` (new component)
- `components/settings/two-factor-auth.tsx` (add phone option)
- Update settings tabs to show multiple MFA methods

---

### 3. WebAuthn (Passkeys/Biometric) 🔐 TO IMPLEMENT
**Status**: Not yet implemented

**How it works**:
- Uses device biometrics (Face ID, Touch ID, Windows Hello)
- Or hardware security keys (YubiKey, etc.)
- Passwordless authentication option

**Implementation Requirements**:
1. **Supabase Configuration**:
   - Enable `[auth.mfa.web_authn]` in config
   - Requires HTTPS in production
   - Browser support: Chrome, Firefox, Safari, Edge

2. **Frontend Components Needed**:
   - WebAuthn enrollment button
   - Device/biometric selection
   - Passkey management (list, remove)
   - Fallback options

3. **API Methods**:
   ```typescript
   // Enroll WebAuthn factor
   supabase.auth.mfa.enroll({
     factorType: "webauthn",
     friendlyName: "iPhone Face ID"
   })

   // Challenge (triggers biometric prompt)
   supabase.auth.mfa.challenge({
     factorId: factor.id
   })

   // Verify (handled automatically by browser)
   // No manual code entry needed
   ```

4. **UI Flow**:
   - "Add Passkey" or "Add Biometric" button
   - Browser prompts for biometric/security key
   - Display enrolled devices/keys
   - Friendly names for each device
   - Remove device option

**Files to Create/Modify**:
- `components/settings/webauthn-mfa.tsx` (new component)
- `components/settings/two-factor-auth.tsx` (add WebAuthn option)
- Browser compatibility checks

---

## Implementation Plan

### Phase 1: Enhance Current TOTP Implementation
**Priority**: High
**Estimated Time**: 1-2 hours

**Tasks**:
1. ✅ Fix recovery codes to use actual Supabase recovery codes API
2. ✅ Add ability to view enrolled factors with details
3. ✅ Add factor management (rename, view details)
4. ✅ Improve error handling and user feedback
5. ✅ Add factor verification status display

**Files to Modify**:
- `components/settings/two-factor-auth.tsx`

---

### Phase 2: Implement Phone/SMS MFA
**Priority**: Medium
**Estimated Time**: 4-6 hours

**Tasks**:
1. Create phone MFA component
2. Add phone number input and validation
3. Implement OTP sending and verification
4. Add phone number management (change, remove)
5. Integrate with existing MFA settings
6. Add SMS provider configuration instructions

**Files to Create**:
- `components/settings/phone-mfa.tsx`

**Files to Modify**:
- `components/settings/two-factor-auth.tsx` (add phone option)
- `components/settings/settings-tabs.tsx` (if needed)

**Supabase Setup Required**:
- Configure SMS provider (Twilio recommended)
- Enable `auth.mfa.phone.enroll_enabled = true`
- Enable `auth.mfa.phone.verify_enabled = true`
- Set up provider credentials

---

### Phase 3: Implement WebAuthn MFA
**Priority**: Medium
**Estimated Time**: 6-8 hours

**Tasks**:
1. Create WebAuthn component
2. Add browser compatibility detection
3. Implement passkey enrollment
4. Add device/key management
5. Handle biometric prompts
6. Add fallback options for unsupported browsers
7. Integrate with existing MFA settings

**Files to Create**:
- `components/settings/webauthn-mfa.tsx`
- `lib/webauthn-utils.ts` (helper functions)

**Files to Modify**:
- `components/settings/two-factor-auth.tsx` (add WebAuthn option)

**Supabase Setup Required**:
- Enable `auth.mfa.web_authn.enroll_enabled = true`
- Enable `auth.mfa.web_authn.verify_enabled = true`
- Ensure HTTPS in production

---

### Phase 4: Unified MFA Management
**Priority**: High
**Estimated Time**: 3-4 hours

**Tasks**:
1. Create unified MFA management component
2. Display all enrolled factors in one place
3. Add factor type indicators (TOTP, Phone, WebAuthn)
4. Allow multiple factors per user
5. Set primary/secondary factor options
6. Add factor usage statistics
7. Improve overall UX with tabs or accordion

**Files to Create**:
- `components/settings/mfa-manager.tsx` (unified component)

**Files to Modify**:
- `components/settings/two-factor-auth.tsx` (refactor to use manager)
- `components/settings/authentication-settings.tsx` (update integration)

---

## UI/UX Design Considerations

### Factor Selection
- Use tabs or accordion to separate different MFA methods
- Show status badges (Enabled/Disabled)
- Display last used date for each factor
- Show factor type icons

### Enrollment Flow
1. **TOTP**: Scan QR → Enter code → Enable
2. **Phone**: Enter phone → Verify OTP → Enable
3. **WebAuthn**: Click button → Biometric prompt → Enable

### Factor Management
- List all enrolled factors
- Show factor details (name, type, status)
- Allow renaming factors
- Remove factors with confirmation
- Set default factor for login

### Visual Design
- Follow Tikkit design system (purple/pink gradients)
- Use consistent card layouts
- Add icons for each factor type:
  - TOTP: QrCode icon
  - Phone: Smartphone icon
  - WebAuthn: Fingerprint/Shield icon

---

## Technical Considerations

### Multiple Factors
- Users can enroll multiple factors of the same type
- Users can enroll different types simultaneously
- During login, user can choose which factor to use
- System should support fallback if primary factor fails

### Factor Priority
- Allow users to set preferred factor
- Show factors in priority order
- Support "remember this device" option

### Security Best Practices
1. Require password confirmation before changing MFA
2. Send email notification when MFA is enabled/disabled
3. Log all MFA enrollment/removal events
4. Rate limit MFA attempts
5. Show last successful login with MFA

### Error Handling
- Handle SMS delivery failures
- Handle WebAuthn browser compatibility
- Handle network errors during enrollment
- Provide clear error messages
- Offer alternative methods if one fails

---

## Database/Storage Considerations

### Factor Metadata
Supabase stores factors in `auth.mfa_factors` table (managed by Supabase):
- `id`: Factor UUID
- `user_id`: User UUID
- `friendly_name`: User-defined name
- `factor_type`: "totp", "phone", or "webauthn"
- `status`: "verified" or "unverified"
- `created_at`: Enrollment timestamp
- `updated_at`: Last update timestamp

### Custom Metadata (Optional)
Consider storing additional metadata in a custom table:
- Last used timestamp
- Usage count
- Device information (for WebAuthn)
- Phone number (for Phone MFA)

---

## Testing Checklist

### TOTP Testing
- [ ] QR code generation
- [ ] Manual secret entry
- [ ] Code verification
- [ ] Multiple TOTP factors
- [ ] Factor removal
- [ ] Recovery codes

### Phone MFA Testing
- [ ] Phone number validation
- [ ] OTP sending
- [ ] OTP verification
- [ ] Invalid OTP handling
- [ ] Expired OTP handling
- [ ] Phone number change
- [ ] Multiple phone factors

### WebAuthn Testing
- [ ] Browser compatibility detection
- [ ] Passkey enrollment
- [ ] Biometric authentication
- [ ] Hardware key support
- [ ] Multiple devices
- [ ] Device removal
- [ ] Fallback for unsupported browsers

### Integration Testing
- [ ] Multiple factors of different types
- [ ] Factor switching during login
- [ ] Factor priority
- [ ] Error recovery
- [ ] Concurrent enrollment attempts

---

## Configuration Requirements

### Supabase Dashboard Settings

1. **Enable MFA**:
   - Go to Authentication → Settings → Multi-Factor Authentication
   - Enable MFA for your project

2. **TOTP Configuration**:
   - `auth.mfa.totp.enroll_enabled = true`
   - `auth.mfa.totp.verify_enabled = true`

3. **Phone MFA Configuration**:
   - Configure SMS provider (Twilio, MessageBird, etc.)
   - `auth.mfa.phone.enroll_enabled = true`
   - `auth.mfa.phone.verify_enabled = true`
   - Set OTP template and length

4. **WebAuthn Configuration**:
   - `auth.mfa.web_authn.enroll_enabled = true`
   - `auth.mfa.web_authn.verify_enabled = true`
   - Ensure HTTPS in production

5. **General MFA Settings**:
   - `auth.mfa.max_enrolled_factors = 10` (default)

---

## API Reference

### List All Factors
```typescript
const { data, error } = await supabase.auth.mfa.listFactors();
// Returns: { all: Factor[], totp?: Factor[], phone?: Factor[], webauthn?: Factor[] }
```

### Enroll TOTP
```typescript
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: "totp",
  friendlyName: "My Authenticator App"
});
// Returns: { id, type, totp: { qr_code, secret, uri } }
```

### Enroll Phone
```typescript
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: "phone",
  phone: "+1234567890"
});
// Returns: { id, type, phone: { phone } }
```

### Enroll WebAuthn
```typescript
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: "webauthn",
  friendlyName: "iPhone Face ID"
});
// Returns: { id, type, webauthn: { ... } }
```

### Challenge Factor
```typescript
const { data, error } = await supabase.auth.mfa.challenge({
  factorId: factor.id
});
// Returns: { id, expires_at }
```

### Verify Factor
```typescript
// TOTP/Phone
const { error } = await supabase.auth.mfa.verify({
  factorId: factor.id,
  challengeId: challenge.id,
  code: "123456"
});

// WebAuthn (automatic, no code needed)
const { error } = await supabase.auth.mfa.verify({
  factorId: factor.id,
  challengeId: challenge.id
});
```

### Unenroll Factor
```typescript
const { error } = await supabase.auth.mfa.unenroll({
  factorId: factor.id
});
```

---

## Next Steps

1. **Immediate**: Enhance TOTP implementation with proper recovery codes
2. **Short-term**: Implement Phone/SMS MFA
3. **Medium-term**: Implement WebAuthn MFA
4. **Long-term**: Create unified MFA management interface

---

## Resources

- [Supabase MFA Documentation](https://supabase.com/docs/guides/auth/auth-mfa)
- [Supabase TOTP Guide](https://supabase.com/docs/guides/auth/auth-mfa/totp)
- [Supabase Phone MFA](https://supabase.com/docs/guides/auth/auth-mfa/phone)
- [Supabase WebAuthn](https://supabase.com/docs/guides/auth/auth-mfa/webauthn)
- [WebAuthn Browser Support](https://webauthn.guide/)

---

**Last Updated**: Based on Supabase MFA capabilities as of 2024
**Version**: 1.0.0

