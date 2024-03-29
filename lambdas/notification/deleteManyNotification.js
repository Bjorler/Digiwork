import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, authorizer} from "@octopy/serverless-core";
import { notificationSchema } from "../../schemas/notification";


const deleteManyNotification = async(event, context) => {
    const { collections: [notificationModel] } = event.useMongo;
    const body = JSON.parse(event.body);
    console.log(body.ids);
    const notification = await notificationModel.deleteMany({_id: { $in: body.ids}});
    
    return notification;
}

export const handler = use(deleteManyNotification, { httpCodes, langConfig, translations })
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