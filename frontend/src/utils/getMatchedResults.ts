export function getMatchedResults(arr: string[], search: string, searchByPrefix?: boolean, allowEmptySearch?: boolean): string[][] {
    if (search.trim() === "" && !allowEmptySearch) {
        return [];
    }

    let res = [];
    if (!searchByPrefix) {
        res = arr.map((cur: string) => {
            const index = cur.toLowerCase().indexOf(search.toLowerCase());
            if (index !== -1) return [cur, index.toString()];
            else return [];
        });
    } else {
        res = arr.map((cur: string) => cur.startsWith(search) ? [cur, "0"] : []);
    }

    return res.filter((cur: string[]) => cur.length > 0);
}