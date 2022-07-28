import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer, token} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";
import { userSchema } from "../../schemas/user";


const listNotification = async(event, context) => {
    const { collections: [notificationModel, userModel] } = event.useMongo;
    const { payload } = event.useToken;
    
    const myUser = await userModel.findById(payload._id);
    const notification_ids =  myUser.notifications.map( notification => {
        return notification.notification_id;
    })
    console.log(notification_ids, 'truena');
    
    const myNotifications = await notificationModel.find({
        _id: { $in: notification_ids }
    });
    
    return myNotifications;
}

export const handler = use(listNotification, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin", "user"]
    }))
    .use(mongo({ 
    uri: process.env.MONGO_CONNECTION, 
    models: ["notifications", "users"], 
    schemas: {
        notifications: notificationSchema,
        users: userSchema,
    } 
}))
    .use(token(process.env.SECRET_KEY))