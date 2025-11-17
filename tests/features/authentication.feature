Feature: User Authentication with Email and Password
  As a user
  I want to create an account and log in with email and password
  So that I can access my tickets securely

  Background:
    Given the application is running
    And the Supabase authentication service is available
    And the email service is configured and operational

## Scenario 1: User Registration - Happy Path

  Scenario: New user successfully signs up with valid credentials
    Given I am on the signup page
    And I have not registered before
    When I enter email "john.doe@example.com"
    And I enter password "SecurePass123"
    And I confirm password "SecurePass123"
    And I accept the terms and conditions
    And I click the "Sign Up" button
    Then the system should validate the input
    And an account should be created with email "john.doe@example.com"
    And a verification email should be sent to "john.doe@example.com"
    And I should see the message "Check your email to verify your account"
    And my account status should be "pending_verification"


  Scenario: User receives verification email with valid link
    Given I have successfully signed up with email "john.doe@example.com"
    When I check my email
    Then I should receive a verification email
    And the email should contain a verification link
    And the verification link should be valid for 24 hours
    And the verification link should be unique and one-time use


  Scenario: User verifies email and activates account
    Given I have received a verification email with token "valid_token_123"
    When I click the verification link in the email
    Then the system should validate the token
    And the token should not be expired
    And the token should not have been used before
    And my email should be marked as verified
    And my account status should be changed to "active"
    And I should be redirected to the login page
    And I should see the message "Email verified successfully!"



## Scenario 2: Signup Validation Errors

  Scenario: User attempts signup with invalid email format
    Given I am on the signup page
    When I enter email "invalid-email"
    And I enter password "SecurePass123"
    And I confirm password "SecurePass123"
    And I click the "Sign Up" button
    Then the system should display an error message
    And the error should state "Please enter a valid email address"
    And the account should NOT be created


  Scenario: User attempts signup with password less than 8 characters
    Given I am on the signup page
    When I enter email "john.doe@example.com"
    And I enter password "Pass12"
    And I confirm password "Pass12"
    And I click the "Sign Up" button
    Then the system should display an error message
    And the error should state "Password must be at least 8 characters"
    And the account should NOT be created


  Scenario: User attempts signup with password without uppercase letter
    Given I am on the signup page
    When I enter email "john.doe@example.com"
    And I enter password "securepass123"
    And I confirm password "securepass123"
    And I click the "Sign Up" button
    Then the system should display an error message
    And the error should state "Password must contain at least one uppercase letter"
    And the account should NOT be created


  Scenario: User attempts signup with password without number
    Given I am on the signup page
    When I enter email "john.doe@example.com"
    And I enter password "SecurePass"
    And I confirm password "SecurePass"
    And I click the "Sign Up" button
    Then the system should display an error message
    And the error should state "Password must contain at least one number"
    And the account should NOT be created


  Scenario: User attempts signup with already registered email
    Given a user exists with email "existing@example.com"
    And I am on the signup page
    When I enter email "existing@example.com"
    And I enter password "SecurePass123"
    And I confirm password "SecurePass123"
    And I click the "Sign Up" button
    Then the system should display an error message
    And the error should state "Email already registered"
    And I should be offered a link to login
    And I should be offered a link to reset password


  Scenario: User attempts signup with passwords that don't match
    Given I am on the signup page
    When I enter email "john.doe@example.com"
    And I enter password "SecurePass123"
    And I confirm password "SecurePass456"
    And I click the "Sign Up" button
    Then the system should display an error message
    And the error should state "Passwords do not match"
    And the account should NOT be created



## Scenario 3: User Login - Happy Path

  Scenario: User successfully logs in with valid credentials
    Given a verified user exists with:
      | email    | john.doe@example.com |
      | password | SecurePass123        |
    And I am on the login page
    When I enter email "john.doe@example.com"
    And I enter password "SecurePass123"
    And I click the "Login" button
    Then the system should validate the credentials
    And the user should be authenticated
    And JWT tokens should be generated
    And tokens should be stored in HTTP-only cookies
    And I should be redirected to the dashboard
    And I should see my tickets on the dashboard
    And the login activity should be recorded in audit log


  Scenario: User session persists with valid JWT token
    Given I am logged in as "john.doe@example.com"
    And I have a valid JWT access token stored in HTTP-only cookie
    When I navigate to protected pages
    Then the middleware should validate my JWT token
    And I should remain authenticated
    And I should access protected resources without re-login



## Scenario 4: User Login - Error Scenarios

  Scenario: User attempts login with invalid email format
    Given I am on the login page
    When I enter email "invalid-email"
    And I enter password "SecurePass123"
    And I click the "Login" button
    Then the system should display an error message
    And the error should state "Please enter a valid email address"
    And the user should NOT be authenticated


  Scenario: User attempts login with non-existent email
    Given I am on the login page
    When I enter email "nonexistent@example.com"
    And I enter password "SecurePass123"
    And I click the "Login" button
    Then the system should display an error message
    And the error should state "Invalid email or password"
    And the user should NOT be authenticated


  Scenario: User attempts login with incorrect password
    Given a verified user exists with:
      | email    | john.doe@example.com |
      | password | SecurePass123        |
    And I am on the login page
    When I enter email "john.doe@example.com"
    And I enter password "WrongPassword123"
    And I click the "Login" button
    Then the system should display an error message
    And the error should state "Invalid email or password"
    And the system should increment the failed attempt counter
    And the user should NOT be authenticated


  Scenario: User cannot login with unverified email
    Given a user exists with email "unverified@example.com" and status "pending_verification"
    And I am on the login page
    When I enter email "unverified@example.com"
    And I enter password "SecurePass123"
    And I click the "Login" button
    Then the system should display an error message
    And the error should state "Please verify your email before logging in"
    And I should be offered option to resend verification email
    And the user should NOT be authenticated


  Scenario: User cannot login with deactivated account
    Given a user exists with email "deactivated@example.com" and status "inactive"
    And I am on the login page
    When I enter email "deactivated@example.com"
    And I enter password "SecurePass123"
    And I click the "Login" button
    Then the system should display an error message
    And the error should state "Your account has been deactivated. Contact support."
    And the user should NOT be authenticated



## Scenario 5: Account Lockout - Failed Login Protection

  Scenario: Account locks after 5 failed login attempts
    Given a verified user exists with:
      | email    | john.doe@example.com |
      | password | SecurePass123        |
    And I am on the login page
    When I attempt login with wrong password "WrongPass1" - attempt 1
    And I attempt login with wrong password "WrongPass2" - attempt 2
    And I attempt login with wrong password "WrongPass3" - attempt 3
    And I attempt login with wrong password "WrongPass4" - attempt 4
    And I attempt login with wrong password "WrongPass5" - attempt 5
    Then the account should be locked
    And the lock should last for 15 minutes
    And a security email should be sent to "john.doe@example.com"
    And I should see the error message "Account locked due to too many login attempts"
    And I should see a message "Try again in 15 minutes"
    And the security email should contain an unlock link


  Scenario: CAPTCHA appears after 3 failed login attempts
    Given a verified user exists with:
      | email    | john.doe@example.com |
      | password | SecurePass123        |
    And I am on the login page
    When I attempt login with wrong password "WrongPass1" - attempt 1
    And I attempt login with wrong password "WrongPass2" - attempt 2
    And I attempt login with wrong password "WrongPass3" - attempt 3
    Then a CAPTCHA challenge should appear
    And I should not be able to proceed without completing CAPTCHA
    And the CAPTCHA should prevent automated attacks


  Scenario: Warning message appears on 4th failed attempt
    Given a verified user exists with:
      | email    | john.doe@example.com |
      | password | SecurePass123        |
    And I have failed login 3 times
    And the CAPTCHA is displayed
    And I complete the CAPTCHA successfully
    When I attempt login with wrong password "WrongPass4" - attempt 4
    Then I should see a warning message
    And the message should state "1 more attempt before account lockout"
    And the system should allow one more attempt


  Scenario: Account auto-unlocks after 15 minutes
    Given my account is locked due to 5 failed attempts
    And the lock time was 15 minutes ago
    When I attempt to login again
    Then the account should be automatically unlocked
    And the failed attempt counter should be reset to 0
    And I should be able to login with correct password
    Then I should be authenticated successfully


  Scenario: User unlocks account via email link
    Given my account is locked due to 5 failed attempts
    And I received a security email with unlock link
    When I click the unlock link in the email
    Then the system should validate the unlock token
    And the token should not be expired
    And my account should be immediately unlocked
    And the failed attempt counter should be reset to 0



## Scenario 6: Password Reset - Forgot Password Flow

  Scenario: User requests password reset with valid email
    Given I am on the login page
    When I click the "Forgot Password?" link
    Then I should be taken to the password reset page
    And I should see a form requesting my email


  Scenario: User receives password reset email
    Given I am on the password reset page
    When I enter email "john.doe@example.com"
    And I click the "Send Reset Email" button
    Then the system should validate the email exists
    And a password reset email should be sent
    And I should see the message "Check your email for reset instructions"
    And the reset email should contain a unique reset link
    And the reset link should be valid for 1 hour only


  Scenario: User resets password with valid reset link
    Given I have received a password reset email with valid token "reset_token_xyz"
    When I click the reset link in the email
    Then I should be taken to the password reset form
    And the form should have fields for new password and confirm password


  Scenario: User successfully updates password
    Given I am on the password reset page with valid reset token
    When I enter new password "NewSecurePass789"
    And I confirm new password "NewSecurePass789"
    And I click the "Reset Password" button
    Then the system should validate the passwords match
    And the system should validate password meets requirements
    And the system should check new password is different from old password
    And the password should be updated in the database
    And all existing JWT tokens should be invalidated
    And a confirmation email should be sent
    And I should be redirected to login page
    And I should see the message "Password reset successful!"


  Scenario: User cannot use expired password reset link
    Given a password reset email was sent 2 hours ago
    And the reset link is now expired (1 hour validity)
    When I click the expired reset link
    Then the system should display an error message
    And the error should state "Password reset link expired"
    And I should be offered option to request a new reset link
    And the password should NOT be updated


  Scenario: Password reset link can only be used once
    Given I have a valid password reset token
    When I use the reset link to successfully change password
    And I try to use the same reset link again
    Then the system should display an error message
    And the error should state "This link has already been used"
    And the second password change should be rejected


  Scenario: User cannot reset password with weak new password
    Given I am on the password reset page with valid reset token
    When I enter new password "weak12"
    And I confirm new password "weak12"
    And I click the "Reset Password" button
    Then the system should display an error message
    And the error should state "Password must be at least 8 characters"
    And the password should NOT be updated


  Scenario: Generic message on non-existent email (security)
    Given I am on the password reset page
    When I enter email "nonexistent@example.com"
    And I click the "Send Reset Email" button
    Then I should see the generic message "Check your email for reset instructions"
    And no email should actually be sent
    And the system should NOT reveal whether email exists



## Scenario 7: Session Management - Persistence and Refresh

  Scenario: JWT token is stored in HTTP-only cookie
    Given I have successfully logged in
    When the system generates JWT tokens
    Then the access token should be stored in HTTP-only cookie
    And the refresh token should be stored in HTTP-only cookie
    And the HttpOnly flag should be set to true
    And the Secure flag should be set to true
    And the SameSite attribute should be "Strict"
    And the tokens should NOT be stored in localStorage
    And the tokens should NOT be stored in sessionStorage


  Scenario: Session persists across page refresh
    Given I am logged in with valid JWT tokens
    And I am viewing my tickets page
    When I refresh the page (F5 or manual refresh)
    Then the middleware should validate my JWT token
    And the token should be valid
    And I should remain authenticated
    And I should see the same page content
    And I should not be redirected to login


  Scenario: Access token auto-refreshes before expiration
    Given I am logged in and actively using the app
    And my access token is valid but expiring in 5 minutes
    When the system detects the expiration threshold
    Then a silent refresh request should be made
    And the backend should validate my refresh token
    And new access token should be generated
    And tokens should be updated in cookies
    And I should continue working without interruption
    And I should be unaware the token was refreshed


  Scenario: Session ends when both tokens expire
    Given I am logged in
    And my access token has expired
    And my refresh token has also expired (> 7 days)
    When I attempt any action
    Then the system should detect both tokens are invalid
    And I should be redirected to login page
    And I should see the message "Your session has expired. Please login again."
    And all tokens should be cleared


  Scenario: Token refresh fails due to expired refresh token
    Given my access token has expired
    And my refresh token has also expired
    When the system attempts to refresh the access token
    Then the refresh should fail
    And the system should detect invalid refresh token
    And the user session should be terminated
    And I should be redirected to login page



## Scenario 8: Logout and Session Termination

  Scenario: User successfully logs out
    Given I am logged in as "john.doe@example.com"
    And I am viewing my dashboard
    When I click the "Logout" button
    Then a confirmation dialog should appear
    And the message should state "Are you sure you want to logout?"


  Scenario: Logout clears all tokens
    Given I am logged in and have clicked "Logout"
    When I confirm the logout action
    Then the JWT access token should be cleared from cookies
    And the JWT refresh token should be cleared from cookies
    And the logout event should be recorded in audit log
    And I should be redirected to the login page
    And I should see the message "You have been logged out"


  Scenario: Automatic logout after session timeout
    Given I am logged in
    And I have been inactive for 15 minutes (no page navigation, no mouse/keyboard activity)
    When the inactivity timeout is triggered
    Then a warning dialog should appear
    And the message should state "Your session is about to expire due to inactivity"
    And I should have 2 minutes to extend the session
    And there should be options: "Stay Logged In" or "Logout"


  Scenario: User extends session before timeout
    Given I see the inactivity timeout warning dialog
    When I click the "Stay Logged In" button
    Then the session should continue
    And the inactivity timer should be reset
    And I should remain authenticated
    And the warning dialog should close


  Scenario: Automatic session logout after timeout
    Given I see the inactivity timeout warning dialog
    And I do not interact for 2 minutes
    When the timeout period expires
    Then the system should automatically logout
    And all tokens should be cleared
    And I should be redirected to the login page
    And I should see the message "Session expired due to inactivity"



## Scenario 9: Multi-Device Session Management

  Scenario: User maintains sessions on multiple devices simultaneously
    Given I log in on Desktop with email "john.doe@example.com"
    And I receive JWT tokens on Desktop
    And later I log in on Mobile with the same email "john.doe@example.com"
    And I receive JWT tokens on Mobile
    Then both sessions should be active simultaneously
    And each device should have independent JWT tokens
    And a device session record should be created for each device
    And I should be able to use both devices concurrently


  Scenario: User views active sessions
    Given I am logged in on Desktop and Mobile
    And I navigate to Account Settings
    When I click on "Active Sessions" or "Security"
    Then I should see a list of all active sessions including:
      | Device Type | Last Active | IP Address    | Device Name |
      | Web         | Now         | 192.168.1.100 | Chrome      |
      | Mobile      | 5 min ago   | 192.168.1.101 | iPhone App  |


  Scenario: User logs out from specific device
    Given I have active sessions on Desktop and Mobile
    And I am viewing the Active Sessions list
    When I click "Logout" button next to the Mobile session
    Then the Mobile session should be terminated
    And the Mobile JWT tokens should be invalidated
    And the Mobile user should be logged out
    And the Desktop session should continue without interruption


  Scenario: User logs out from all other devices
    Given I have active sessions on Desktop, Mobile, and Tablet
    And I navigate to Account Settings → Security
    When I click "Logout from all other devices"
    Then a confirmation dialog should appear
    And the message should state "This will log you out from all other devices"


  Scenario: Logout all other devices executed
    Given I confirmed "Logout from all other devices"
    When the action is executed
    Then all JWT tokens for other devices should be invalidated
    And Mobile user should be logged out
    And Tablet user should be logged out
    And Desktop session (current) should continue
    And logout notifications should be sent to other devices
    And activity log should record the logout action


  Scenario: Maximum concurrent sessions per user
    Given the system limits to 5 concurrent sessions per user
    And I already have 5 active sessions
    When I attempt to login from a 6th device
    Then the system should reject the 6th login
    And I should see a message "Maximum concurrent sessions reached"


## Scenario 10: Email Verification Methods

  Scenario: Email verification with link method
    Given I have signed up and received a verification email
    When I click the verification link in the email
    Then the link should contain a unique verification token
    And the token should be valid for 24 hours
    And the token should be one-time use only
    And the system should mark my email as verified
    And my account status should change to "active"


  Scenario: Email verification with code method
    Given I have signed up and received a verification email
    And the email contains a 6-digit verification code
    When I return to the app verification page
    And I enter the 6-digit code "123456"
    And I click "Verify"
    Then the system should validate the code
    And the code should be valid for 10 minutes
    And the code should be one-time use only
    And my email should be marked as verified
    And my account status should change to "active"


  Scenario: Verification code invalid after 3 attempts
    Given a verification code is sent to my email
    When I attempt to enter the code incorrectly 3 times:
      | Attempt | Code Entered |
      | 1       | 111111       |
      | 2       | 222222       |
      | 3       | 333333       |
    Then the system should lock the code entry
    And I should see the message "Invalid code. Request a new code."
    And I should be offered to resend verification code


  Scenario: User resends verification email
    Given I have not yet verified my email
    And verification link has expired (> 24 hours)
    When I click "Resend verification email"
    Then a new verification email should be sent
    And I should see the message "Verification email sent. Check your inbox"
    And the new link/code should be valid for another 24 hours/10 minutes


  Scenario: Rate limiting on verification email resends
    Given I have not verified my email
    When I attempt to resend verification email 6 times within 1 hour:
      | Attempt | Time       |
      | 1       | 00:00      |
      | 2       | 00:05      |
      | 3       | 00:10      |
      | 4       | 00:15      |
      | 5       | 00:20      |
      | 6       | 00:25      |
    Then the 6th request should be rejected
    And I should see the message "Too many requests. Try again later."
    And the rate limit should reset after 1 hour



## Scenario 11: Cross-Platform Authentication (Web and Mobile)

  Scenario: User logs in on web and switches to mobile
    Given I have Tikkit web account with email "john.doe@example.com"
    And I have Tikkit mobile app (Flutter) installed
    When I open the mobile app
    And I navigate to login screen
    And I enter email "john.doe@example.com"
    And I enter password "SecurePass123"
    And I click "Login"
    Then the mobile app should send credentials to Supabase
    And Supabase should validate credentials
    And the mobile app should receive JWT tokens
    Then the tokens should be stored securely in Keychain (iOS) or Keystore (Android)
    And I should be logged in on mobile
    And I should see my tickets on mobile dashboard


  Scenario: Same credentials work across web and mobile platforms
    Given I am logged in on web with email "john.doe@example.com"
    And I log out from web
    When I open mobile app
    And I login with same email "john.doe@example.com"
    And same password "SecurePass123"
    Then I should be successfully authenticated on mobile
    And the mobile and web platforms should share the same account
    And my tickets should be identical on both platforms


  Scenario: Deep linking works for email verification on mobile
    Given I received verification email on mobile device
    And the email contains a deep link "tikkit://verify-email?token=xyz123"
    When I click the deep link
    Then the mobile app should open automatically
    And the verification flow should be triggered
    And the system should verify my email
    And I should be redirected to the dashboard


  Scenario: Deep linking works for password reset on mobile
    Given I requested password reset and received email
    And the email contains a deep link "tikkit://reset-password?token=xyz123"
    When I click the deep link
    Then the mobile app should open
    And the password reset screen should appear
    And I should be able to enter new password
    And after successful reset, I should be redirected to login


  Scenario: Mobile app stores tokens securely
    Given I have logged in on mobile app
    And JWT tokens have been generated
    When I check where tokens are stored
    Then on iOS: tokens should be in Keychain (encrypted)
    And on Android: tokens should be in EncryptedSharedPreferences
    And tokens should NOT be in app cache
    And tokens should NOT be in plain SharedPreferences
    And tokens should NOT be in application logs


  Scenario: Biometric authentication setup on mobile (Post-MVP)
    Given I have successfully logged in on mobile with email/password
    When the system displays "Setup Face ID/Touch ID?"
    And I click "Enable"
    Then the system should request biometric permission
    And the user should complete biometric scan (Face ID or Touch ID)
    And biometric authentication should be enabled
    And a cryptographic key pair should be created and stored securely



## Scenario 12: Password Strength Validation

  Scenario: Real-time password strength feedback during signup
    Given I am on the signup page
    When I start typing in the password field "S"
    Then the system should immediately validate
    And display a password strength indicator
    And show unmet requirements in real-time


  Scenario: Password requirements checklist
    Given I am on password entry form
    When I type password character by character
    Then the system should display a requirements checklist:
      | Requirement                              | Status |
      | At least 8 characters                    | ✗      |
      | At least 1 uppercase letter (A-Z)        | ✗      |
      | At least 1 lowercase letter (a-z)        | ✗      |
      | At least 1 number (0-9)                  | ✗      |


  Scenario: Password strength meter updates as user types
    Given I am typing password "S"
    Then strength should be shown as "0% - Invalid"

    Given I have typed "SecureP"
    Then strength should be shown as "25% - Weak"

    Given I have typed "SecurePass1"
    Then strength should be shown as "75% - Good"

    Given I have typed "SecurePass123XYZ"
    Then strength should be shown as "100% - Strong"


  Scenario: Common passwords are rejected
    Given I am on the password entry form
    When I try to enter password "Password123"
    Then the system should detect it's a common password
    And should display warning "This password is too common"
    And should suggest entering a different password
    And the password field should show an error state


  Scenario: Password similar to email is warned but allowed
    Given my email is "john.doe@example.com"
    When I try to enter password "johndoe123ABC"
    Then the system should detect similarity to email username
    And should show warning "Password should not be similar to your email"
    And should provide option to override
    And should allow password if user confirms


  Scenario: Show/hide password toggle
    Given I am typing password in the password field
    And the password is hidden with dots/asterisks
    When I click the eye icon to show password
    Then the password should be displayed as plain text
    And the eye icon should change appearance
    When I click the eye icon again
    Then the password should be hidden again



## Scenario 13: Audit Logging and Security Monitoring

  Scenario: Signup event is logged
    Given a new user signs up successfully
    When the signup is completed
    Then an activity log entry should be created with:
      | Field      | Value                |
      | user_id    | [new_user_id]        |
      | action     | signup               |
      | ip_address | [user_ip]            |
      | user_agent | [browser_info]       |
      | status     | success              |
      | timestamp  | [current_timestamp]  |


  Scenario: Failed login attempts are logged
    Given a verified user exists
    When I attempt login with wrong password
    Then an activity log entry should be created with:
      | Field      | Value                     |
      | user_id    | [user_id]                 |
      | action     | login                     |
      | ip_address | [user_ip]                 |
      | user_agent | [browser_info]            |
      | status     | failed                    |
      | reason     | Invalid credentials       |
      | timestamp  | [current_timestamp]       |


  Scenario: Successful login is logged
    Given a verified user with correct credentials
    When I successfully log in
    Then an activity log entry should be created with:
      | Field      | Value                     |
      | user_id    | [user_id]                 |
      | action     | login                     |
      | ip_address | [user_ip]                 |
      | user_agent | [browser_info]            |
      | status     | success                   |
      | timestamp  | [current_timestamp]       |


  Scenario: Password change is logged
    Given I successfully reset my password
    When the password change is completed
    Then an activity log entry should be created with:
      | Field      | Value                     |
      | user_id    | [user_id]                 |
      | action     | password_reset            |
      | ip_address | [user_ip]                 |
      | user_agent | [browser_info]            |
      | status     | success                   |
      | timestamp  | [current_timestamp]       |


  Scenario: Account lockout is logged
    Given account is locked after 5 failed attempts
    When the lockout is triggered
    Then an activity log entry should be created with:
      | Field      | Value                     |
      | user_id    | [user_id]                 |
      | action     | account_locked            |
      | ip_address | [user_ip]                 |
      | user_agent | [browser_info]            |
      | status     | success                   |
      | reason     | Too many failed attempts  |
      | timestamp  | [current_timestamp]       |


  Scenario: Admin can view activity audit log
    Given I am logged in as an admin
    When I navigate to Settings → Audit Log
    Then I should see a list of all authentication activities
    And I should be able to filter by:
      | Filter Option  |
      | User           |
      | Action         |
      | Date Range     |
      | Status         |
      | IP Address     |



## Scenario 14: Security - Token Management

  Scenario: Token refresh without user interruption
    Given I am logged in and actively using the app
    And my access token expires in 5 minutes
    When the system detects token is near expiration
    Then a silent refresh request should be made to backend
    And backend should validate refresh token
    And new access token should be generated
    And tokens should be updated in HTTP-only cookies
    And I should continue using app without interruption
    And I should be unaware of the token refresh


  Scenario: Token refresh fails due to invalid refresh token
    Given my refresh token is invalid or tampered
    When system attempts to refresh the access token
    Then the refresh should fail
    And the system should detect the invalid token
    And all tokens should be cleared
    And I should be redirected to login page
    And I should see security warning


  Scenario: Maximum refresh attempts exceeded
    Given a user is attempting multiple token refreshes rapidly
    When the system detects excessive refresh attempts
    Then the system should block further refresh requests
    And the session should be terminated
    And all tokens should be invalidated
    And I should be redirected to login page



## Scenario 15: Security - Rate Limiting on Auth Endpoints

  Scenario: Signup endpoint has rate limiting
    Given rate limit is set to 5 signups per hour per IP
    When I attempt to create 6 accounts from same IP within 1 hour
    Then the 6th signup attempt should be rejected
    And I should receive HTTP 429 response
    And I should see message "Too many requests. Please try again later."
    And the rate limit should reset after 1 hour


  Scenario: Login endpoint has rate limiting
    Given rate limit is set to 10 logins per hour per IP
    When I attempt 11 login requests from same IP within 1 hour
    Then the 11th login request should be rejected
    And I should receive HTTP 429 response
    And I should see message "Too many requests. Please try again later."


  Scenario: Password reset endpoint has rate limiting
    Given rate limit is set to 3 password resets per hour per email
    When I attempt to reset password 4 times within 1 hour
    Then the 4th reset request should be rejected
    And I should see message "Too many password reset requests. Try again later."
    And I should be offered to unlock account via email



## Scenario 16: Admin User Management

  Scenario: Admin can deactivate user account
    Given I am logged in as admin
    When I navigate to User Management → Users
    And I find user "john.doe@example.com"
    And I click "Deactivate" button
    Then a confirmation dialog should appear
    And the message should state "This user will not be able to login"


  Scenario: User deactivation executed
    Given I have confirmed to deactivate user "john.doe@example.com"
    When the deactivation is executed
    Then the user's status should change to "inactive"
    And all active JWT tokens should be invalidated
    And a notification email should be sent to the user
    And the deactivation event should be logged in audit trail


  Scenario: Deactivated user cannot login
    Given user "john.doe@example.com" is deactivated
    And I am on the login page
    When I enter email "john.doe@example.com"
    And I enter the correct password
    And I click "Login"
    Then the system should reject the login
    And I should see message "Your account has been deactivated. Contact support."
    And the user should NOT be authenticated


  Scenario: Admin can reactivate user
    Given user "john.doe@example.com" is deactivated
    And I am logged in as admin
    When I navigate to User Management
    And I find the deactivated user
    And I click "Reactivate" button
    Then a confirmation dialog should appear
    And the user's status should change to "active"
    And a notification email should be sent to the user
    And the user can now login normally


  Scenario: Admin can force logout user
    Given user "john.doe@example.com" is currently logged in
    And I am logged in as admin
    When I navigate to User Management → Active Sessions
    And I find user "john.doe@example.com"
    And I click "Force Logout"
    Then a confirmation dialog should appear
    And all JWT tokens for that user should be invalidated
    And the user should be logged out immediately
    And the user will see "Your session has been terminated by admin"
    And a notification email should be sent to the user


  Scenario: Admin can reset user password
    Given user "john.doe@example.com" exists
    And I am logged in as admin
    When I navigate to User Management
    And I click "Reset Password" for this user
    Then a password reset email should be sent to the user
    And the reset link should be valid for 1 hour
    And the user should be able to set a new password via link
    And the reset action should be logged in audit trail


