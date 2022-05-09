import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, token } from "@octopy/serverless-core";

const logout = async (event) => {
    const { payload } = event.useToken;
    if (!payload) {
        throw { scode: "invalidToken" };
    }

    const { collections: [userModel, sessionModel] } = event.useMongo;
    const [user, session] = await Promise.all([
        Model(userModel).getById(payload?._id),
        Model(sessionModel).getByField("token", event.headers.Authorization?.replace('Bearer ', ''))
    ]);

    if (!user) {
        throw { scode: 'userDoesNotExist' };
    }
    if (!session) {
        throw { scode: 'sessionDoesNotExist' };
    }
    await Model(sessionModel).delete(session._id);

    return {};
};

export const handler = use(logout, { httpCodes, langConfig, translations })
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["users", "sessions"] }))
    .use(token(process.env.SECRET_KEY));