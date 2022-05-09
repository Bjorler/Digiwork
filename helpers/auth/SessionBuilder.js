import { dayjs } from "@octopy/serverless-core";

export class SessionBuilder {
  userId = null;
  email = null;
  token = null;
  expirationDate = null;

  setInfo(userId, email, token) {
    this.userId = userId;
    this.email = email;
    this.token = token;
    this.expirationDate = dayjs().add(Number(process.env.SESSION_PERSIST_IN_BD), "second");
    return this;
  }

  build() {
    return new SessionEntity(this);
  }
}

export class SessionEntity {
  userId = null;
  email = null;
  token = null;
  expirationDate = null;

  constructor(object) {
    this.userId = object.userId;
    this.email = object.email;
    this.token = object.token;
    this.expirationDate = object.expirationDate;
  }
}
