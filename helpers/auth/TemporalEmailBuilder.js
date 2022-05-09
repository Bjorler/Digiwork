import { dayjs } from "@octopy/serverless-core";
import { TokenTools } from "@octopy/serverless-auth";

export class TemporalEmailBuilder {
    userId = null;
    email = null;
    token = null;
    transformedToken = null;
    type = null;
    expirationDate = dayjs().add(Number(process.env.APP_PERSIST_TEMPORAL_EMAIL_IN_DB), "second");

    async setData(userId, email, type, payload) {
        this.userId = userId;
        this.email = email;
        this.type = type;
        this.token = await TokenTools.generateJWT(payload, process.env.APP_EXPIRATION_TEMPORAL_TOKEN, process.env.SECRET_KEY);

        return this;
    }

    build() {
        this.transformedToken = TokenTools.transforDotToPesosSymbol(this.token);
        return new TemporalEmailEntity(this);
    }
}


class TemporalEmailEntity {
    constructor(object) {
        Object.keys(object).forEach(key => this[key] = object[key]);
    }
}