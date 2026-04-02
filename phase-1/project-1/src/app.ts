import express, { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();

const myLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log('Middleware says: LOGGED')
  next()
}

app.use(express.json())
app.use(myLogger)

app.get('/', (_req: Request, res: Response) => {
  res.send('TypeScript With Express!');
});

export { app }; 
