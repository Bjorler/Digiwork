import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, validateBody, authorizer} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";
import { updateNotificationDTO } from "../../models/notification/updateNotificationDTO";


const updateNotification = async(event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const id = event.pathParameters?.id;
    const body = event.body;
    const notification = await userModel.findByIdAndUpdate(id, body);
    
    return notification;
}

export const handler = use(updateNotification, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    })) 
    .use(validateBody(updateNotificationDTO, translations))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["notifications"], 
        schemas: {
            notifications: notificationSchema
        }
    }))