# University Live Studio — Real Meeting MVP

This version uses LiveKit WebRTC for real browser-to-browser audio/video. It is not yet the full broadcast/DeckLink system.

## Requirements
- Windows with Node.js installed
- Internet connection
- A LiveKit Cloud project: https://cloud.livekit.io/

## Setup (Windows)
1. Extract this ZIP into a simple folder, e.g. `C:\UniversityLiveStudio`.
2. Open that folder in File Explorer.
3. Copy `.env.example` and rename the copy to `.env`.
4. In `.env`, replace the placeholder values with the WebSocket URL, API key, and API secret from your LiveKit Cloud project:
   - `LIVEKIT_URL=wss://...`
   - `LIVEKIT_API_KEY=...`
   - `LIVEKIT_API_SECRET=...`
   Keep the secret private. Do not put it in frontend code or share it publicly.
5. Open PowerShell in the project folder and run:
   ```powershell
   npm install
   npm start
   ```
6. Open `http://localhost:3000` in Chrome or Edge.
7. Enter your display name and a room ID (e.g. `university-lecture`), then click **Join / Create room**.
8. To test two people on the same computer, open the invite link in a second browser/profile and enter a different name. To test with someone elsewhere, the site must be deployed to an HTTPS host; `localhost` links do not work on other people's devices.

## What works in this MVP
- Real LiveKit room tokens are created server-side.
- Join/create a room and share a room URL.
- Browser camera/microphone publication.
- Remote participant tiles and incoming audio/video.
- Basic host-side pin selection and timed preview rotation.

## Known limitations
- This does not yet include a deployed public URL. `localhost` only works on the computer running the server.
- For external users, deploy the Node app to a public HTTPS host and configure the same environment variables there.
- Host-side pinning here is a local preview control. It does not yet produce one identical, composed program output for all viewers.
- No Blackmagic DeckLink/SDI capture integration is included yet.
- 4K is not guaranteed; actual quality depends on source format, browser/device decoding, network, encoder, and media configuration.
- Production deployment should add authentication, room access control, rate limiting, logging, and a proper shared broadcast output pipeline.
