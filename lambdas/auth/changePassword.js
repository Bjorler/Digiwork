import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, token, validateBody } from "@octopy/serverless-core";
import { EncryptionTools } from "@octopy/serverless-auth";
import { changePasswordDTO } from "../../models/auth/changePasswordDTO";

const changePassword = async (event) => {
    const { payload } = event.useToken;
    if (!payload) {
        throw { scode: "invalidToken" };
    }

    const { collections: [userModel, sessionModel] } = event.useMongo;
    const [user, session] = await Promise.all([
        Model(userModel).getById(payload?._id),
        Model(sessionModel).getByField("token", event.headers.Authorization?.replace('Bearer ', ''))
    ]);

    if (!session) {
        throw { scode: "sessionDoesNotExist" }
    };
    if (!user) {
        throw { scode: "userDoesNotExist" }
    };
    if (EncryptionTools.isSamePassword(event.body.password, user?.password)) {
        throw { scode: "isCurrentPassword" };
    }

    const encryptedPass = EncryptionTools.encryptPassword(event.body.password);

    await Model(userModel).updateById(payload?._id, { password: encryptedPass });

    return {};
};

export const handler = use(changePassword, { httpCodes, langConfig, translations })
    .use(validateBody(changePasswordDTO, translations))
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["users", "sessions"] }))
    .use(token(process.env.SECRET_KEY));