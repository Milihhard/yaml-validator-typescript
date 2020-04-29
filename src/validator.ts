import {ValidateOption, Yaml} from './interfaces';
import {isValidateOption} from './typeValidator';
import YamlRetriever from './utils/yamlRetriver';

export default class Validator<T> {
    private options: ValidateOption<T>;
    constructor(structure: T, options?: ValidateOption<T>);
    constructor(options: ValidateOption<T>);
    constructor(first: T | ValidateOption<T>, second?: ValidateOption<T>) {
        if (isValidateOption(first)) {
            this.options = first;
        } else {
            if (second) {
                this.options = second;
                this.options.stucture = first;
            } else {
                this.options = {stucture: first};
            }
        }
        if (!this.options.stucture) {
            throw new Error('The structure is empty');
        }
    }
    validateMany(...paths: string[]): Promise<string[]> {
        const promiseValidate: Promise<string[]>[] = [];
        paths.forEach((path) => {
            promiseValidate.push(this.validate(path));
        });
        return Promise.all(promiseValidate).then((results) => {
            return results.reduce((acc, result) => [...acc, ...result], []);
        });
    }

    validate(path: string): Promise<string[]> {
        return YamlRetriever.getYamlUtf8(path)
            .then((yaml) => {
                return this.compare('object', yaml, this.options.stucture);
            })
            .catch((e) => {
                return e;
            });
    }
    compareObject(object: any, source: any): string[] {
        const errors: string[] = [];
        // We take keyToTest if defined
        for (const key of object.keyToTest ? object.keyToTest : Object.keys(source)) {
            errors.push(...this.compare(key, object[key], source[key]));
        }
        return errors;
    }

    compareArray(object: any, source: any): string[] {
        const errors: string[] = [];
        const struct = source[0];
        object.forEach((item: any, index: number) =>
            errors.push(...this.compare(`[${index}]`, item, struct))
        );
        return errors;
    }

    compare(key: string, object: any, source: any): string[] {
        // Both primitives
        if (this.isPrimitive(object) && this.isPrimitive(source)) {
            return typeof source === typeof object ? [] : [key];
        }
        // Object null
        // Or one is primitive but not the other
        if (
            !object ||
            (this.isPrimitive(object) && !this.isPrimitive(source)) ||
            (!this.isPrimitive(object) && this.isPrimitive(source))
        ) {
            return [key];
        }
        if (source instanceof Array) {
            if (!(object instanceof Array)) {
                return [key];
            }
            return this.compareArray(object, source).map((err) => key + err);
        } else {
            return this.compareObject(object, source).map((err) => key + '.' + err);
        }
    }
    isPrimitive(object: any): boolean {
        const primitives = new Set(['string', 'number', 'boolean']);
        return primitives.has(typeof object);
    }
}
