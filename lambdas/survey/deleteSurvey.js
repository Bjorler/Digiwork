import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model} from "@octopy/serverless-core";
import { surveySchema } from "../../schemas/survey";


const deleteSurvey = async(event, context) => {
    const { collections: [surveyModel] } = event.useMongo;
    const id = event.pathParameters?.id;
     return await surveyModel.findByIdAndDelete(id);
}

export const handler = use(deleteSurvey, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(mongo({ 
        uri: process.env.MONGO_CONNECTION, 
        models: ["surveys"],
        schemas: surveySchema 
    }))