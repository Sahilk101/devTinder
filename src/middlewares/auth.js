const adminAuth = (req, res, next) => {
    const token = "xyz"
    const isAdmin = token === "xyz"; // Simulating admin check

    if (isAdmin) {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.status(403).send('Access denied. Admins only.');
    }
}

const userAuth = (req, res, next) => {
    const token = "abc"
    const isUser = token === "abc"; // Simulating user check

    if (isUser) {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.status(403).send('Access denied. Users only.');
    }
}

module.exports = {
    adminAuth,
    userAuth
}