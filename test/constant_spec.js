var Optimizer = require("../optimizer").Optimizer;

describe("@constant", function () {
    it("replace variables with constant", function() {
        var optimizer = new Optimizer();
        var result = optimizer.optimize("./testdata/const_ok.js");
        expect(result.isOk).toBeTruthy();
    });

    it("replace variables with constant 1", function() {
        var optimizer = new Optimizer();
        var result = optimizer.optimize("./testdata/const_error.js");
        expect(result.isOk).toBeFalsy();
    });

    it("replace variables with constant 2", function() {
        var optimizer = new Optimizer();
        var result = optimizer.optimize("./testdata/const_error_2.js");
        expect(result.isOk).toBeFalsy();
    });
});
