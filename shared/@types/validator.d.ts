declare class Validator {
    static validateUsername(username: string): string;
    static validatePassword(password: string): string;
    static isNumeric(value: string, maxValue: number): boolean;
}

export default Validator;