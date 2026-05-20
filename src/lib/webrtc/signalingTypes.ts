export type SignalingMessageType = "offer" | "answer" | "ice-candidate";

export type SignalingEnvelope = {
  type: SignalingMessageType;
  sessionId: string;
  fromPeerId: string;
  toPeerId: string;
  payload: RTCSessionDescriptionInit | RTCIceCandidateInit;
};

export type SignalingTransport = {
  send: (message: SignalingEnvelope) => Promise<void>;
  receive: (sessionId: string) => Promise<SignalingEnvelope[]>;
};
