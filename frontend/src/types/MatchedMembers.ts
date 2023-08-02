import { GroupPreview } from "./GroupPreview"

export type MatchedMembers = Array<
    GroupPreview["members"][number] & { 
        foundAt: number 
    }
>;