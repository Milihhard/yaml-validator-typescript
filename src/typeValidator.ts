import {ValidateOption} from './interfaces';

export function isValidateOption(object: any): object is ValidateOption<any> {
    return object.stucture !== undefined;
}
