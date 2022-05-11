import { langConfig, translations, httpCodes } from "../../commonIncludes";
import { use, mongo, Model, validateBody, authorizer } from "@octopy/serverless-core";
import { userSchema } from "../../schemas/user";
import { createUserDTO } from "../../models/user/createUserDTO";
import { createPassword } from "../../helpers/auth/createPassword";
import { AuthEmailRepository } from "../../helpers/auth/AuthEmailRepository"
import { EncryptionTools } from "@octopy/serverless-auth";

const createUser = async (event, context) => {
    const { collections: [userModel] } = event.useMongo;
    const existEmail = await Model(userModel).getByField("email", event.body.email);

    if (existEmail) {
        throw { scode: "emailExistent" }
    };
    const password = createPassword()

    const user = await Model(userModel).create({
        ...event.body,
        password: EncryptionTools.encryptPassword(password)
    });
    // console.log(password)

    await new AuthEmailRepository("dataLogin", "Credenciales de acceso a Digiwork", {
        home: process.env.APP_FRONTEND_BASE_URL,
        email: event.body.email,
        pass: password,
    }).sendEmail();

    return {
        email: user.email,
        is_admin: user.is_admin,
        name: user.name,
        public_id: user.public_id,
        phone: user.phone
    }
}

export const handler = use(createUser, { httpCodes, langConfig, translations })
    .use(authorizer({
        uriDB: process.env.MONGO_CONNECTION, secretKey: process.env.SECRET_KEY,
        roles: ["admin"]
    }))
    .use(validateBody(createUserDTO, translations))
    .use(mongo({
        uri: process.env.MONGO_CONNECTION,
        models: ["users"],
        schemas: {
            users: userSchema
        }
    }))