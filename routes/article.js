import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addArticle, getArticles } from "../controllers/article.js";

// Create router
const articleRouter = Router();

// Define routes
articleRouter.post('/articles', isAuthenticated, addArticle);

articleRouter.get('/articles', getArticles);

// Export router
export default articleRouter;