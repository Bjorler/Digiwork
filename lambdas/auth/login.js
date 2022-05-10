import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody } from "@octopy/serverless-core";
import { EncryptionTools, TokenTools } from "@octopy/serverless-auth";
import { loginDTO } from "../../models/auth/loginDTO";
import { SessionBuilder } from "../../helpers/auth/SessionBuilder";
import { userSchema } from "../../schemas/user"
import { sessionSchema } from "../../schemas/session"
 
const login = async (event) => {
    const { collections: [userModel, sessionModel] } = event.useMongo;
    const [user, currentSession] = await Promise.all([
        Model(userModel).getByField("email", event.body.email),
        Model(sessionModel).getByField("email", event.body.email)
    ]);

    if (!user) {
        throw { scode: "userDoesNotExist" };
    }
    if (JSON.parse(process.env.SESSION_UNIQUE) && currentSession) {
        throw { scode: "userSessionUnique" };
    }
    if (!EncryptionTools.isSamePassword(event.body.password, user.password)) {
        throw { scode: "incorrectPassword" };
    }

    const { _id, role, email, phone, createdAt, name } = user;

    const dataAuth = {
        user: { _id, role, email, phone, createdAt, name },
        token: await TokenTools.generateJWT({ _id: user["_id"], role: user.role }, process.env.SESSION_EXPIRATION_TOKEN, process.env.SECRET_KEY)
    };

    const newSession = new SessionBuilder().setInfo(user["_id"], user.email, dataAuth.token).build();
    await Model(sessionModel).create(newSession);
    await userModel.updateOne({ _id: user._id }, { last_login: new Date(), updatedAt: Date.now() })

    return dataAuth;
};

export const handler = use(login, { httpCodes, langConfig, translations })
    .use(validateBody(loginDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION, models: ["users", "sessions"], schemas: {
            sessions: sessionSchema,
            users: userSchema
        }
    }));