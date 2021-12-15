module.exports = {
    overrides: [
        {
            extends: ['canonical/typescript'],
            files: '*.ts',
            parserOptions: {
                project: './tsconfig.json',
            },
            rules: {
                'indent': 'off',
                '@typescript-eslint/indent': ['error', 4, { SwitchCase: 1 }],
            },
        },
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['canonical', 'prettier'],
    rules: {
        'canonical/filename-match-exported': 0,
        'canonical/filename-match-regex': 0,
        'canonical/filename-no-index': 0,
        'canonical/no-restricted-strings': 0,
        'canonical/no-use-extend-native': 2,
        'canonical/sort-keys': [
            2,
            'asc',
            {
                caseSensitive: false,
                natural: true,
            },
        ],
        'indent': ['error', 4, { SwitchCase: 1 }],
    },
};
