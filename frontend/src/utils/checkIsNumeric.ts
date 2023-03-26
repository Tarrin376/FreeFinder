export function checkIsNumeric(value: string, MAX_VALUE: number): boolean {
    const currencyPattern: RegExp = new RegExp("^[1-9]{1}[0-9]+([.][0-9]{2})?$");
    return value.match(currencyPattern) !== undefined && +value <= MAX_VALUE;
}