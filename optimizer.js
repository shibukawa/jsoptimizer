var fs = require('fs');
var jshint = require('./jshint').JSHINT;


var Optimizer = function() {
    function init()
    {
        errors = [];
    }

    var JsdocTypes = {
        Var: 1,
        Function: 2,
        Class: 3 
    };

    var JsdocTags = {
        "@class": JsdocTypes.Class,
        "@arguments": JsdocTypes.Class,
        "@lends": JsdocTypes.Class,
        "@static": JsdocTypes.Class,
        "@property": JsdocTypes.Class,
        "@method": JsdocTypes.Method,
        "@param": JsdocTypes.Method,
        "@returns": JsdocTypes.Method,
        "@function": JsdocTypes.Method,
        "@constant": JsdocTypes.Var,
        "@field": JsdocTypes.Var
    };

    var split_jsdoc_directive = function (directive)
    {
        var words = directive.split(/\s+/);
        if (words.length === 1)
        {
            return [words[0], ""];
        }
        else
        {
            return [words[0], words.slice(1).join(" ")];
        }
    };

    var formalize_jsdoc = function (tokens, jsdocs)
    {
        var token_index = 0;
        for (var i = 0; i < jsdocs.length; i++)
        {
            var jsdoc = jsdocs[i];
            for (;;)
            {
                var token = tokens[token_index];
                if (token.line > jsdoc.line)
                {
                    jsdoc.token_index = token_index;
                    break;
                }
                token_index++;
            }
            var directives = jsdoc.directives;
            jsdoc.type = null;
            var firstdirective = null;
            for (var j = 0; j < directives.length; j++)
            {
                var directive = directives[j] = split_jsdoc_directive(directives[j]);
                var tmptype = JsdocTags[directive[0]];
                if (!tmptype)
                {
                    continue;
                }
                if (jsdoc.type === null)
                {
                    firstdirective = directive[0];
                    jsdoc.type = tmptype;
                }
                else
                {
                    if (jsdoc.type !== tmptype)
                    {
                        errors.push("line " + jsdoc.line + ": JSDoc tag types(" + jsdoc.type + " and " + tmptype + ") are conflict");
                    }
                }
            }
            jsdoc.has = function(typename)
            {
                var directives = this.directives;
                for (var i = 0; i < directives.length; ++i)
                {
                    if (directives[i][0] === typename)
                    {
                        return true;
                    }
                }
                return false;
            }
        }
    };

    var optimize_with_jsdoc = function (tokens, jsdocs)
    {
        formalize_jsdoc(tokens, jsdocs);
        for (var i = 0; i < jsdocs.length; i++)
        {
            var jsdoc = jsdocs[i];
            switch(jsdoc.type)
            {
            case JsdocTypes.Class:
                console.log("class");
                break;
            case JsdocTypes.Method:
                console.log("method");
                break;
            case JsdocTypes.Var:
                if (jsdoc.has("@construct") !== -1 && tokens[jsdoc.token_index + 1].value === "var")
                {
                    var index = jsdoc.token_index + 1;
                    var variable_name = tokens[index + 1].value;
                    var variable_value = tokens[index + 1].first.value;
                    console.log(variable_name + " => " + variable_value);
                    for (;;) {
                        var token = tokens[index];
                        index++;
                        token.unuse = true;
                        if (token.value === ";")
                        {
                            break;
                        }
                    }
                    curly = 0;
                    for (;;) {
                        var token2 = tokens[index];
                        var skip = false;
                        if (!token2)
                        {
                            break;
                        }
                        else if (token2.value === "{")
                        {
                            curly++;
                        }
                        else if (token2.value === "}")
                        {
                            curly--;
                            if (curly < -1)
                            {
                                break;
                            }
                        }
                        else if (token2.value === variable_name && token2.identifier && !skip)
                        {
                            token2.value = variable_value;
                        }
                        skip = (token2.value === ".");
                        index++;
                    }
                }
                break;
            }
        }
    };
    
    var generate = function (tokens)
    {
        console.log("generate:");
        result = [];
        var last_is_identifier = false;
        for (var i = 0; i < tokens.length; i++)
        {
            var token = tokens[i];
            if (!token.unuse)
            {
                var is_identifier = (token.type === "(identifier)");
                if (last_is_identifier && is_identifier)
                {
                    result.push(" ");
                }
                result.push(token.value);
                last_is_identifier = is_identifier;
            }
        }
        console.log(result.join(""));
    };

    this.optimize = function (data)
    {
        jshint(data);
        var tokens = jshint.tokens();
        var jsdocs = jshint.jsdocs();
        optimize_with_jsdoc(tokens, jsdocs);
        console.log(jsdocs);
        generate(tokens);
    };

    init.call(this);
};


function main(path)
{
    fs.readFile(path, "utf-8", function (err, data) {
        if (err) throw err;
        optimizer = new Optimizer;
        optimizer.optimize(data);
    });
}

if (process.argv.length !== 3)
{
    console.log("usage:");
    console.log("    node optimize.js [javascript-source-path]");
}
else
{
    main(process.argv[2]);
}
