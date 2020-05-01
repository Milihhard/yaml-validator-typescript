export interface Yaml {
    keyToTest: string[];
}

export interface ValidateOption<T> {
    structure?: T;
    verbose?: boolean;
}

export interface CliConfig {
    structure: any;
    files?: string;
}
