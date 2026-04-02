import express, { Request, Response } from 'express';
import { addPost, listPosts } from './posts.service';

const postsRouter = express.Router()

postsRouter.get('/', (_req: Request, res: Response) => {
    const posts = listPosts()
    
    res.json(posts);
});

postsRouter.post('/', (req: Request, res: Response) => {
    const data = req.body;
    const createPost = addPost(data)
    
    res.json(createPost);
});

export { postsRouter };