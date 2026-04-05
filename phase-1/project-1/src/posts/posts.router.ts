import express, { Request, Response } from 'express';
import { addPost, deletePost, getPost, listPosts, updatePost } from './posts.service';
import { validateBodySchema, validateParamsSchema } from '../utils/validateSchema';
import { CreatePostSchema, IDSchema, UpdatePostSchema } from './posts.schema';

const postsRouter = express.Router();

const catchError = (err: Error, code?: number) => {
	const statusCode = code || 500;
	const status = err.message === "NOT_FOUND" ? 404 : statusCode;
	const message = err.message === "NOT_FOUND" ? "Post not found" : `Error just happend: ${err}`;

	console.error(err);

	return { 
		status,
		message,
	}
}

postsRouter.get('/', (_req: Request, res: Response) => {
	const posts = listPosts()

	res.json(posts);
});

postsRouter.get('/:id', validateParamsSchema(IDSchema), (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const posts = getPost(Number(id))
		res.json(posts);
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error));
		const { status, message } = catchError(err);

		res.status(status).json({ message})
	}
});

postsRouter.post('/', validateBodySchema(CreatePostSchema) ,(req: Request, res: Response) => {
	const data = req.body;
	
	try {
		const createPost = addPost(data)

		res.status(201).json(createPost);
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error));
		const { status, message } = catchError(err, 400 );

		res.status(status).json({ message })
	}
});

postsRouter.patch('/:id', validateParamsSchema(IDSchema), validateBodySchema(UpdatePostSchema), (req: Request, res: Response) => {
	const data = req.body;
	const { id } = req.params;
	try {
		const updatedPost = updatePost(Number(id), data)

		res.json(updatedPost);
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error));
		const { status, message } = catchError(err, 400 );

		res.status(status).json({ message })
	}
});

postsRouter.delete('/:id', validateParamsSchema(IDSchema), (req: Request, res: Response) => {
const { id } = req.params;

	try {
		deletePost(Number(id))

		res.status(204).json({message: `post id: ${id} deleted successfully` });
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error));
		const { status, message } = catchError(err, 400 );

		res.status(status).json({ message })
	}
});
export { postsRouter };