import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../database/prisma.service';
import { AppError } from '../utils/AppError';
import { CreatePost, UpdatePost} from './posts.schema';

const POST_NOT_FOUND = "Post not found";

export const listPosts = async () => {
	const posts = await prisma.post.findMany();

	return posts
};

export const getPost = async (id: number) => {
	const post = await prisma.post.findUnique({
		where: { id },
		include: { author: true }
	});

	if (post) {
		return post;
	}

	throw new AppError(404, POST_NOT_FOUND);
};

export const addPost = async (post: CreatePost, userId: number) => {
	const createdPost = await prisma.post.create({
		data: {
			...post,
			authorId: userId,
		},
	});

	
	return createdPost;
};

export const updatePost = async (id: number, post: UpdatePost) => {
	try {
		return await prisma.post.update({
			where: { id },
			data: post,
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
			throw new AppError(404, POST_NOT_FOUND);
		}
		throw e;
	}
};

export const deletePost = async (id: number) => {
	try {
		return await prisma.post.delete({
			where: { id },
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
			throw new AppError(404, POST_NOT_FOUND);
		}
		throw e;
	}
};