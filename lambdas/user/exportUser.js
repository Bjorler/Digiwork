import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validateQueryParams } from "@octopy/serverless-core";
import { generateCSVFile } from "../../helpers/shared/generate-csv-file"
import { filterNameDTO } from "../../models/shared/filtersDTO";
import { userSchema } from "../../schemas/user";

const exportUser = async (event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const name = event.queryStringParameters.name || "";

    const users = await userModel.find({
        name: { $regex: name, $options: "i" }
    }).sort({ created_at: -1 });

    const date = new Date();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

    const generated = await generateCSVFile({
        headers: [
            { id: "public_id", title: "ID" },
            { id: "name", title: "Nombre" },
            { id: "email", title: "Correo" },
            { id: "phone", title: "Teléfono" },
            { id: "is_admin", title: "Es Admin" },
        ],
        content: users
    },
        `Usuarios_${day}-${month}-${date.getFullYear()}`)
    return {
        url: generated.url
    };
}

export const handler = use(exportUser, { httpCodes, langConfig, translations })
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