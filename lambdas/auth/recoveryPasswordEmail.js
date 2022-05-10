import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody } from "@octopy/serverless-core";
import { AuthEmailRepository } from "../../helpers/auth/AuthEmailRepository";
import { TemporalEmailBuilder } from "../../helpers/auth/TemporalEmailBuilder";
import { recoveryPasswordEmailDTO } from "../../models/auth/recoveryPasswordEmailDTO";
import { temporalEmailSchema } from "../../schemas/temporalEmails";
import { userSchema } from "../../schemas/user";

const recoveryPasswordEmail = async (event) => {
    const { collections: [userModel, temporalemailsModel] } = event.useMongo;
    
    const user = await Model(userModel).getByField("email", event.body.email)

    if (!user) {
        throw { scode: "userDoesNotExist" };
    }

    const tmpEmail = await new TemporalEmailBuilder().setData(user._id, user.email, "recoveryPassword", {
        _id: user._id, type: "recoveryPassword"
    });
    tmpEmail.build();
    await Model(temporalemailsModel).create(tmpEmail);

    await new AuthEmailRepository("recoverPassword", "Recupera tu contraseña", {
        email: tmpEmail.email,
        link: `${process.env.APP_FRONTEND_BASE_URL}${process.env.APP_FRONTEND_RECOVERY_PASS_ENDPOINT}?token=${tmpEmail.transformedToken}`,
    }).sendEmail();

    return {};
};

export const handler = use(recoveryPasswordEmail, { httpCodes, langConfig, translations })
    .use(validateBody(recoveryPasswordEmailDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION, models: ["users", "temporalemails"], schemas: {
            temporalemails: temporalEmailSchema,
            users: userSchema
        }
    }));