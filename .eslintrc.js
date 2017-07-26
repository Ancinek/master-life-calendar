module.exports = {
    "plugins": [
        "react"
    ],
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "comma-dangle": ["error", {
            "arrays": "never",
            "objects": "never",
            "imports": "never",
            "exports": "never",
            "functions": "ignore"
        }],
        "indent": ["error", 4],
        "quotes": ["error", "double", {"allowTemplateLiterals": true}],
        "semi": ["error", "always"],
        "no-unused-vars": ["warn"],
        "no-console": 0
    }
};