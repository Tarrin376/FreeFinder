export function getUniqueArray<T1, T2>(array: T1[], comparator: (x: T1) => T2): T1[] {
    const set = new Set<T2>();
    const res = [];

    for (let value of array) {
        const property = comparator(value);
        if (!set.has(property)) {
            set.add(property);
            res.push(value);
        }
    }

    return res;
}