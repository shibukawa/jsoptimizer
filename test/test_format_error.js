var Optimizer = require("../optimizer").Optimizer;

describe("Format error", function () {
    it("doesn't optimize when there is error", function () {
        var optimizer = new Optimizer();
        expect(optimizer.optimize("../testdata/syntax_error.js")).toBeTruthy();
    });
});
