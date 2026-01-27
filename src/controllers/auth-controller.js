// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma, Prisma } from '../lib/db.js';
import generateToken from '../utils/generate-token.mjs'
import bcrypt from "bcryptjs";
import { validationResult, matchedData } from "express-validator";

    // add error handling for duplicate users and other prisma or db related errors
export async function register(req, res) {  
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(401).json({error: result.array()})
    }
    const { username, email, password } = matchedData(req);
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        const token = generateToken(user.id)
        res.json({ accessToken: token });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const field = e.meta?.target;
                res.status(409).json({
                    success: fali,
                    message:`A user with this ${field} already exists.`,
                    field: `${field}`,
                    prismaErrorCode: 'p2002'
                })
            }

        }
        res.status(500).json({ success: false, error: error.message })
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = generateToken(user.id)
        res.json({ accessToken: token });

    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

export async function adminLogin(req, res) {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isValid = bcrypt.compareSync(hashedPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = generateToken(user.id)
        res.json({ accessToken: token });

    } catch (error) {
        res.status(403).json({ error: error.message })
    }
}

export async function updateUser(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(401).json({ success: false, message: result.array() })
    }

    // Verify information exists and check for validation errors
    const { password, email, username } = matchedData(req, {includeOptionals: true});
    const userId = req.user.id; 
    const updates = {
        ...(username && { username }),
        ...(email && { email }),
        ...(password && { password: bcrypt.hashSync(password, 10) })
    };

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields to update' }); // Prevent empty updates
    }

    // Get user object from database and update user info
    try{
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
    
        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updates
    });
    
    const token = generateToken(updatedUser.id)
    res.json({ message: 'User updated successfully', user: updatedUser, accessToken: token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

