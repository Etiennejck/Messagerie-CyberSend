export function createPeerConnection(): RTCPeerConnection {
  // Netlify Functions can support short-lived signaling exchanges only.
  // Ephemeral messages should move over WebRTC DataChannel in a later phase.
  return new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
}
