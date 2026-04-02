import express, { Request, Response } from 'express';
import { addPost, deletePost, getPost, listPosts, updatePost } from './posts.service';

const postsRouter = express.Router()

postsRouter.get('/', (_req: Request, res: Response) => {
    const posts = listPosts()

    res.json(posts);
});

postsRouter.get('/:id', (req: Request, res: Response) => {
    const params = req.params;

    const posts = getPost(Number(params?.id))
    res.json(posts);
});

postsRouter.post('/', (req: Request, res: Response) => {
    const data = req.body;
    const createPost = addPost(data)

    res.json(createPost);
});

postsRouter.patch('/:id', (req: Request, res: Response) => {
    const data = req.body;
    const id = req.params.id;
    const createPost = updatePost(Number(id), data)

    res.json(createPost);
});

postsRouter.delete('/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    deletePost(Number(id))

    res.json(`post id: ${id} deleted successfully`);
});
export { postsRouter };