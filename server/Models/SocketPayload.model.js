class SocketPayload {
  constructor(success, error, data) {
    this.success = success;
    this.error = error;
    this.data = data;
  }
}

export default SocketPayload;
