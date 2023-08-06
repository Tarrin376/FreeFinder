export type CanRemoveSeller = {
    count: React.MutableRefObject<number>,
    deletingSeller: boolean,
    setDeletingSeller: React.Dispatch<React.SetStateAction<boolean>>
}