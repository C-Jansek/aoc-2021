module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'sonarjs', 'unicorn'],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'google',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    env: {
        node: true,
        es6: true,
    },
    rules: {
        'indent': ['error', 4, { SwitchCase: 1 }],
        'max-len': [
            'error',
            100,
            {
                ignoreTemplateLiterals: true,
            },
        ],
        'object-curly-spacing': ['error', 'always'],
        'linebreak-style': 'off',
        'brace-style': ['error', 'stroustrup'],
        'require-jsdoc': [
            'error',
            {
                require: {
                    ClassDeclaration: false,
                },
            },
        ],
        'unicorn/no-null': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/no-array-reduce': 'off',
        'operator-linebreak': 'off',
        'no-undefined': 'error',
        'unicorn/prefer-default-parameters': 'off',
        'unicorn/prefer-node-protocol': 'off',
    },
    overrides: [
        {
            files: ['package.json', 'package-lock.json'],
            rules: {
                indent: ['error', 2],
            },
        },
    ],
};
