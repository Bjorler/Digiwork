import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, authorizer} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";


const listAllNotifications = async(event, context) => {
    const { collections: [notificationModel] } = event.useMongo;
    const notifications = await Model(notificationModel).getAll();
    
    return notifications;
}

export const handler = use(listAllNotifications, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))    
    .use(mongo({
            uri: process.env.MONGO_CONNECTION, 
            models: ["notifications"],
            schemas: notificationSchema }))