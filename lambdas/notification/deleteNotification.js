import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";


const deleteNotification = async(event, context) => {
    const { collections: [notificationModel] } = event.useMongo;
    const id = event.pathParameters?.id;
    const notification = await notificationModel.findByIdAndDelete(id);
    
    return notification;
}

export const handler = use(deleteNotification, { httpCodes, langConfig, translations })
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