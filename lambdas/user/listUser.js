import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateQueryParams, authorizer } from "@octopy/serverless-core";
import { userSchema } from "../../schemas/user";
import { filterNameDTO } from "../../models/shared/filtersDTO"


const listUser = async (event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const name = event.queryStringParameters.name || "";

    return await userModel
        .find({ 
            name: { $regex: name, $options: "i" } 
        })
        .sort({ created_at: -1 })
        .select(["_id", "name", "email", "phone", "is_admin", "public_id"]);
}

export const handler = use(listUser, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateQueryParams(filterNameDTO, translations, { applyAutoparser: false }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["users"],
        schemas: {
            users: userSchema
        }
    }))