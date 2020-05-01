export interface Yaml {
    keysToTest: string[];
}

export interface ValidateOption<T> {
    structure?: T;
    verbose?: boolean;
}

export interface CliConfig {
    structure: any;
    files?: string;
}
