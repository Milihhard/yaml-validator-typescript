import {expect} from 'chai';
import {Yaml, Validator} from '../src';

class TestObject {
    constructor(public val1: boolean = true, public val2: number = 0) {}
}
// tslint:disable-next-line: max-classes-per-file
class Test {
    name: string = '';
    age: number = 0;
    arr: string[] = ['string'];
    obj: TestObject = new TestObject();
    arrOfObject: TestObject[] = [new TestObject()];
}
// tslint:disable-next-line: max-classes-per-file
class TestOnlyKeys implements Yaml {
    keysToTest: (keyof TestOnlyKeys)[] = ['key1', 'key2'];
    key1: string = '';
    key2: number = 0;
    keyNotToTest: boolean = false;
}

// tslint:disable-next-line: max-classes-per-file
class Optional implements Yaml {
    keysToTest: string[] = ['valueToHave', 'valueOptional', 'arrayOptional'];
    optionals: Set<string> = new Set(['valueOptional', 'arrayOptional']);
    valueToHave: string = '';
    valueOptional: string = '';
    arrayOptional: {valueYouNeed1: string; valueYouNeed2: boolean}[] = [
        {valueYouNeed1: '', valueYouNeed2: true},
    ];
}

// tslint:disable-next-line: max-classes-per-file
class TestWithOptional {
    key1: string = '';
    key2: Optional[] = [new Optional()];
}

const validator = new Validator(new Test());
const testValidate = (
    path: string,
    done: Mocha.Done,
    test: (result: string[]) => void,
    testFail?: (err: any) => void,
    shouldFail: boolean = false
) => {
    return validator
        .validate(path)
        .then((result) => {
            // tslint:disable-next-line: no-console
            console.log('result', result);
            if (test) {
                test(result);
            }
            setDone(done, shouldFail, 'Should fail');
        })
        .catch((e) => {
            if (testFail) {
                testFail(e);
            }
            setDone(done, !shouldFail, e);
        });
};
const setDone = (done: Mocha.Done, shouldFail: boolean = false, err: any) => {
    if (shouldFail) {
        done(err);
    } else {
        done();
    }
};
describe('Validator', () => {
    describe('Init', () => {
        it('Should not have a structure', () => {
            expect(() => new Validator(null)).to.throw('The structure is empty');
        });
        it('Should not have a structure with option', () => {
            expect(() => new Validator({verbose: true})).to.throw(
                'The structure is empty'
            );
        });
    });
    describe('Validate good', () => {
        it('Should be good with structure', (done) => {
            testValidate(process.cwd() + '/test/good.yaml', done, (result) => {
                expect(result).to.have.length(0);
            });
        });
        it('Should be good with option', (done) => {
            const val = new Validator({structure: new Test()});
            val.validate(process.cwd() + '/test/good.yaml')
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
        it('Should be good with both', (done) => {
            const val = new Validator(new Test(), {verbose: true});
            val.validate(process.cwd() + '/test/good.yaml')
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
        it('Should be good with selected keys', (done) => {
            const val = new Validator(new TestOnlyKeys());
            val.validate(process.cwd() + '/test/selectedKeys.yaml')
                .then((result) => {
                    // tslint:disable-next-line: no-console
                    console.log('res', result);

                    expect(result).to.have.length(0);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });
    describe('Validate error', () => {
        it('Validate multiple with one failed', (done) => {
            validator
                .validateMany(
                    process.cwd() + '/test/good.yaml',
                    process.cwd() + '/test/wrong.yaml'
                )
                .then((results) => {
                    // tslint:disable-next-line: no-console
                    console.log('res', results);

                    expect(results).to.have.length(2);
                    expect(results[0].name).to.be.equal(
                        process.cwd() + '/test/good.yaml'
                    );
                    expect(results[1].name).to.be.equal(
                        process.cwd() + '/test/wrong.yaml'
                    );
                    expect(results[0].results).to.have.length(0);
                    expect(results[1].results).not.to.have.length(0);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
        it('Should miss one', (done) => {
            testValidate(process.cwd() + '/test/wrongForgotOne.yaml', done, (result) => {
                expect(result).to.have.length(1);
            });
        });
        it('Should have wrong array and obj', (done) => {
            testValidate(process.cwd() + '/test/wrongArr.yaml', done, (result) => {
                expect(result).to.have.length(2);
            });
        });
        it('Should have wrong array because it`s an object', (done) => {
            testValidate(process.cwd() + '/test/wrongArrToObj.yaml', done, (result) => {
                expect(result).to.have.length(1);
            });
        });
        it('Should be different', (done) => {
            testValidate(process.cwd() + '/test/wrong.yaml', done, (result) => {
                expect(result).not.to.have.length(0);
            });
        });
        it('Should be malformed', (done) => {
            testValidate(
                process.cwd() + '/test/malformed.yaml',
                done,
                null,
                (err) => {
                    expect(err.name).to.be.equal('YAMLException');
                },
                true
            );
        });
        it('Should not exist', (done) => {
            testValidate(
                process.cwd() + '/test/unknown.yaml',
                done,
                null,
                (err) => {
                    expect(err.code).to.be.equal('ENOENT');
                },
                true
            );
        });
        it('Should be have error but not on optionnals', (done) => {
            const val = new Validator(new TestWithOptional());
            val.validate(process.cwd() + '/test/optional.yaml')
                .then((result) => {
                    // tslint:disable-next-line: no-console
                    console.log('res', result);

                    expect(result).to.have.length(1);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });
});
