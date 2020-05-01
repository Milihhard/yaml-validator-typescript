class TestObject {
    constructor() {
        this.val1 = true;
        this.val2 = 0;
    }
}
class CliTest {
    constructor() {
        this.name = '';
        this.age = 0;
        this.arr = ['string'];
        this.obj = new TestObject();
        this.arrOfObject = [new TestObject()];
    }
}

module.exports = {
    structure: new CliTest(),
    files: ['cli-test.yaml', 'test/wrong.yaml', 'test/wrongArr.yaml'],
};
