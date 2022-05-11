import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validatePathParams, authorizer, token } from "@octopy/serverless-core";
import { mongoIdDTO } from "../../models/shared/mongoIdDTO"
import { userSchema } from "../../schemas/user";

const deleteUser = async (event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const { id } = event.pathParameters;
    const { payload } = event.useToken;

    if (id === payload?._id) {
        throw { scode: "deleteMyselfError" }
    }

    const deletedUser = await Model(userModel).delete(id);
    if (!deletedUser) {
        throw { scode: "userNotDeleted" }
    }

    const { _id, email, name, phone, is_admin, public_id } = deletedUser;
    return { _id, email, name, phone, is_admin, public_id }
}

export const handler = use(deleteUser, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validatePathParams(mongoIdDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["users"],
        schemas: {
            users: userSchema
        }
    }))
    .use(token(process.env.SECRET_KEY));