export class ValidateObjectId {
    static match(id) {
        return id.match(/^[0-9a-fA-F]{24}$/);
    }
}

export const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!¿@(.)$=%^/&¡*-]).{8,}$/);

export const urlRegex = new RegExp(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);

export const objectIdRegex = new RegExp("^[0-9a-fA-F]{24}$");

export const onlyNumbers = /^\d+$/;


