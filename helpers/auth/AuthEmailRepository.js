import { Nodemailer } from "../shared/mailerRepository";

export class AuthEmailRepository {
    #emailOptions = null;
    constructor(templateName, subject, data = { email: "" }, files = {}) {
        this.#emailOptions = new EmailOptionsBuilder()
            .setOptions(templateName, data.email, subject, data)
            .build();
    }

    async sendEmail() {
        return await Nodemailer.sendCustomMail(
            this.#emailOptions,
            this.#emailOptions.config,
            "templates"
        );
    }
}

class EmailOptionsBuilder {
    template = null;
    to = null;
    subject = null;
    attachments = {};
    context = null;
    config = {
        HOST: process.env.EMAIL_HOST,
        PORT: Number(process.env.EMAIL_PORT),
        SECURE_MODE: JSON.parse(process.env.EMAIL_SECURE_MODE),
        USER: process.env.EMAIL_USER,
        PASSWORD: process.env.EMAIL_PASSWORD,
        PERSONALIZED_USER: process.env.EMAIL_PERSONALIZED_USER
    };

    setOptions(template, to, subject, context) {
        this.template = template;
        this.to = to;
        this.subject = subject;
        this.context = context;

        return this;
    }

    
    build() {
        return new EmailOptionEntity(this);
    }
}

class EmailOptionEntity {
    constructor(object) {
        Object.keys(object).forEach(key => this[key] = object[key]);
    }
}