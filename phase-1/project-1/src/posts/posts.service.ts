import { Post } from '../types';
import { findPostIndex } from '../utils/posts';
import { CreatePost, UpdatePost } from './posts.schema';

export let POSTS: Post[] = [];

let nextId = 1;
const NOT_FOUND = "NOT_FOUND";

export const listPosts = () => {
	return POSTS
};

export const getPost = (id: number) => {
	const post = POSTS.find(post => post.id === id)

	if (post) {
		return post;
	}

	throw new Error(NOT_FOUND);
};

export const addPost = (post: CreatePost) => {
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

export const updatePost = (id: number, post: UpdatePost) => {
	const postIndex = findPostIndex(id);

	if (postIndex === -1) {
		throw new Error(NOT_FOUND);
	}

	const newPosts = POSTS.map(currentPost => {
		if (currentPost.id === id) {
			if (post.title) {
				currentPost.title = post.title;
			}
			if (post.content) {
				currentPost.content = post.content;
			}
			return { ...currentPost };
		} else {
			return currentPost;
		}
	})

	POSTS = newPosts;
	return POSTS[postIndex];
};

export const deletePost = (id: number) => {
	const postIndex = findPostIndex(id);

	if (postIndex === -1) {
		throw new Error(NOT_FOUND);
	}

	POSTS.splice(postIndex, 1);
	return POSTS;
};