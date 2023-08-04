export function formatGroup(group) {
    const cur = {
        ...group,
        lastMessage: group.messages.length > 0 ? group.messages[0] : null,
        workType: group.post.workType.name,
        postID: group.post.postID,
        seller: {
            profilePicURL: group.post.postedBy.user.profilePicURL,
            username: group.post.postedBy.user.username,
            status: group.post.postedBy.user.status,
            userID: group.post.postedBy.user.userID,
        }
    };

    delete cur.messages;
    delete cur.post;
    return cur;
}