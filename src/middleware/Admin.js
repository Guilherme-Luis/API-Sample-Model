export default function isAdmin(req, res, next) {
    const { role } = req.user;

    if (role !== "ADMIN") {
        return res.status(403).json({
            message: `Acesso restrito a administradores`
        });
    }

    next();
}
