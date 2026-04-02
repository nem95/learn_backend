import { app } from "./app";

const port = process.env.PORT || 3000;

// Server setup
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});