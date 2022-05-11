import { dayjs } from "@octopy/serverless-core";
import { TokenTools } from "@octopy/serverless-auth";

export class TemporalEmailBuilder {
    user_id = null;
    email = null;
    token = null;
    transformed_token = null;
    type = null;
    expiration_date = dayjs().add(Number(process.env.APP_PERSIST_TEMPORAL_EMAIL_IN_DB), "second");

    async setData(user_id, email, type, payload) {
        this.user_id = user_id;
        this.email = email;
        this.type = type;
        this.token = await TokenTools.generateJWT(payload, process.env.APP_EXPIRATION_TEMPORAL_TOKEN, process.env.SECRET_KEY);

        return this;
    }

    build() {
        this.transformed_token = TokenTools.transforDotToPesosSymbol(this.token);
        return new TemporalEmailEntity(this);
    }
}


class TemporalEmailEntity {
    constructor(object) {
        Object.keys(object).forEach(key => this[key] = object[key]);
    }
}