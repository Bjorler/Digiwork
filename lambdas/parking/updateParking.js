import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody, authorizer} from "@octopy/serverless-core";
import { parkingSchema } from "../../schemas/parking";
import { updateParkingDTO } from "../../models/parking/updateParking";

const updateParking = async(event, context) => {
    const { collections: [parkingModel] } = event.useMongo;
    const id = event.pathParameters.id;
    const Body = event.body
    const parking = await parkingModel.findByIdAndUpdate(id,Body)

    return parking
}

export const handler = use(updateParking, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateBody(
        updateParkingDTO,
        translations
    ))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["parkings"],
        schemas: {
            parkings: parkingSchema
        } 
    }))