# yaml-validator-typescript

[![Coverage Status](https://coveralls.io/repos/github/Milihhard/yaml-validator-typescript/badge.svg?branch=master)](https://coveralls.io/github/Milihhard/yaml-validator-typescript?branch=master) ![Testing app](https://github.com/Milihhard/yaml-validator-typescript/workflows/Testing%20app/badge.svg) ![Building](https://github.com/Milihhard/yaml-validator-typescript/workflows/Building/badge.svg) ![Publish to npm](https://github.com/Milihhard/yaml-validator-typescript/workflows/Publish%20to%20npm/badge.svg)

yaml-validator-typescript is a way to validate your Yaml file by using a defined model

## Installation

```bash
$npm install yaml-validator-typescript
```

or

```bash
$yarn add yaml-validator-typescript
```

## Usage

## Define your modele

You can set you model as you want. You just need to have properties initialized

If you don't want some property to be tested, you can implement `Yaml`

```javascript
class TestOnlyKeys implements Yaml {
    keysToTest: (keyof TestOnlyKeys)[] = ['key1', 'key2'];
    key1: string = '';
    key2: number = 0;
    keyNotToTest: boolean = false;
}
```

> Here only `key1` and `key2` are tested
> You can also set some properties optionals:

```javascript
class Optional implements Yaml {
    keysToTest: string[] = ['valueToHave', 'valueOptional', 'arrayOptional'];
    optionals: Set<string> = new Set(['valueOptional', 'arrayOptional']);
    valueToHave: string = '';
    valueOptional: string = '';
    arrayOptional: {valueYouNeed1: string, valueYouNeed2: boolean}[] = [
        {valueYouNeed1: '', valueYouNeed2: true},
    ];
}
```

> Here `valueOptional` and `arrayOptional` are optionals
> But if `arrayOptional` is defined, he has to be right

### As a command

Set a config file at the root of the project:

```javascript
import MyClass from './somewhere';
module.exports = {
    structure: new MyClass(),
    files: ['file1.yaml', 'file2.yaml'],
};
```

Then run the command

```json
{
    "scripts": {
        "valid-yaml": "validate-yaml"
    }
}
```

> If you have not set the files, you can put them in the command

```json
{
    "scripts": {
        "valid-yaml": "validate-yaml file1.yaml file2.yaml"
    }
}
```

### In your code

```typescript
import MyClass from './somewhere';
const validator = new Validator(new MyClass());
validator.validate('path_of_my_file.yaml').then((errors) => {
    if (errors.length > 0) {
        console.log('I have some issues I need to fix 🙀');
        errors.forEach((error) => {
            console.log(`- ${result}`);
        });
    } else {
        console.log('No Error in this code 💪');
    }
});
```

You can validate multiple file at the same time with the same validator

```typescript
import MyClass from './somewhere';
const validator = new Validator(new MyClass());
validator
    .validateMany('path_of_my_file.yaml', 'another_path_of_my_file.yaml')
    .then((results) => {
        files.forEach((file) => {
            console.log(`${file.name}:`);
            if (file.results.length > 0) {
                console.log('I have some issues I need to fix 🙀');
                file.results.forEach((error) => {
                    console.log(`- ${result}`);
                });
            } else {
                console.log('No Error in this code 💪');
            }
        });
    });
```
