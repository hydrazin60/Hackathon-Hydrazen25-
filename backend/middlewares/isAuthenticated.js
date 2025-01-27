import jwt from "jsonwebtoken";
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Please login first",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Please login first",
      });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log(`Something went wrong on login User ! : ${error}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `Something went wrong on login User ! : ${error.message}`,
    });
  }
};

export default isAuthenticated;
