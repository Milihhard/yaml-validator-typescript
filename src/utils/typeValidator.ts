import {ValidateOption, Yaml} from '../interfaces';

export function isValidateOption(object: any): object is ValidateOption<any> {
    return object && (object.structure !== undefined || object.verbose !== undefined);
}

export function isYaml(object: any): object is Yaml {
    return object && object.keysToTest !== undefined;
}
