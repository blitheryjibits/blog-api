import { prisma } from '../../lib/db.js';
import { validationResult, matchedData } from 'express-validator';

/** Functions, in order:
 * createComment
 * getAllComments
 * getPostComments
 * getSinglePostComment
 * deleteCommentById
 */
export async function createComment(req, res) {
    const result = validationResult(req, { includeOptional: true });
    if (!result.isEmpty()) { 
        return res.status(401).json({
            success: false,
            message: "Invalid credentials when creating a comment",
            errors: result.array()
        })
    }
    const { content, postId } = matchedData(req, { includeOptional: true });
    const authorId = req.user.id;
    try {
        const post = await prisma.comment.create({
            data: { postId, authorId, content }
        })
    res.status(201).json({ post })
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

export async function getAllComments(req, res) {
    try {
        const comments = await prisma.comment.findMany();
        // inform user if no comments are available
        if (!comments) return res.status(200).json({ success: false, message: "No comments found"})
        // return comments if available
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

export async function getPostComments(req, res) {
const result = validationResult(req);
    const { postId } = matchedData(req, {includeOptional: true});
    if (!result.isEmpty()) { return res.json({
            success: false,
            message: "Validation result for parameters or comment failed in the delete comment function",
            errors: result.array() 
        })
    }
    try {
        const comments = await prisma.comment.findMany({
                where: { postId: postId}
            })
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getSinglePostComment(req, res) {
    const result = validationResult(req);
    const { postId, commentId } = matchedData(req, {includeOptional: true});
    if (!result.isEmpty()) { 
        return res.json({
            success: false,
            message: "Validation result for parameters or comment failed in the delete comment function",
            errors: result.array() 
        })
    }
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                AND: [
                    { id: commentId },
                    { postId: postId }
                ]
            }
        })
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found"});
        res.status(200).json( comment )
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function updateComment(req, res) {
    const userId = req.user.id;
    const result = validationResult(req);
    if (!result.isEmpty()) { 
        return res.json({
            success: false,
            message: "Validation result for parameters or comment failed in the delete comment function",
            errors: result.array() 
        })
    }
    const { postId, commentId, content } = matchedData(req, {includeOptional: true});
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                AND: [
                    { id: commentId },
                    { postId: postId }
                ]
            }
        })
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found"});
        if (comment.authorId !== userId) return res.status(403).json({ success: false, message: "User id does not match the comment's author id.\nUsers can only edit their own comments" })
        const newComment = await prisma.comment.update({
            where: {
                id_postId: { id:commentId, postId:postId }
            },
            data: { content: content }
        });
        res.status(201).json( newComment );
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteCommentById(req, res) {
    const result = validationResult(req);
    const { postId, commentId } = matchedData(req);
    if (!result.isEmpty()) { return res.json({
            success: false,
            message: "Validation result for parameters or comment failed in the delete comment function",
            errors: result.array() 
        })
    }
    try {
        await prisma.comment.delete({
            where: { id_postId: { id:commentId, postId } }
        })
        res.status(201).json({ message: "Comment succesfully deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}