
export const isAuthenticated = (req, res, next) => {
    // Check if session has user
    if (req.session.user) {
        next();
    } else {
        res.status(401).json('User not authenticated');
    }
}