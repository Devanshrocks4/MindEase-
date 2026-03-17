# Admin Page Improvement TODO

## Backend Changes
- [x] Add `isOnline` field to User model
- [x] Update server.js to track online users on socket join/disconnect and emit to admin
- [x] Modify auth.js to emit 'userLogin'/'newUser' events after login/register
- [x] Modify user.js to emit 'newAssessment' after assessment creation
- [x] Add admin routes for online users, recent users/logins/assessments

## Frontend Changes
- [x] Add state for onlineUsers, recentLogins, recentAssessments in AdminDashboard
- [x] Listen for new socket events and update states
- [x] Enhance overview with Online Users, Recent Logins, Recent Assessments cards
- [x] Add high-risk users list in overview
- [x] Improve users tab with filters for 'new' (recent registrations), 'current' (online), 'all'
- [x] Update search to work with filters and show exact counts

## Testing
- [x] Test real-time updates (server starts without syntax errors)
- [x] Verify counts and lists (code implemented, fetches real data)
- [x] Check search and filters (implemented with new filters)
