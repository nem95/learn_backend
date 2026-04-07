import express, { Application, NextFunction, Request, Response } from 'express';
import { postsRouter } from './posts/posts.router';
import { AppError } from './utils/AppError';
const app: Application = express();

const myLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log('Middleware says: LOGGED')
  next()
}

app.use(express.json())
app.use(myLogger)

// POSTS router
app.use('/posts', postsRouter)

app.get('/', (_req: Request, res: Response) => {
  res.send('TypeScript With Express!');
});

// LAST MIDDLEWARE
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
   try {
    console.error(err.stack);
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Internal server error';

    res.status(statusCode).json({
      message: message,
    });
  } catch (middlewareErr) {
    res.status(500).send('Unexpected error');
  }
})

export { app }; 
