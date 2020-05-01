import {ValidateOption, Yaml} from './interfaces';
import {isValidateOption, isYaml} from './utils/typeValidator';
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
                this.options.structure = first;
            } else {
                this.options = {structure: first};
            }
        }
        if (!this.options.structure) {
            throw new Error('The structure is empty');
        }
    }
    validateMany(...paths: string[]): Promise<{name: string; results: string[]}[]> {
        const promiseValidate: Promise<string[]>[] = [];
        paths.forEach((path) => {
            promiseValidate.push(this.validate(path));
        });
        return Promise.all(promiseValidate).then((results) => {
            return results.map((result, index) => ({
                name: paths[index],
                results: result,
            }));
        });
    }

    validate(path: string): Promise<string[]> {
        return YamlRetriever.getYamlUtf8(path).then((yaml) => {
            return this.compare('object', yaml, this.options.structure);
        });
    }
    private compareObject(object: any, source: any): string[] {
        if (this.options.verbose) {
            // tslint:disable-next-line: no-console
            console.log('compareObject', object, source);
        }
        const errors: string[] = [];
        // We take keysToTest if defined
        for (const key of isYaml(source) ? source.keysToTest : Object.keys(source)) {
            const errorOfItem = this.compare(key, object[key], source[key]);
            if (
                !(
                    errorOfItem.length > 0 &&
                    errorOfItem[0].split('.').pop() === key &&
                    isYaml(source) &&
                    source.optionals &&
                    source.optionals.has(key)
                )
            ) {
                errors.push(...errorOfItem);
            }
        }
        return errors;
    }

    private compareArray(object: any, source: any): string[] {
        if (this.options.verbose) {
            // tslint:disable-next-line: no-console
            console.log('compareArray', object, source);
        }
        const errors: string[] = [];
        const struct = source[0];
        object.forEach((item: any, index: number) =>
            errors.push(...this.compare(`[${index}]`, item, struct))
        );
        return errors;
    }

    private compare(key: string, object: any, source: any): string[] {
        if (this.options.verbose) {
            // tslint:disable-next-line: no-console
            console.log('compare', key);
        }
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
    private isPrimitive(object: any): boolean {
        const primitives = new Set(['string', 'number', 'boolean']);
        return primitives.has(typeof object);
    }
}
