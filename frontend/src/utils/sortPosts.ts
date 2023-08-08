import { sortPostsOption } from "src/types/sortPostsOption"

export const sortPosts: {
    [key in sortPostsOption]: string
} = {
    "most recent": "recent",
    "rating": "rating",
    "lowest price": "lowest-price",
    "highest price": "highest-price"
}