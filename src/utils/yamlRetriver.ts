import yaml from 'js-yaml';
import fs from 'fs';

export default class YamlRetriever {
    static getYamlUtf8(path: string | number | Buffer | URL): Promise<any> {
        return this.getYaml(path, 'utf8');
    }
    static getYaml(
        path: string | number | Buffer | URL,
        options:
            | string
            | {
                  encoding: string;
                  flag?: string;
              }
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                resolve(yaml.safeLoad(fs.readFileSync(path, options)));
            } catch (e) {
                reject(e);
            }
        });
    }
}
