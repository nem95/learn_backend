import express, { Request, Response } from 'express';
import { addPost, deletePost, getPost, listPosts, updatePost } from './posts.service';

const postsRouter = express.Router()

postsRouter.get('/', (_req: Request, res: Response) => {
	const posts = listPosts()

	res.json(posts);
});

postsRouter.get('/:id', (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const posts = getPost(Number(id))
		res.json(posts);
	} catch (error) {
		console.error(error)
  	res.status(500).json({})
	}
});

postsRouter.post('/', (req: Request, res: Response) => {
	const data = req.body;
	
	try {
		const createPost = addPost(data)

		res.json(createPost);
	} catch (error) {
		console.error(error)
  	res.status(500).json({})
	}
});

postsRouter.patch('/:id', (req: Request, res: Response) => {
	const data = req.body;
	const id = req.params.id;
	try {
		const createPost = updatePost(Number(id), data)

		res.json(createPost);
	} catch (error) {
		console.error(error)
  	res.status(500).json({})
	}
});

postsRouter.delete('/:id', (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		deletePost(Number(id))

		res.json({message: `post id: ${id} deleted successfully` });
	} catch (error) {
		console.error(error)
  	res.status(500).json({})
	}
});
export { postsRouter };