export type CyberSendDataChannel = {
  channel: RTCDataChannel;
  sendEphemeralMessage: (message: string) => void;
  close: () => void;
};

export function createCyberSendDataChannel(peerConnection: RTCPeerConnection): CyberSendDataChannel {
  const channel = peerConnection.createDataChannel("cybersend-ephemeral", {
    ordered: true
  });

  return {
    channel,
    sendEphemeralMessage(message: string) {
      // TODO(webrtc): encrypt before sending and never persist message payloads in signaling.
      channel.send(message);
    },
    close() {
      channel.close();
    }
  };
}
