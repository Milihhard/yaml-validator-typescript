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
const validator = new Validator(new Test());
const testValidate = (
    path: string,
    done: Mocha.Done,
    test: (result: string[]) => void
) => {
    validator
        .validate(path)
        .then((result) => {
            // tslint:disable-next-line: no-console
            console.log('result', result);
            test(result);
            done();
        })
        .catch((e) => {
            done(e);
        });
};
describe('Validator', () => {
    it('should be true', (done) => {
        testValidate(process.cwd() + '/test/good.yaml', done, (result) => {
            expect(result).to.have.length(0);
        });
    });
    it('should miss one', (done) => {
        testValidate(process.cwd() + '/test/wrongForgotOne.yaml', done, (result) => {
            expect(result).to.have.length(1);
        });
    });
    it('should have wrong object and array', (done) => {
        testValidate(process.cwd() + '/test/wrongArr.yaml', done, (result) => {
            expect(result).to.have.length(2);
        });
    });
    it('should be different', (done) => {
        testValidate(process.cwd() + '/test/wrong.yaml', done, (result) => {
            expect(result).not.to.have.length(0);
        });
    });
});
