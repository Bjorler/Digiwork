import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validateQueryParams } from "@octopy/serverless-core";
import { generateCSVFile } from "../../helpers/shared/generate-csv-file"
import { locationSchema } from "../../schemas/location";

const exportLocation = async (event, context) => {
    const { collections: [locationModel] } = event.useMongo;

    const locations = await locationModel.find().sort({ created_at: -1 });

    const date = new Date();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

    const generated = await generateCSVFile({
        headers: [
            { id: "_id", title: "ID" },
            { id: "name", title: "Nombre" },
            { id: "address", title: "Direccion" }
        ],
        content: locations
    },
        `Ubicaciones_${day}-${month}-${date.getFullYear()}`)
    return {
        url: generated.url
    };
}

export const handler = use(exportLocation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["locations"],
        schemas: {
            users: locationSchema
        }
    }))