# Account Settings Implementation Plan

## Overview
Create a comprehensive account settings page with three main sections: General, Authentication, and Integration.

## Page Structure
- **Route**: `/protected/settings`
- **Layout**: Uses existing protected layout with sidebar
- **Design**: Follows Tikkit design system (purple/pink/orange gradients)

## Sections

### 1. General Settings
**Purpose**: Manage basic profile information

**Features**:
- Display current email (read-only, managed by Supabase auth)
- Display name/Full name (from user metadata)
- Avatar/Profile picture (optional, future enhancement)
- Timezone preference (optional, future enhancement)
- Language preference (optional, future enhancement)

**Data Source**: 
- `user.email` from Supabase auth
- `user.user_metadata` for display name and other custom fields

**Actions**:
- Update display name via `supabase.auth.updateUser({ data: { display_name: ... } })`
- Save button with loading state

### 2. Authentication Settings
**Purpose**: Manage security and authentication

**Features**:
- Change password form
- Active sessions list (optional, future enhancement)
- Two-factor authentication toggle (optional, future enhancement)
- Email verification status
- Last login information

**Actions**:
- Update password via `supabase.auth.updateUser({ password: ... })`
- View active sessions (if implemented)
- Enable/disable 2FA (if implemented)

### 3. Integration Settings
**Purpose**: Manage API keys, webhooks, and third-party integrations

**Features**:
- API keys management (generate, view, revoke)
- Webhook endpoints configuration
- Third-party integrations (GitHub, Slack, etc. - future)
- Integration status indicators

**Actions**:
- Generate new API key
- Copy API key to clipboard
- Revoke API key
- Add/edit webhook endpoints
- Delete webhook endpoints

## Components Needed

### Main Components
1. **Settings Page** (`app/protected/settings/page.tsx`)
   - Server component that fetches user data
   - Renders settings sections

2. **Settings Layout** (optional, can use tabs or sections)
   - Navigation between sections
   - Consistent layout

### Section Components
1. **GeneralSettings** (`components/settings/general-settings.tsx`)
   - Form for display name
   - Read-only email display
   - Save functionality

2. **AuthenticationSettings** (`components/settings/authentication-settings.tsx`)
   - Password change form (reuse existing UpdatePasswordForm pattern)
   - Email verification status
   - Session information

3. **IntegrationSettings** (`components/settings/integration-settings.tsx`)
   - API keys list
   - Webhook configuration
   - Integration cards

### UI Components (may need to add)
1. **Tabs** - For section navigation (can use shadcn/ui tabs)
2. **Separator** - For visual separation (can use shadcn/ui separator)
3. **Alert** - For success/error messages (can use shadcn/ui alert)

## Database Schema (if needed)

### API Keys Table (future)
```sql
create table if not exists api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  key_hash text not null,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);
```

### Webhooks Table (future)
```sql
create table if not exists webhooks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  secret text,
  events text[],
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Implementation Steps

### Phase 1: Basic Structure (Current)
1. ✅ Create settings page route
2. ✅ Add Settings link to sidebar navigation
3. ✅ Create page layout with section headers
4. ✅ Style according to design system

### Phase 2: General Settings
1. ✅ Fetch user data from Supabase
2. ✅ Display current email (read-only)
3. ✅ Create form for display name
4. ✅ Implement update functionality
5. ✅ Add success/error feedback

### Phase 3: Authentication Settings
1. ✅ Create password change form (reuse pattern)
2. ✅ Display email verification status
3. ✅ Add session information display
4. ⏳ Active sessions management (future)
5. ⏳ 2FA setup (future)

### Phase 4: Integration Settings
1. ✅ Create API keys section UI
2. ✅ Add webhook configuration UI
3. ⏳ Implement API key generation (requires backend/database)
4. ⏳ Implement webhook management (requires backend/database)
5. ⏳ Add third-party integrations (future)

## Design Guidelines

### Colors
- Use purple/pink/orange gradients for headings
- Use `border-purple-200 dark:border-purple-800` for cards
- Use gradient buttons: `bg-gradient-to-r from-purple-600 to-pink-600`

### Layout
- Use Card components for each section
- Add section headers with gradient text
- Use consistent spacing (gap-6, p-6)
- Add decorative blobs for visual interest

### Forms
- Use existing Input, Label, Button components
- Add loading states
- Show success/error messages
- Use consistent form spacing

## Navigation

### Sidebar Update
Add to `components/sidebar.tsx`:
```typescript
{ name: "Settings", href: "/protected/settings", icon: Settings }
```

## Testing Considerations
- Test form submissions
- Test error handling
- Test loading states
- Test responsive design
- Test dark mode

## Future Enhancements
- Profile picture upload
- Email change functionality
- Two-factor authentication
- Active sessions management
- API key rotation
- Webhook event filtering
- Integration with GitHub, Slack, etc.
- Export account data
- Delete account functionality

