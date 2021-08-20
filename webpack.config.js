const path = require('path')

module.exports = {
    devtool: 'source-map',
    entry: ['./src/bundle.tsx'],
    mode: 'development',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.tsx'],
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            }
        ]
    }
};