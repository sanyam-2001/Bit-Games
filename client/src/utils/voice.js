export const getICEServers = () => {
    const iceServers = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.l.google.com:5349" },
        { urls: "stun:stun1.l.google.com:3478" },
        { urls: "stun:stun1.l.google.com:5349" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:5349" },
        { urls: "stun:stun3.l.google.com:3478" },
        { urls: "stun:stun3.l.google.com:5349" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:5349" }
    ];
    return iceServers;
};

export const getPeerConnectionConfig = () => {
    return {
        iceServers: getICEServers()
    };
};


export class Peer {
    constructor(socketId, userId, peerConnection) {
        this.peerSocketId = socketId;
        this.peerUserId = userId;
        this.peerConnection = peerConnection;
        this.pendingCandidates = [];
    }

    addPendingCandidate(candidate) {
        this.pendingCandidates.push(candidate);
    }

    async processPendingCandidates() {
        while (this.pendingCandidates.length > 0) {
            const candidate = this.pendingCandidates.shift();
            try {
                await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error processing pending candidate:', error);
                // Put the candidate back in the queue if it fails
                this.pendingCandidates.unshift(candidate);
                break;
            }
        }
    }
}

