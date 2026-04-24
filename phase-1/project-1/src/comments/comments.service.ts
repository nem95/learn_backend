import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../database/prisma.service';
import { getPost } from '../posts/posts.service';
import { AppError } from '../utils/AppError';
import { CreateComment } from './comments.schema';

const POST_NOT_FOUND = "Post not found";

export const getPostComments = async (id: number) => {
	const post = await getPost(id);
	if (!post) throw new AppError(404, POST_NOT_FOUND);

	const comments = await prisma.comment.findMany({
		where: { postId: id },
		orderBy: {
			createdAt: "desc",
		},
	});

	return comments;
};

export const addComment = async (comment: CreateComment, postId: number) => {
	const post = await getPost(postId);
	if (!post) throw new AppError(404, POST_NOT_FOUND);

	const createdComment = await prisma.comment.create({
		data: {
			...comment,
			postId
		},
	});


	return createdComment;
};

// NO IMPLEMENTATION FOR NOW 

// export const updateComment = async (id: number, post: UpdateComment) => {
// 	try {
// 		return await prisma.comment.update({
// 			where: { id },
// 			data: post,
// 		});
// 	} catch (e) {
// 		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
// 			throw new AppError(404, POST_NOT_FOUND);
// 		}
// 		throw e;
// 	}
// };

// export const deleteComment = async (id: number) => {
// 	try {
// 		return await prisma.comment.delete({
// 			where: { id },
// 		});
// 	} catch (e) {
// 		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
// 			throw new AppError(404, POST_NOT_FOUND);
// 		}
// 		throw e;
// 	}
// };