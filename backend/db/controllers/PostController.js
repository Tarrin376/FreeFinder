import { 
    createPostHandler, 
    getPostHandler, 
    deletePostHandler,
    addImageHandler, 
    getPostsHandler,
    updatePostHandler
} from "../services/PostService.js";

export async function createPost(req, res) {
    try {
        const result = await createPostHandler(req.body.post, req.body.startingPrice, req.userData.userID);
        res.status(201).json({ postID: result.postID, seller: result.seller, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getPost(req, res) {
    try {
        const post = await getPostHandler(req.params.id);
        res.json({ post, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updatePost(req, res) {
    try {
        const updatedPost = await updatePostHandler(req);
        res.json({ post: updatedPost, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deletePost(req, res) {
    try {
        await deletePostHandler(req.params.id, req.userData.userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function addImage(req, res) {
    try {
        const secure_url = await addImageHandler(req);
        res.status(201).json({ secure_url: secure_url, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getPosts(req, res) {
    try {
        const posts = await getPostsHandler(req);
        res.json({ ...posts, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}