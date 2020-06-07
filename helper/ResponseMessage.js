class ResponseMessage {
    constructor(errorCode = 1, message = null, data = []) {
        this.code = errorCode;
        this.msg = message != null ? message : errorCode == 0 ? "Success" : "Failed";
        this.records = data;
    }
}

module.exports = ResponseMessage;
