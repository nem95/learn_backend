import { Post } from '../types';
import { findPostIndex } from '../utils/posts';

export let POSTS: Post[] = [];
let nextId = 1;

export const listPosts = () => {
	return POSTS
};

export const getPost = (id: number) => {
	const post = POSTS.find(post => post.id === id)
	console.log(post);

	if (post) {
		return post;
	}

	throw new Error("erreur");
};

export const addPost = (post: Post) => {
	const newPost = {
		id: nextId,
		title: post.title,
		content: post.content,
		createdAt: new Date()
	};

	POSTS.push(newPost);
	console.log("POSTS", POSTS);
	
	nextId = nextId + 1;
	return newPost;
};



export const updatePost = (id: number, post: Post) => {
	const postIndex = findPostIndex(id);

	if (postIndex === -1) {
    throw new Error("Post not found"); 
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
    throw new Error("Post not found"); 
	}

	POSTS.splice(postIndex, 1);

	return POSTS;
};