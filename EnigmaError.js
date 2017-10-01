class EnigmaError extends Error {
    constructor(status, message) {
        if (!message) message = status;
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = message ? status : 500;
    }
}

module.exports = EnigmaError;
