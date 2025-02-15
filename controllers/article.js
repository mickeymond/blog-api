import { ArticleModel } from "../models/article.js";
import { addArticleValidator } from "../validators/article.js";

export const addArticle = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = addArticleValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Create article
        const article = await ArticleModel.create({
            ...value,
            createdBy: req.session.user.id
        });
        // Return response
        res.status(201).json(article);
    } catch (error) {
        next(error);
    }
}

export const getArticles = async (req, res, next) => {
    try {
        const { populate } = req.query;
        // Find articles
        const defaultPopulate = { path: "createdBy", select: { "name": true } }
        const articles = await ArticleModel
            .find()
            .populate(populate ? JSON.parse(populate) : defaultPopulate);
        // Return response
        res.status(200).json(articles);
    } catch (error) {
        next(error);
    }
}

export const updateArticle = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = addArticleValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Update article
        const article = await ArticleModel.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true }
        );
        // Return response
        res.status(200).json(article);
    } catch (error) {
        next(error);
    }
}

export const deleteArticle = async (req, res, next) => {
    try {
        // Delete article
        await ArticleModel.findByIdAndDelete(req.params.id);
        // Return response
        res.status(200).json('Article Deleted!');
    } catch (error) {
        next(error);
    }
}