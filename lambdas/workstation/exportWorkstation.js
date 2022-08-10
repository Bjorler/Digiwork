import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer, validateQueryParams } from "@octopy/serverless-core";
import { generateCSVFile } from "../../helpers/shared/generate-csv-file"
import { workStationSchema } from "../../schemas/workStation";

const exportWorkstation = async (event, context) => {
    const { collections: [workstationModel] } = event.useMongo;

    const workstations = await workstationModel.aggregate([
        { $lookup: {
            from: 'locations',
            localField: 'location',
            foreignField: '_id',
            as: 'location'
            }
        },
        { 
            $unwind: '$location' 
        },
        {
            $project: {
                name: 1,
                location: '$location.name',
                status: '$status'
            }
        }
    ]);

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
        content: workstations
    },
        `Espacios_De_Trabajo_${day}-${month}-${date.getFullYear()}`)
    return {
        url: generated.url
    };
}

export const handler = use(exportWorkstation, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["work_stations"],
        schemas: {
            users: workStationSchema
        }
    }))