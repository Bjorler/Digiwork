import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

export class Nodemailer {
    static sendCustomMail = async (emailOptions, configEmail, pathTemplates) => {
        const emailOpt = {
            template: emailOptions.template,
            from: `"${ configEmail.PERSONALIZED_USER }" <${ configEmail.USER }>`,
            to: emailOptions.to,
            subject: emailOptions.subject,
            context: emailOptions.context
        };
        try {
            await Nodemailer.createTransporter(configEmail);
            console.log("Email service is running");
            await Nodemailer.useTemplate(pathTemplates);
            return Nodemailer.send(emailOpt);
        } catch (error) {
            throw new Error("No se puede enviar email: ", error);
        }

    };

    static createTransporter = (configEmail) => {
        return Promise.resolve(transporter = nodemailer.createTransport({
            host: configEmail.HOST,
            secureConnection: configEmail.SECURE_MODE,
            port: configEmail.PORT,
            auth: {
                user: configEmail.USER,
                pass: configEmail.PASSWORD
            }
        }));
    };

    static useTemplate = (pathTemplates) => {
        return Promise.resolve(
            transporter.use('compile', hbs({
                viewEngine: {
                    extName: ".handlebars",
                    partialsDir: pathTemplates,
                    layoutsDir: pathTemplates,
                    defaultLayout: false
                },
                viewPath: pathTemplates,
                extName: '.handlebars'
            }))
        );
    };

    static send = (mailOptions) => {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                error ? reject(error) : resolve('Email enviado');
            });
        });
    };
}
