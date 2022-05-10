import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody } from "@octopy/serverless-core";
import { recoveryPasswordResetDTO } from "../../models/auth/recoveryPasswordResetDTO";
import { TokenTools, EncryptionTools } from "@octopy/serverless-auth";
import { userSchema } from "../../schemas/user";
import { sessionSchema } from "../../schemas/session";
import { temporalEmailSchema } from "../../schemas/temporalEmails";

const recoveryPasswordReset = async (event) => {
    const emailToken = TokenTools.transformPesosSymbolToDot(event.body.token);
    const { _id, type } = TokenTools.getPayloadJWT(emailToken, process.env.SECRET_KEY, "invalidToken") || {};
    if (!_id || !type || !!type && type !== "recoveryPassword") {
        throw { scode: "invalidToken" };
    }

    const { collections: [userModel, sessionModel, temporalEmailModel] } = event.useMongo;

    const [user, emailInfo] = await Promise.all([
        Model(userModel).getById(_id),
        Model(temporalEmailModel).getByField("token", emailToken)
    ]);

    if (!emailInfo) {
        throw { scode: "NoRecoveryPasswordRequest" };
    }
    if (!user) {
        throw { scode: "userDoesNotExist" };
    }
    if (EncryptionTools.isSamePassword(event.body.password, user?.password)) {
        throw { scode: "isCurrentPassword" };
    }

    const newPassword = EncryptionTools.encryptPassword(event.body.password);

    await Model(userModel).updateById(_id, { password: newPassword });

    await Promise.all([
        Model(temporalEmailModel).delete(emailInfo._id),
        Model(sessionModel).deleteAllByField("email", user.email)
    ]);

    return {};
};

export const handler = use(recoveryPasswordReset, { httpCodes, langConfig, translations })
    .use(validateBody(recoveryPasswordResetDTO, translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["users", "sessions", "temporalemails"], 
        schemas: {
            users: userSchema,
            sessions: sessionSchema,
            temporalemails: temporalEmailSchema
        }
    }));