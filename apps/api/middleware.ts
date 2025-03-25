import type { Request, Response, NextFunction } from "express"

// Extend Request interface
interface CustomRequest extends Request {
  userId?: number;
}

export function validateWebsite(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    //Authentications

    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized" })
        return;
    }
    const token = authHeader.split(" ")[1]
    if (!token) {
        res.status(401).json({ message: "Unauthorized" })
        return;
    }

    // Cast to CustomRequest
    req.userId = 1;
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "UserId is missing" })
        return;
    }
    next()
}
