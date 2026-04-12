import express, { NextFunction, Request, Response } from 'express';
import { addPost, deletePost, getPost, listPosts, updatePost } from './posts.service';
import { validateBodySchema, validateParamsSchema } from '../utils/validateSchema';
import { CreatePostSchema, IDSchema, UpdatePostSchema } from './posts.schema';

const postsRouter = express.Router();

postsRouter.get('/', async (_req: Request, res: Response) => {
	const posts = await listPosts()

	res.json(posts);
});

postsRouter.get('/:id', validateParamsSchema(IDSchema), async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	try {
		const posts = await getPost(Number(id))
		res.json(posts);
	} catch (error) {
		next(error)
	}
});

postsRouter.post(
	'/',
	validateBodySchema(CreatePostSchema), 
	async (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;
		const userId = 1; // need to be changed by the current connected user.
		
		try {
			const createPost = await addPost(data, userId)

			res.status(201).json(createPost);
		} catch (error) {
			next(error)
		}
	}
);

postsRouter.patch('/:id', 
	validateParamsSchema(IDSchema), 
	validateBodySchema(UpdatePostSchema), 
	async (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;
		const { id } = req.params;
		try {
			const updatedPost = await updatePost(Number(id), data)

			res.json(updatedPost);
		} catch (error) {
			next(error)
		}
	}
);

postsRouter.delete('/:id', validateParamsSchema(IDSchema), async(req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	try {
		await deletePost(Number(id))

		res.status(204).send();
	} catch (error) {
		next(error)
	}
});

export { postsRouter };
