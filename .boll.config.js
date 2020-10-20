"use strict";
const { bootstrapRecommendedConfiguration } = require('@boll/recommended');
bootstrapRecommendedConfiguration();

// First, define the rule.
// Must provide an object that responds to 'name' and 'check()' via a factory.

const path = require('path');
const { Failure } = require('@boll/core');

const sourceOnlyInSrcRule = {
    name: "SourceOnlyInSrcRule",
    check: async (file) => {
        const relativePath = file.filename.replace(file.packageRoot, '');
        const inSrc = relativePath.split(path.sep)[1] === 'src';
        if(inSrc) {
            return [];
        }
        else {
            return [new Failure("SourceOnlyInSrcRule", file.filename, 0, "Should be in 'src', but is in " + relativePath)];
        }
    }
};

// Next, register the rule.

const { RuleRegistryInstance } = require('@boll/core');
RuleRegistryInstance.register(sourceOnlyInSrcRule.name, () => sourceOnlyInSrcRule);


// Finally, make sure it's included.

const { TypescriptSourceGlob } = require('@boll/core');
module.exports = {
    extends: "boll:recommended",
    ruleSets: [
        {
            fileLocator: new TypescriptSourceGlob(),
            checks: [{ rule: sourceOnlyInSrcRule.name }]
        }
    ]
};
