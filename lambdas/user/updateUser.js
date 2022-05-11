import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody, validatePathParams, authorizer } from "@octopy/serverless-core";
import { userSchema } from "../../schemas/user";
import { mongoIdDTO } from "../../models/shared/mongoIdDTO";
import { updateUserDTO } from "../../models/user/updateUserDTO"

const updateUser = async (event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const { id } = event.pathParameters;

    const user = await userModel.findOneAndUpdate(
        { _id: id },
        event.body,
        {
            fields: ["_id", "name", "email", "phone", "is_admin", "public_id"],
            new: true,
        }
    )
    if (!user) {
        throw { scode: "userNotUpdated" }
    }
    return user;
}

export const handler = use(updateUser, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validatePathParams(mongoIdDTO, translations))
    .use(validateBody(updateUserDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["users"],
        schemas: {
            users: userSchema
        }
    }))