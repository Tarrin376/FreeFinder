export function capitalizeWord(word: string): string {
    return `${word[0]}${word.substring(1).toLowerCase()}`;
}