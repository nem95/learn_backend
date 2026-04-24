import express, { NextFunction, Request, Response } from 'express';
import { addComment, getPostComments } from './comments.service';
import { validateBodySchema, validateParamsSchema } from '../utils/validateSchema';
import { CreateCommentSchema, IDSchema } from './comments.schema';

const commentRouter = express.Router({ mergeParams: true });

commentRouter.get('/', validateParamsSchema(IDSchema), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const posts = await getPostComments(Number(id))
    res.json(posts);
  } catch (error) {
    next(error)
  }
});

commentRouter.post(
  '/',
  validateParamsSchema(IDSchema), 
  validateBodySchema(CreateCommentSchema), 
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const { id } = req.params;
    
    try {
      const createComment = await addComment(data, Number(id))

      res.status(201).json(createComment);
    } catch (error) {
      next(error)
    }
  }
);


// NO IMPLEMENTATION FOR NOW 

// commentRouter.patch('/:id', 
//   validateParamsSchema(IDSchema), 
//   validateBodySchema(UpdateCommentSchema), 
//   async (req: Request, res: Response, next: NextFunction) => {
//     const data = req.body;
//     const { id } = req.params;
//     try {
//       const updatedPost = await updateComment(Number(id), data)

//       res.json(updatedPost);
//     } catch (error) {
//       next(error)
//     }
//   }
// );

// commentRouter.delete('/:id', validateParamsSchema(IDSchema), async(req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params;

//   try {
//     await deleteComment(Number(id))

//     res.status(204).send();
//   } catch (error) {
//     next(error)
//   }
// });

export { commentRouter };
