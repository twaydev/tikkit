Feature: Role-Based Access Control (RBAC)
  As an admin
  I want to assign roles to users
  So that users have appropriate permissions for their responsibilities

  Background:
    Given the application is running
    And the Supabase authentication service is available
    And the database is configured with role support
    And RLS (Row Level Security) policies are enforced
    And four roles exist in the system:
      | Role       | Permissions                                           |
      | admin      | Full system access, user management, configuration   |
      | supervisor | Team oversight, ticket reassignment, analytics       |
      | agent      | Create/update assigned tickets, respond, view team   |
      | audit      | Read-only access for compliance                      |



## Scenario 1: User Roles and Permissions

  Scenario: Admin role has full system access
    Given a user exists with role "admin"
    And the user is logged in
    When the user accesses the system
    Then the user should have access to:
      | Feature                        |
      | Dashboard                      |
      | Tickets (create, edit, delete) |
      | Users Management               |
      | System Settings                |
      | Reports & Analytics            |
      | Audit Logs                     |
      | Role Management                |
      | API Access                     |
    And the user can perform all actions


  Scenario: Supervisor role has team oversight
    Given a user exists with role "supervisor"
    And the user is logged in
    When the user accesses the system
    Then the user should have access to:
      | Feature                              |
      | Dashboard                            |
      | Team Tickets (view and reassign)     |
      | Team Members (view)                  |
      | Team Analytics                       |
      | Can reassign tickets between agents  |
      | Team Reports                         |
    And the user cannot access:
      | Restricted Feature      |
      | User Management         |
      | System Settings         |
      | Delete Operations       |
      | API Configuration       |


  Scenario: Agent role has limited permissions
    Given a user exists with role "agent"
    And the user is logged in
    When the user accesses the system
    Then the user should have access to:
      | Feature                                |
      | Dashboard (personal tickets)           |
      | Create new tickets                     |
      | Edit own tickets                       |
      | View assigned tickets                  |
      | Comment on tickets                     |
      | View team tickets (read-only)          |
      | Personal settings                      |
    And the user cannot access:
      | Restricted Feature              |
      | Ticket deletion                  |
      | User Management                  |
      | System Configuration             |
      | Analytics                        |
      | Team Assignment of other tickets |


  Scenario: Audit role has read-only access
    Given a user exists with role "audit"
    And the user is logged in
    When the user accesses the system
    Then the user should have access to:
      | Read-Only Feature     |
      | Audit Logs            |
      | Activity History      |
      | Reports               |
      | System Configuration  |
      | User List (read-only) |
    And the user cannot modify anything:
      | Cannot Do              |
      | Create items           |
      | Edit items             |
      | Delete items           |
      | Assign tickets         |
      | Modify system settings |




## Scenario 2: Role Assignment

  Scenario: Admin can assign role to user
    Given I am logged in as admin
    And a user "john.doe@example.com" exists
    When I navigate to User Management
    And I find the user "john.doe@example.com"
    And I click "Change Role"
    Then a role selection dropdown should appear
    And the dropdown should show available roles:
      | Available Roles |
      | Admin          |
      | Supervisor     |
      | Agent          |
      | Audit          |
    When I select role "supervisor"
    Then the user's role should be updated to "supervisor"
    And an audit log entry should be created
    And the user should receive notification email


  Scenario: Role change takes effect immediately
    Given a user is logged in with role "agent"
    When an admin changes user's role to "supervisor"
    Then the user's permissions should update immediately
    And on next user action, new permissions should be enforced
    And user should see dashboard reflects new role


  Scenario: User cannot self-assign admin role
    Given I am logged in as "agent"
    When I attempt to change my own role to "admin"
    Then the system should reject the change
    And I should see error message "You don't have permission to change roles"
    And my role should remain "agent"


  Scenario: Super-admin is required to change admin roles
    Given two admin users exist
    When admin user A attempts to change admin user B's role
    Then the system should check for super-admin status
    And if user A is not super-admin, the change should be rejected
    And only super-admin can modify other admin roles




## Scenario 3: Default Role Assignment

  Scenario: New user is assigned default agent role
    Given a new user signs up via email
    When the signup is completed
    Then the user's default role should be set to "agent"
    And the user should see agent-level dashboard
    And the user should have agent permissions


  Scenario: Admin can set new user default role
    Given I am logged in as admin
    When I navigate to System Settings
    And I click "Default User Role"
    Then I should see the current default role: "agent"
    When I change it to "supervisor"
    Then new signups should receive "supervisor" role by default


  Scenario: Bulk role assignment to multiple users
    Given I am logged in as admin
    When I select multiple users in User Management
    And I click "Assign Role"
    Then a bulk assignment dialog should appear
    When I select role "supervisor"
    And I click "Assign to Selected"
    Then all selected users' roles should be updated
    And each user should receive notification
    And bulk action should be logged in audit trail




## Scenario 4: Permission Enforcement at Database Level

  Scenario: RLS policies enforce role-based access at database
    Given a user with "agent" role exists
    When the agent attempts to query all users via API
    Then the database RLS policy should:
      | Policy Check                    |
      | Detect the "agent" role        |
      | Reject the query               |
      | Return empty result set        |
      | Log unauthorized access        |


  Scenario: Agent cannot view other agent's private data
    Given two agents: Agent A and Agent B
    And Agent A is logged in
    When Agent A attempts to view Agent B's personal settings
    Then the system should check RLS policies
    And the query should be blocked
    And Agent A should see error "Permission denied"


  Scenario: Supervisor can view team member tickets
    Given a supervisor with team members [Agent A, Agent B]
    When the supervisor queries tickets
    Then the RLS policy should:
      | Policy Action                        |
      | Check supervisor role               |
      | Return tickets from team members    |
      | Not return tickets from other teams |
      | Not return deleted tickets          |


  Scenario: Audit role cannot modify any data via RLS
    Given a user with "audit" role
    When the audit user attempts any INSERT/UPDATE/DELETE operation
    Then the RLS policy should:
      | Security Check           |
      | Detect "audit" role     |
      | Block the operation     |
      | Return permission error |
      | Log the attempt         |




## Scenario 5: Role Transitions and History

  Scenario: Role change history is maintained
    Given a user "john.doe@example.com" with initial role "agent"
    When the user's role is changed to "supervisor"
    And 2 days later changed to "admin"
    And later changed back to "agent"
    Then the audit log should show:
      | Timestamp | Action              | Old Role    | New Role    | Changed By |
      | T1        | Role Assignment     | agent       | supervisor  | admin@...  |
      | T2        | Role Assignment     | supervisor  | admin       | admin@...  |
      | T3        | Role Assignment     | admin       | agent       | admin@...  |


  Scenario: User cannot revert own role changes
    Given I am logged in as user with role "supervisor"
    When I access my profile settings
    Then I should see my current role displayed
    And I should NOT see option to change my own role
    And I should see message "Contact an admin to change your role"


  Scenario: Former admin losing admin role
    Given a user previously was admin with admin permissions
    When the user's role is changed to "agent"
    Then all admin-level API tokens should be revoked
    And the user's active sessions should be terminated
    And the user must re-login to access system with new permissions
    And an audit alert should be triggered




## Scenario 6: Permission Checks in UI

  Scenario: Agent cannot see delete button for tickets
    Given I am logged in as "agent"
    And I am viewing a ticket
    When the page loads
    Then the "Delete" button should be hidden
    And the "Edit" button should be shown
    And the "Comment" button should be shown
    And only agent-permitted actions should be visible


  Scenario: Supervisor sees reassign option for team tickets
    Given I am logged in as "supervisor"
    And I am viewing a team ticket
    When the page loads
    Then I should see "Reassign" button
    And I should see dropdown with team members
    And I should be able to reassign the ticket


  Scenario: Admin sees all management options
    Given I am logged in as "admin"
    When I navigate to any section
    Then all action buttons should be visible:
      | Admin Buttons      |
      | Edit               |
      | Delete             |
      | Archive            |
      | Manage Users       |
      | System Settings    |
      | Export             |


  Scenario: Audit user sees view-only mode
    Given I am logged in as "audit"
    When I navigate to tickets or users
    Then all UI elements should be in view-only mode
    And all input fields should be disabled
    And no buttons should allow modifications
    And only "View" and "Export" actions available




## Scenario 7: Custom Role and Permission Definition

  Scenario: Admin can create custom role (future feature)
    Given I am logged in as admin
    When I navigate to Role Management
    And I click "Create Custom Role"
    Then I should see form for new role
    When I enter:
      | Field        | Value                |
      | Role Name    | Team Lead            |
      | Description  | Leads a team         |
    And I select permissions:
      | Permissions                    |
      | Create Tickets                |
      | View Team Tickets            |
      | Assign Tickets to Team       |
      | View Team Analytics          |
    And I click "Create"
    Then the custom role should be created
    And it should appear in role assignment dropdown


  Scenario: Admin can modify existing role permissions
    Given a custom role "Team Lead" exists
    And I am logged in as admin
    When I navigate to Role Management
    And I click "Edit" for "Team Lead" role
    Then I should see current permissions list
    When I add permission "Delete Team Tickets"
    And I remove permission "View Team Analytics"
    And I click "Save"
    Then role permissions should be updated
    And affected users should have updated permissions immediately




## Scenario 8: Role-Based Data Visibility

  Scenario: Agent can only see own tickets
    Given I am logged in as "agent"
    And tickets exist:
      | Ticket | Assigned To | Status   |
      | T1     | Me          | Open     |
      | T2     | Me          | Closed   |
      | T3     | Other Agent | Open     |
      | T4     | Other Agent | Closed   |
    When I view the ticket list
    Then I should see:
      | Visible Tickets |
      | T1              |
      | T2              |
    And I should NOT see:
      | Hidden Tickets |
      | T3             |
      | T4             |


  Scenario: Supervisor can see team members' tickets
    Given I am logged in as "supervisor"
    And my team members are [Agent A, Agent B]
    And tickets exist assigned to team members
    When I view the ticket list
    Then I should see all team members' tickets
    And I should NOT see tickets from other teams


  Scenario: Admin can see all tickets
    Given I am logged in as "admin"
    And tickets exist from all teams and agents
    When I view the ticket list
    Then I should see ALL tickets
    And I should see filter options for teams
    And I should see filter options for agents


  Scenario: Audit can see all data but cannot modify
    Given I am logged in as "audit"
    And I navigate to any dashboard
    When the page loads
    Then I should see all data
    And I should NOT be able to modify any data
    And I should see "Read-Only Mode" indicator




## Scenario 9: API Token Permissions

  Scenario: API token inherits user role permissions
    Given I am logged in as "agent"
    When I navigate to API Keys
    And I generate a new API token
    Then the token should have "agent" role permissions
    And API calls with this token should be restricted to agent actions


  Scenario: Admin can create token with different role
    Given I am logged in as "admin"
    When I navigate to API Access
    And I create new API token
    Then I can select token role/permissions independently
    When I select role "read-only"
    Then the token should only have read permissions
    And write operations should fail with this token


  Scenario: Token permissions are enforced server-side
    Given I have API token with "agent" role
    When I attempt DELETE request to /admin/users
    Then the server should:
      | Server Action              |
      | Check token permissions   |
      | Detect insufficient scope |
      | Return 403 Forbidden      |
      | Log the attempt           |




## Scenario 10: Webhook and Integration Permissions

  Scenario: Webhook calls respect role permissions
    Given a webhook is configured to call /api/tickets
    When the webhook triggers a call
    And the webhook token has "agent" role
    Then the API call should:
      | Permission Check              |
      | Run as "agent" role          |
      | Filter results for agent    |
      | Respect agent data access   |


  Scenario: Integration token permissions
    Given a third-party integration is connected
    And an API token is issued with "read-only" role
    When the integration makes API calls
    Then all calls should be limited to read operations
    And write operations should fail




## Scenario 11: Role-Based Audit Logging

  Scenario: Audit logs show role-based actions
    Given a user with "supervisor" role performs an action
    When the user reassigns a ticket
    Then the audit log should record:
      | Field        | Value                |
      | user         | supervisor@...       |
      | action       | ticket_reassigned    |
      | role_at_time | supervisor           |
      | resource     | ticket ID            |
      | timestamp    | action time          |


  Scenario: Restricted actions are logged as "permission denied"
    Given an agent attempts to delete a ticket
    When the system checks permissions and rejects it
    Then the audit log should record:
      | Field     | Value                     |
      | user      | agent@...                 |
      | action    | ticket_delete_attempted  |
      | result    | permission_denied        |
      | role      | agent                     |
      | timestamp | attempt time              |


  Scenario: Role change is fully audited
    Given admin changes user role from "agent" to "supervisor"
    When the change is saved
    Then audit log should show:
      | Field        | Value         |
      | actor        | admin@...     |
      | action       | role_changed  |
      | user         | agent@...     |
      | old_role     | agent         |
      | new_role     | supervisor    |
      | timestamp    | change time   |




## Scenario 12: Role-Based Notifications

  Scenario: Only supervisors receive team reports
    Given a report is scheduled for daily distribution
    When the report is generated
    Then it should be sent only to users with "supervisor" or higher role
    And agents should NOT receive the report


  Scenario: Admin receives system alerts
    Given a system issue occurs
    When the alert is triggered
    Then only users with "admin" role should receive alert
    And other roles should not receive alerts


  Scenario: Audit users receive compliance notifications
    Given a compliance event occurs
    When the notification is sent
    Then users with "audit" role should receive notification
    And notification should include relevant audit information




## Scenario 13: Cross-Role Collaboration

  Scenario: Agent can collaborate within role constraints
    Given I am logged in as "agent"
    And I have ticket T1 assigned to me
    When another agent wants to help
    And requests access to my ticket
    Then I should be able to share read access
    But the other agent cannot edit without reassignment


  Scenario: Supervisor can facilitate cross-agent transfer
    Given I am supervisor with agents [A, B, C]
    When Agent A's ticket needs work from Agent B
    And I (supervisor) reassign to Agent B
    Then Agent B now has full edit permissions
    And Agent A loses edit permissions
    And ticket transfer is logged


  Scenario: Team collaboration respects role boundaries
    Given a supervisor team and an agent team exist
    When supervisor team receives a ticket that needs agent team work
    Then agent team can view the ticket
    But cannot see supervisor-only notes/data
    And team escalation request can be made




## Scenario 14: Permission Inheritance and Delegation

  Scenario: Admin permissions include all subordinate role permissions
    Given I am admin
    And admin role includes all permissions
    When I perform an "agent" level action
    Then the action should succeed
    And I should be able to do everything an agent can do


  Scenario: Supervisor can temporarily escalate agent permissions
    Given I am supervisor
    When an agent needs special access for specific ticket
    And I grant temporary "edit" permission
    Then the agent can edit that ticket
    But access should expire after set time (24 hours)


  Scenario: Permission delegation is audited
    Given I am admin
    When I grant temporary elevated permissions to agent
    Then audit log should record:
      | Field              | Value                           |
      | action             | permission_delegated            |
      | granted_to         | agent ID                        |
      | permissions        | specific permissions granted    |
      | expiration         | when access expires             |
      | reason             | reason provided by admin        |




## Scenario 15: Role-Based Feature Flags

  Scenario: Features are shown based on user role
    Given I am logged in as "agent"
    When I access the dashboard
    Then I should see:
      | Available Features   |
      | Tickets             |
      | Personal Settings   |
      | Help                |
    And I should NOT see:
      | Hidden Features      |
      | Admin Panel         |
      | User Management     |
      | System Settings     |


  Scenario: Beta features are role-restricted
    Given a new beta feature is released
    When the feature is flagged as "admin-only"
    Then only admin users can see and use the feature
    And agent users should not see any indication of the feature


  Scenario: Feature rollout by role
    Given feature "Smart Ticket Routing" is in beta
    When admin enables it for supervisors
    Then supervisors can see and use the feature
    But agents still cannot access it
    And rollout can be expanded to more roles later




## Scenario 16: Security and Compliance

  Scenario: Least Privilege Principle enforced
    Given a new user is created
    When the user is assigned lowest necessary role
    Then the user should have minimum permissions
    And user cannot escalate own permissions
    And all actions are restricted to role boundaries


  Scenario: SOC 2 compliance with RBAC
    Given SOC 2 compliance requirements exist
    When the system is audited
    Then all required role-based controls should be verified:
      | Compliance Check                |
      | Role separation exists         |
      | Permissions clearly defined    |
      | Audit logs maintained          |
      | Access is time-limited         |
      | Changes are logged             |


  Scenario: GDPR compliance for audit role
    Given audit role needs access to user data
    When data is accessed via audit role
    Then system should log:
      | Compliance Data |
      | Who accessed    |
      | What data       |
      | When accessed   |
      | Why (purpose)   |
    And access should be automatically retained for 7 years


  Scenario: Unauthorized access attempts are blocked
    Given a user with "agent" role
    When the agent attempts to directly access URL: "/admin/users"
    Then the system should:
      | Security Action          |
      | Detect permission issue |
      | Redirect to 403 page    |
      | Log the attempt         |
      | Send admin alert        |




## Scenario 17: Role Management Best Practices

  Scenario: Role review process
    Given I am admin
    When I navigate to Role Audit section
    Then I should see all user-role assignments
    And I can review role appropriateness
    When I find user has unnecessary admin role
    And I click "Review Request"
    Then I can downgrade the role


  Scenario: Role separation of duties
    Given system requires separation of duties
    When admin user attempts to delete own admin account
    Then system should block this
    And require another admin to perform deletion


  Scenario: Emergency access override
    Given a critical incident occurs
    When on-call admin grants temporary elevated access
    Then access should be granted immediately
    And must be approved by second admin within 1 hour
    And full audit trail must be maintained




## Scenario 18: Role Integration with Other Features

  Scenario: RBAC works with 2FA
    Given user has "admin" role
    And 2FA is enabled for admin role
    When admin logs in
    Then 2FA should be required
    And only admin-level actions require 2FA


  Scenario: RBAC works with account lockout
    Given account lockout is 5 failed attempts
    When admin fails to login 5 times
    Then admin account should be locked
    And lockout respects role permissions (anyone can unlock)


  Scenario: RBAC works with session management
    Given user with "agent" role has active session
    When admin changes role to "supervisor"
    Then on next user action, new permissions should apply
    And session should not be terminated
    And new role permissions should become effective


  Scenario: RBAC works with audit logging
    Given all user actions are logged
    When any user performs action
    Then audit log should include:
      | Log Field        |
      | User role        |
      | Action performed |
      | Permission check |
      | Result (allowed) |

