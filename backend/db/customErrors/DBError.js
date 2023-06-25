
export class DBError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "DBError";
    }
}