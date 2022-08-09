import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model} from "@octopy/serverless-core";
import { surveySchema } from "../../schemas/survey";
import { createSurveyDTO } from "../../models/room/createSurveyDTO";


const createSurvey = async(event, context) => {
    const { collections: [userModel] } = event.useMongo;
    return await Model(userModel).create(event.body);
}

export const handler = use(createSurvey, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateBody(
        createSurveyDTO,
        translations
    ))    
    .use(mongo({
            uri: process.env.MONGO_CONNECTION, 
            models: ["surveys"],
            schemas: {
                surveys: surveySchema
            }
            }))