// import prisma from '../prisma/client.js';
import { prisma } from '../../lib/db.js';
import { validationResult, matchedData } from 'express-validator';

/** Functions in order
 * createPost
 * getAllPublishedPosts
 * getPostById
 * getPostBySearch
 * updatePost
 * deletePost
 */
export async function createPost(req, res) {
    const result = validationResult(req);
    if(!result.isEmpty()) { 
        return res.status(401).json({ error: "Invalid Title or Content in Post Request"})
    }
    const { title, content, published } = matchedData(req, {includeOptionals: true});
    const userId = req.user.id;
    try {
        const post = await prisma.post.create({
            data: { title, content, authorId: userId, published },
        });
    res.status(201).json(post);

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

// Only returns all of the "published" posts, i.e., where published: true
export async function getAllPublishedPosts (req, res) {
        const posts = await prisma.post.findMany({
            where: { published: true }
        });
        res.json(posts);
    }

export async function getPostById(req, res) {
        const { postId } = matchedData(req, { includeOptionals: true });
        const authorId = req.user.id;
        try {
        const post = await prisma.post.findUnique({
            where: { id_authorId: { postId, authorId } },
        });
        if (!post) {
            res.status(404).json({ error: "Post not found" })
        }
        res.json(post);
        } catch (error) {
            res.status(500).json({ error: error.message})
        }
    }
    
export async function getPostBySearch(req, res) {
    // Add validation check
        const { term } = req.query;
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                OR: [
                    {title: { contains: term, mode: 'insensitive' }},
                    {content: { contains: term, mode: 'insensitive' }}
                ]
            }
        })

        res.status(200).json(posts);
    }

export async function updatePost(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: 'Invalid post data' });
  }

  // receives validated data from the validators only
  const { title, content, published, postId } = matchedData(req, { includeOptionals: true });
  const authorId = req.user.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id_authorId: { postId, authorId } }
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId !== authorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this post' });
    }

    const updatedPost = await prisma.post.update({
        where: { id_authorId: { postId, authorId } },
        data: { title, content, published }
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deletePost(req, res) {
        const { postId } = matchedData(req, { includeOptionals: true });
        const authorId = req.user.id;
        try{
            await prisma.post.delete({
                where: { id_authorId: { postId, authorId } },
            });
            res.status(204).json({ message: `Post with id: ${postId} was succesfully deleted`});
        }
        catch(error) {
            res.status(500).json({ error: error.message })
        }
    }
