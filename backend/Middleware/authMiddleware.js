import jwt from "jsonwebtoken";



export const authMiddleWare=(req,res,next)=>{
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Malformed token" });


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // req.user comes from authMiddleware
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
