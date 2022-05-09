import { RandomValuesGenerator } from "@octopy/serverless-core";
import { EncryptionTools } from "@octopy/serverless-auth";

export class UserBuilder {
    role = "user";
    userInfo = {};
    verificationPin = RandomValuesGenerator.generateNumber(6);
    verifiedAccount = false;
    deleted = false;

    setRole(role) {
        this.role = role;
        return this;
    };

    setUserInfo(info) {
        this.userInfo = { ...info };
        this.userInfo.password = !!this.userInfo?.password ?
            EncryptionTools.encryptPassword(this.userInfo.password) :
            undefined;
        return this;
    }

    build() {
        return new UserEntity(this);
    }
}

export class UserEntity {
    constructor(object) {
        Object.keys(object).filter(key => key !== "userInfo").forEach(key => this[key] = object[key]);
        Object.keys(object?.userInfo).forEach(key => {
            this[key] = object?.userInfo[key];
        });
    }
}
