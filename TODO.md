# TeamFinder - Socket.IO Integration TODO

## Backend
- [ ] Create Socket.IO init layer (`backend/socket/index.js`) and mount it from `backend/server.js`.
- [ ] Add Socket.IO JWT auth middleware (reject unauthenticated sockets).
- [ ] Add online presence state (userId -> socketId mapping + disconnect cleanup).
- [ ] Add MongoDB models for chat (messages + optional thread for sorting).
- [ ] Implement Socket.IO chat events:
  - [ ] chat:sendMessage (store in MongoDB + emit to recipient room)
  - [ ] chat:typing
  - [ ] chat:seen (read receipts)
  - [ ] chat:join (thread context)
- [ ] Add MongoDB model for notifications.
- [ ] Implement Socket.IO notification events:
  - [ ] connection request sent
  - [ ] connection request accepted
  - [ ] new message received
  - [ ] user joined a project
  - [ ] project invitation received
- [ ] Wire notifications into existing REST flows (join request apply/accept + any existing connection/request logic).

## Frontend
- [ ] Create `frontend/src/context/SocketContext.jsx` (connect after login, auto-reconnect, cleanup listeners).
- [ ] Wire SocketContext provider into app layout.
- [ ] Add unread notification badge to Navbar bell.
- [ ] Add Notifications page (list, mark read).
- [ ] Implement/locate chat UI; wire to SocketContext.
- [ ] Implement typing indicator, read receipts, and auto-scroll.
- [ ] Ensure chat list sorted by latest conversation.

