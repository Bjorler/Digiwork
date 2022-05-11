import { dayjs } from "@octopy/serverless-core";

export class SessionBuilder {
  user_id = null;
  email = null;
  token = null;
  expiration_date = null;

  setInfo(user_id, email, token) {
    this.user_id = user_id;
    this.email = email;
    this.token = token;
    this.expiration_date = dayjs().add(Number(process.env.SESSION_PERSIST_IN_BD), "second");
    return this;
  }

  build() {
    return new SessionEntity(this);
  }
}

export class SessionEntity {
  user_id = null;
  email = null;
  token = null;
  expiration_date = null;

  constructor(object) {
    this.user_id = object.user_id;
    this.email = object.email;
    this.token = object.token;
    this.expiration_date = object.expiration_date;
  }
}
