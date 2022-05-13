import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model} from "@octopy/serverless-core";


const exportReservation = async(event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const user = await Model(userModel).getById(payload?._id);return {};
}

export const handler = use(exportReservation, { httpCodes, langConfig, translations })
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["users"] }))