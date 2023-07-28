export function getMatchedResults(arr: string[], search: string, allowEmptySearch?: boolean): string[][] {
    if (search.trim() === "" && !allowEmptySearch) {
        return [];
    }

    const res = arr.map((cur: string) => {
        const index = cur.toLowerCase().indexOf(search.toLowerCase());
        if (index !== -1) return [cur, index.toString()];
        else return [];
    });

    return res.filter((cur: string[]) => cur.length > 0);
}