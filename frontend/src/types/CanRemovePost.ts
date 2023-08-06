export type CanRemovePost = {
    deletingPost: boolean,
    setDeletingPost: React.Dispatch<React.SetStateAction<boolean>>,
    removeURL: string,
    unsave?: boolean
}