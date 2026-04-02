import { Post } from '../types';

const POSTS: Post[] = [];
let nextId = 1;

export const listPosts = () => {
    return POSTS
};

export const addPost = (post: Post) => {
    const newPost = {
        id: nextId,
        title: post.title,
        content: post.content,
        createdAt: new Date()
    };

    POSTS.push(newPost);

    nextId = nextId + 1;
    return newPost;
};
