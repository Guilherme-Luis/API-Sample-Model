import nodemailer from 'nodemailer';
import { prisma } from "../config/db.js";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
});

async function list({ userId }) {
    const [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: `desc` }
        }),
        prisma.notification.count({
            where: { userId }
        })
    ]);

    return {
        message: `Notificações listadas com sucesso`,
        totalCount,
        notifications
    };
}

async function create({ userId, title, message, type }) {
    const notification = await prisma.notification.create({
        data: {
            userId,
            title,
            message,
            type,
            read: false
        }
    });

    let emailStatus = { attempted: false };

    if (type === `EMAIL`) {
        emailStatus.attempted = true;
        try {
            await sendEmail({ userId, title, message });
            emailStatus.success = true;
        } catch (error) {
            emailStatus.success = false;
            emailStatus.error = error.message;
        }
    }

    return {
        message: `Notificação criada com sucesso`,
        notification,
        emailStatus
    }
}

async function markAsRead({ id, userId }) {
    const result = await prisma.notification.updateMany({
        where: { id, userId },
        data: { read: true }
    });

    return result.count > 0
}

async function update({ id, userId, data }) {
    const notification = await prisma.notification.findUnique({
        where: { id }
    });

    if (!notification || notification.userId !== userId) {
        return null;
    }

    return prisma.notification.update({
        where: { id },
        data
    });
}

async function deleteNotification({ id, userId }) {
    const result = await prisma.notification.deleteMany({
        where: { id, userId }
    });

    return result.count > 0;
}

async function sendEmail({ userId, title, message }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
    });

    if (!user || !user.email) {
        const error = new Error(`Usuário não encontrado ou sem e-mail cadastrado`);
        error.status = 404;
        throw error;
    }

    return transporter.sendMail({
        from: `"Empresa XXX" <${SMTP_USER}>`,
        to: user.email,
        subject: title,
        text: message,
        html: `<p>${message}</p>`
    });
}

export default {
    list,
    create,
    markAsRead,
    update,
    deleteNotification
}

