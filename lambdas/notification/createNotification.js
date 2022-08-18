import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, validateBody} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";
import { createNotificationDTO } from "../../models/notification/createNotificationDTO";
import { userSchema } from "../../schemas/user";


const createNotification = async(event, context) => {
    const { collections: [notificationModel, userModel] } = event.useMongo;
    const message = event.body.message;
    const title = event.body.title;
    const many = event.body;
    const notification = await notificationModel.create(event.body);

    for (let index = 0; index < many.to.length; index++) {
        await userModel.updateOne(
            { _id: many.to[index] },
            { $push: { notifications: {
                notification_id: notification._id,
                readed: false
            } } }
        )   
        
    }

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
    .use(mongo({ uri: process.env.MONGO_CONNECTION, models: ["notifications", "users"],
        schemas: {
            notifications: notificationSchema,
            users: userSchema,
    } }))