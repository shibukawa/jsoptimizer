var Optimizer = require("../optimizer").Optimizer;

describe("Format error", function () {
    it("doesn't optimize when there is error", function () {
        var optimizer = new Optimizer();
        var result = optimizer.optimize("./testdata/syntax_error.js")
        expect(result.isOk).toBeFalsy();
    });

    it("optimizes when there is no error", function () {
        var optimizer = new Optimizer();
        var result = optimizer.optimize("./testdata/syntax_ok.js")
        expect(result.isOk).toBeTruthy();
    });
});
