import { MAX_PASS_LENGTH, MIN_PASS_LENGTH, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH } from "./constants.js";

class Validator {
    static validateUsername(username: string): string {
        if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
            return `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters long.`;
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

    static isInteger(value: string, MAX_VALUE: number): boolean {
        const currencyPattern: RegExp = new RegExp("^[1-9]{1}[0-9]+$");
        return value.match(currencyPattern) !== undefined && +value <= MAX_VALUE;
    }
}

export default Validator;