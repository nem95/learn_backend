import express, { NextFunction, Request, Response } from 'express';
import { addPost, deletePost, getPost, listPosts, updatePost } from './posts.service';
import { validateBodySchema, validateParamsSchema } from '../utils/validateSchema';
import { CreatePostSchema, IDSchema, UpdatePostSchema } from './posts.schema';

const postsRouter = express.Router();

postsRouter.get('/', (_req: Request, res: Response) => {
	const posts = listPosts()

	res.json(posts);
});

postsRouter.get('/:id', validateParamsSchema(IDSchema), (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	try {
		const posts = getPost(Number(id))
		res.json(posts);
	} catch (error) {
		next(error)
	}
});

postsRouter.post('/', validateBodySchema(CreatePostSchema) ,(req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	
	try {
		const createPost = addPost(data)

		res.status(201).json(createPost);
	} catch (error) {
		next(error)
	}
});

postsRouter.patch('/:id', validateParamsSchema(IDSchema), validateBodySchema(UpdatePostSchema), (req: Request, res: Response, next: NextFunction) => {
	const data = req.body;
	const { id } = req.params;
	try {
		const updatedPost = updatePost(Number(id), data)

		res.json(updatedPost);
	} catch (error) {
		next(error)
	}
});

postsRouter.delete('/:id', validateParamsSchema(IDSchema), (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	try {
		deletePost(Number(id))

		res.status(204).send();
	} catch (error) {
		next(error)
	}
});

export { postsRouter };
