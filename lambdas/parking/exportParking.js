import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validateQueryParams } from "@octopy/serverless-core";
import { generateCSVFile } from "../../helpers/shared/generate-csv-file"
import { parkingSchema } from "../../schemas/parking";

const exportParking = async (event, context) => {
    const { collections: [parkingModel] } = event.useMongo;

    const parkings = await parkingModel.find().sort({ created_at: -1 });

    const date = new Date();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;

    const generated = await generateCSVFile({
        headers: [
            { id: "_id", title: "ID" },
            { id: "name", title: "Nombre" },
            { id: "location", title: "Ubicacion" },
            {id: "status", title: "Estatus"}
        ],
        content: parkings
    },
        `Estacionamiento_${day}-${month}-${date.getFullYear()}`)
    return {
        url: generated.url
    };
}

export const handler = use(exportParking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["parkings"],
        schemas: {
            users: parkingSchema
        }
    }))