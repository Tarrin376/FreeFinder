import { MAX_PASS_LENGTH, MIN_PASS_LENGTH } from "./constants.js";

class Validator {
    static validateUsername(username: string): string {
        if (username === "") {
            return "Username cannot be empty.";
        } else if (username[0].toLowerCase() === username[0].toUpperCase()) {
            return "Username must have a leading alphabetical character.";
        } else if (username.split(" ").length > 1) {
            return "Username must not contain any empty spaces.";
        } else {
            return "";
        }
    }

    static validatePassword(password: string): string {
        if (password.length < MIN_PASS_LENGTH || password.length > MAX_PASS_LENGTH) {
            return `Password must be between ${MIN_PASS_LENGTH} and ${MAX_PASS_LENGTH} characters long.`;
        } else {
            return "";
        }
    }
}

export default Validator;