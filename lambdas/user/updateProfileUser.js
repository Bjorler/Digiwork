import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, token, authorizer, validateBody } from "@octopy/serverless-core";
import { userSchema } from "../../schemas/user";
import { updateProfileUserDTO } from "../../models/user/updateUserDTO";

const updateProfileUser = async (event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const { payload } = event.useToken;

    const existEmail = await Model(userModel).getByField("email", event.body.email);

    if (existEmail && existEmail?._id?.toString() !== payload?._id) {
        throw { scode: "emailExistent" }
    };

    const user = await userModel.findOneAndUpdate(
        { _id: payload?._id },
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

export const handler = use(updateProfileUser, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(validateBody(updateProfileUserDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["users"],
        schemas: {
            users: userSchema
        }
    }))
    .use(token(process.env.SECRET_KEY));