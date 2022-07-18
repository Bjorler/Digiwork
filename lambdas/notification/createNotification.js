import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, validateBody} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";
import { createNotificationDTO } from "../../models/notification/createNotificationDTO";


const createNotification = async(event, context) => {
    const { collections: [notificationModel] } = event.useMongo;
    const message = event.body.message;
    const title = event.body.title;
    const notification = await notificationModel.create(event.body);


    if(!message || !title) throw {
        scode: 'createNotification'
    }
    
    return notification;
}

export const handler = use(createNotification, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))    
    .use(validateBody(createNotificationDTO, translations))    
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["notifications"],
        schemas: {
            notifications: notificationSchema
    } }))