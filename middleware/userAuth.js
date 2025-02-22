import jwt from 'jsonwebtoken'

const userAuth = async(req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ success: false, message: "Not authorized.Login again" })

    }
    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodeToken.id) {
            req.body.userId = decodeToken.id;
        } else {
            return res.json({ success: false, message: "Not authorized. Login again." });
        }
        next();
    } catch (error) {
        res.json({ success: false, message: error.message }); // Send proper error message
    }
};

export default userAuth;