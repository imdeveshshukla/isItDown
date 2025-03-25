// Add declaration to extend Express Request
declare namespace Express {
        interface Request {
            userId?: number;
        }
    }   
