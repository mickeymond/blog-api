import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const articleSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' },
    publishedAt: { type: Date, default: new Date() },
}, {
    timestamps: true
});

articleSchema.plugin(toJSON);

export const ArticleModel = model('Article', articleSchema);