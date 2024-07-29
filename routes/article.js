import { Router } from "express";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";
import { addArticle, deleteArticle, getArticles, updateArticle } from "../controllers/article.js";

// Create router
const articleRouter = Router();

// Define routes
articleRouter.post('/articles', isAuthenticated, hasPermission('create_article'), addArticle);

articleRouter.get('/articles', getArticles);

articleRouter.patch('/articles/:id', isAuthenticated, hasPermission('update_article'), updateArticle);

articleRouter.delete('/articles/:id', isAuthenticated, hasPermission('delete_article'), deleteArticle);

// Export router
export default articleRouter;