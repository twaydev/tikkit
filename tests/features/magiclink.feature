Feature: Magic Link Authentication (Passwordless Login)
  As a user
  I want to log in using a magic link sent to my email
  So that I don't need to remember a password

  Background:
    Given the application is running
    And the Supabase authentication service is available
    And the email service is configured and operational
    And magic link authentication is enabled



## Scenario 1: User Requests Magic Link

  Scenario: User requests magic link on login page
    Given I am on the login page
    When I click the "Login with Magic Link" button
    Then I should be taken to the magic link request page
    And I should see a form requesting my email address
    And the form should have a text input field for email
    And the form should have a "Send Magic Link" button


  Scenario: User enters email to receive magic link
    Given I am on the magic link request page
    When I enter email "john.doe@example.com"
    And I click the "Send Magic Link" button
    Then the system should validate the email format
    And a magic link email should be sent to "john.doe@example.com"
    And I should see the message "Check your email for your magic link"
    And the message should state "The link will expire in 1 hour"
    And I should remain on the login page




## Scenario 2: Magic Link Email Delivery

  Scenario: Magic link email is sent with valid link
    Given a user exists with email "john.doe@example.com"
    When the user requests a magic link
    Then a magic link email should be sent to "john.doe@example.com"
    And the email should contain a unique magic link
    And the magic link should be valid for 1 hour
    And the magic link should be one-time use only
    And the link should include a unique OTP token
    And the email subject should be "Your Magic Link for Tikkit"
    And the email should have a clear call-to-action button


  Scenario: Magic link email template formatting
    Given a magic link email is being sent
    Then the email should include:
      | Content                        |
      | Welcome message                |
      | Magic link button              |
      | Fallback text link             |
      | Expiration time (1 hour)       |
      | Security notice                |
      | Support contact information    |
    And the email should have professional branding
    And the email should be mobile-responsive


  Scenario: Magic link includes device information
    Given a user requests magic link from Chrome on Desktop
    When the magic link email is sent
    Then the email should display "Chrome on Desktop"
    And the user should recognize their device


  Scenario: Multiple magic links for same user
    Given a user exists with email "john.doe@example.com"
    When the user requests first magic link
    And the user requests second magic link within 5 minutes
    Then the first magic link should be invalidated
    And the second magic link should be valid
    And only the newest link should work




## Scenario 3: Magic Link Validation and Login

  Scenario: User successfully logs in with valid magic link
    Given I have received a magic link email with token "magic_token_123"
    And the link is valid (not expired, not used)
    When I click the magic link in the email
    Then the link should be validated
    And the system should verify the token hasn't expired
    And the system should verify the link hasn't been used
    And the user should be authenticated
    And JWT tokens should be generated
    And I should be redirected to the dashboard
    And I should see the message "You have been logged in successfully"
    And the magic link should be marked as used


  Scenario: JWT tokens generated from magic link
    Given I have successfully logged in via magic link
    When the authentication is completed
    Then an access token should be generated (1 hour validity)
    And a refresh token should be generated (7 day validity)
    And tokens should be stored in HTTP-only cookies
    And the HttpOnly flag should be set to true
    And the Secure flag should be set to true




## Scenario 4: Magic Link - Error Scenarios

  Scenario: User cannot use expired magic link
    Given a magic link was sent 2 hours ago
    And the link is now expired (1 hour validity)
    When I click the expired magic link
    Then the system should detect the link is expired
    And I should see an error message "This magic link has expired"
    And I should be offered option to request a new link
    And the user should NOT be authenticated


  Scenario: User cannot reuse magic link
    Given I have successfully used a magic link to login
    When I try to use the same magic link again
    Then the system should detect the link has been used
    And I should see an error message "This magic link has already been used"
    And I should be offered option to request a new link
    And the user should NOT be authenticated


  Scenario: Invalid magic link format
    Given I attempt to access a magic link with invalid token "invalid_123"
    When I click the magic link
    Then the system should detect the invalid token
    And I should see an error message "This magic link is invalid"
    And I should be offered option to request a new link


  Scenario: Magic link for non-existent email
    Given I request a magic link for email "nonexistent@example.com"
    When the system processes the request
    Then the system should NOT send an email
    And I should see the generic message "Check your email for your magic link"
    And no indication should be given that email doesn't exist (security)


  Scenario: User cannot login without clicking link first
    Given I have received a magic link email
    And I have not clicked the link yet
    When I try to access the dashboard directly
    Then I should be redirected to the login page
    And I should see the message "Please log in first"




## Scenario 5: Magic Link - Account Creation

  Scenario: New user signs up with magic link
    Given I am a new user without an account
    When I request a magic link for email "newuser@example.com"
    Then the system should:
      | Action                              |
      | Create account if email doesn't exist |
      | Set account status to "pending"     |
      | Send verification magic link       |
      | Mark email as verified on click    |


  Scenario: Magic link automatically creates account for new email
    Given I request magic link for email "newuser@example.com"
    And no account exists with this email
    When I click the magic link
    Then a new user account should be created
    And the account should be marked as verified
    And the account status should be "active"
    And I should be logged in to the new account
    And a welcome email should be sent


  Scenario: Existing user can use magic link
    Given a user account exists with email "existing@example.com"
    And the account is verified and active
    When the user requests a magic link
    And clicks the link
    Then the user should be logged in
    And no new account should be created




## Scenario 6: Magic Link - Security & Rate Limiting

  Scenario: Rate limiting on magic link requests
    Given rate limit is 5 magic link requests per hour per IP
    When I attempt to request magic link 6 times within 1 hour:
      | Attempt | Time   |
      | 1       | 00:00  |
      | 2       | 00:10  |
      | 3       | 00:20  |
      | 4       | 00:30  |
      | 5       | 00:40  |
      | 6       | 00:50  |
    Then the 6th request should be rejected
    And I should see message "Too many requests. Try again later."
    And the rate limit should reset after 1 hour


  Scenario: Rate limiting on magic link requests per email
    Given rate limit is 3 magic link requests per email per hour
    When a user requests magic link 4 times for same email within 1 hour
    Then the 4th request should be rejected
    And the message should state "Please wait before requesting another link"


  Scenario: Brute force protection on magic links
    Given an attacker attempts to use random magic link tokens
    When the attacker tries 10 invalid tokens
    Then the system should detect brute force attack
    And subsequent requests should be blocked temporarily
    And the account should trigger security alert (if valid email)


  Scenario: Magic link security audit logging
    Given a user successfully logs in via magic link
    When the login is completed
    Then an audit log entry should be created with:
      | Field      | Value            |
      | action     | magic_link_login |
      | email      | user's email     |
      | ip_address | user's IP        |
      | status     | success          |
      | timestamp  | current time     |


  Scenario: Suspicious magic link usage detected
    Given a user receives magic link in email
    When the link is clicked from different IP than expected
    Then the system should:
      | Security Measure              |
      | Log the IP mismatch           |
      | Still allow login             |
      | Send user a security email    |
      | Include IP and location info  |
      | Offer to reset account access |




## Scenario 7: Magic Link - Cross-Platform Support

  Scenario: Magic link works on web platform
    Given I receive magic link email on desktop
    When I click the link on my desktop browser
    Then the link should open in the web app
    And I should be logged in
    And I should see the dashboard


  Scenario: Magic link works on mobile platforms
    Given I receive magic link email on mobile device
    When I click the link on mobile
    Then the link should open the mobile app (if installed)
    And the link should redirect to web version on mobile if app is not installed
    And I should be logged in


  Scenario: Deep linking for magic link on mobile
    Given I receive magic link email on iOS device
    And the Tikkit iOS app is installed
    When I click the magic link
    Then the link should use deep linking: "tikkit://login?token=xyz"
    And the iOS app should open automatically
    And the app should complete authentication
    And I should be logged in


  Scenario: Deep linking for magic link on Android
    Given I receive magic link email on Android device
    And the Tikkit Android app is installed
    When I click the magic link
    Then the link should use deep linking: "tikkit://login?token=abc"
    And the Android app should open automatically
    And the app should complete authentication
    And I should be logged in


  Scenario: Magic link fallback to web on mobile
    Given I receive magic link email on mobile
    And I don't have the mobile app installed
    When I click the magic link
    Then the browser should open
    And the website should load with mobile optimization
    And I should be able to login via web
    And the experience should be seamless




## Scenario 8: Magic Link - Comparison with Password Login

  Scenario: Magic link vs password login flow comparison
    Given two users with same email on account
    When User A logs in with magic link
    And User B logs in with password
    Then both should reach dashboard
    But User A didn't enter password
    And User B had to remember password


  Scenario: User can switch between authentication methods
    Given a user normally uses password login
    When the user selects "Login with Magic Link" option
    Then the user should be sent a magic link
    And the user can login without password


  Scenario: Magic link is disabled if user has 2FA enabled
    Given a user has two-factor authentication enabled
    When the user requests magic link
    Then the magic link should be sent
    But after clicking link, user should be prompted for 2FA code
    And 2FA verification should complete the login




## Scenario 9: Magic Link - User Experience

  Scenario: Clear instructions for magic link process
    Given I am on the magic link request page
    Then I should see clear instructions:
      | Instruction                              |
      | "Enter your email address"               |
      | "Click Send Magic Link"                  |
      | "Check your inbox for the link"          |
      | "Click the link to login"                |
      | "Link expires in 1 hour"                 |


  Scenario: Loading state while processing magic link
    Given I have clicked the magic link
    When the system is validating the token
    Then a loading spinner should appear
    And the message should state "Logging you in..."
    And the browser tab title should update


  Scenario: Success confirmation after magic link login
    Given I have successfully logged in via magic link
    When the redirect to dashboard completes
    Then I should see a welcome message
    And the message should state "Welcome back [First Name]"
    And a subtle notification should confirm successful login




## Scenario 10: Magic Link - Account Linking

  Scenario: Magic link creates account if user doesn't exist
    Given I request magic link for new email "newuser@example.com"
    When I click the magic link
    Then the system should create account automatically
    And the account should be marked as verified
    And the user should be considered "trusted" for security


  Scenario: Existing users receive same magic link experience
    Given I already have account with email "existing@example.com"
    When I request magic link
    And I click the magic link
    Then I should be logged in to existing account
    And my existing data should be preserved
    And I should not create duplicate account


  Scenario: Email change via magic link
    Given my account uses email "old@example.com"
    When I want to update email to "new@example.com"
    And I request magic link for new email
    Then a verification email should be sent to "new@example.com"
    And I should click link to verify new email
    And my account email should be updated after verification




## Scenario 11: Magic Link - Admin Features

  Scenario: Admin can send magic link to user
    Given I am logged in as admin
    When I navigate to User Management
    And I click "Send Login Link" for a user
    Then a magic link should be generated
    And the link should be sent to user's email
    And the admin should see confirmation


  Scenario: Admin can revoke magic links
    Given magic links exist for user "john@example.com"
    When I am logged in as admin
    And I click "Revoke Magic Links" for this user
    Then all existing magic links should be invalidated
    And user must request new link to login


  Scenario: Admin views magic link audit log
    Given I am logged in as admin
    When I navigate to Audit Log
    And I filter by "magic_link_login"
    Then I should see all magic link login events
    And each entry should show:
      | Field     |
      | user      |
      | timestamp |
      | IP address|
      | device    |
      | status    |




## Scenario 12: Magic Link - Error Handling

  Scenario: Network error during magic link request
    Given I am on magic link request page
    When I enter email and click "Send Magic Link"
    But the network connection fails
    Then I should see error message "Failed to send link. Please try again."
    And a "Retry" button should appear
    And I should be able to retry the request


  Scenario: Email service failure
    Given the email service is temporarily unavailable
    When a user requests magic link
    Then the system should show error "Unable to send email right now"
    And I should be offered to try again later
    And no magic link should be created


  Scenario: Database error creating magic link
    Given the database is experiencing issues
    When user requests magic link
    Then system should show generic error "Unable to process request"
    And no magic link token should be created
    And user should be offered to retry


  Scenario: Invalid email format handling
    Given I am on magic link request page
    When I enter invalid email "invalid-email"
    And I click "Send Magic Link"
    Then the system should display validation error
    And the error should state "Please enter a valid email address"
    And the magic link should NOT be sent




## Scenario 13: Magic Link - Session Management

  Scenario: Magic link creates persistent session
    Given I have logged in via magic link
    When I refresh the browser page
    Then I should remain logged in
    And my session should persist
    And no re-authentication should be required


  Scenario: Magic link session timeout
    Given I am logged in via magic link
    When I remain inactive for 15 minutes
    Then a warning dialog should appear
    And the message should state "Your session is about to expire"
    And I should have 2 minutes to extend session


  Scenario: Multiple magic link logins from same user
    Given I login via magic link
    And I logout
    When I request another magic link and login
    Then the new session should be created
    And the old session should be terminated
    And I should have fresh JWT tokens




## Scenario 14: Magic Link - Preferences & Settings

  Scenario: User can enable magic link as default authentication
    Given I am logged in
    When I navigate to Account Settings
    And I select "Default Login Method"
    Then I should see option "Magic Link"
    When I select "Magic Link"
    Then the next time I login, magic link should be default option


  Scenario: User can disable magic link authentication
    Given I am logged in
    When I navigate to Security Settings
    And I see "Magic Link Authentication" toggle
    When I turn OFF the toggle
    Then magic link option should disappear from login page
    And only password login should be available


  Scenario: User receives magic link usage notifications
    Given I have enabled notifications
    When someone logs into my account with magic link
    Then I should receive email notification:
      | Content              |
      | Successful login     |
      | Time                 |
      | Device type          |
      | IP address           |
      | Location             |
      | "Not you?" link      |




## Scenario 15: Magic Link - Integration with Other Features

  Scenario: Magic link works with RBAC
    Given a user with "agent" role requests magic link
    When the user logs in via magic link
    Then the user should have "agent" role permissions
    And the user should be able to perform agent actions
    And admin actions should be restricted


  Scenario: Magic link respects user deactivation
    Given a user's account is deactivated
    When the deactivated user receives old magic link
    And clicks the link
    Then the system should detect account is inactive
    And show error "Your account has been deactivated"
    And the user should NOT be logged in


  Scenario: Magic link triggers 2FA if enabled
    Given a user has two-factor authentication enabled
    When the user logs in via magic link
    Then after link validation, 2FA prompt should appear
    And the user must enter 2FA code
    And only then should complete authentication


  Scenario: Magic link creates activity log entry
    Given I login via magic link
    When the login is successful
    Then an activity log entry should be created:
      | Field      | Value            |
      | action     | magic_link_login |
      | user       | my user ID       |
      | timestamp  | login time       |
      | ip_address | my IP            |
      | status     | success          |


