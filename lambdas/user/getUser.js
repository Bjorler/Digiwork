import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validatePathParams, mongooseTypes, authorizer } from "@octopy/serverless-core";
import { mongoIdDTO } from "../../models/shared/mongoIdDTO";
import { userSchema } from "../../schemas/user";

const getUser = async (event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const { id } = event.pathParameters;

    const user = await userModel
        .findOne({ _id: id })
        .select(["_id", "name", "email", "phone", "is_admin", "public_id"])

    if (!user) {
        throw { scode: "userNotFound" }
    }
    return user;
}

export const handler = use(getUser, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validatePathParams(mongoIdDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["users"],
        schemas: { users: userSchema }
    }))