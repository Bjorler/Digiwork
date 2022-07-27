import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";


const listNotification = async(event, context) => {
    const { collections: [notificationModel] } = event.useMongo;
    const notification = await notificationModel.find();
    
    return notification;
}

export const handler = use(listNotification, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ 
    uri: process.env.MONGO_CONNECTION, 
    models: ["notifications"], 
    schemas: {
        notifications: notificationSchema
    } 
}));