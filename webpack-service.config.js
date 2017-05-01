const path = require('path');

module.exports = {
    entry: './src/service-index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'servicebundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader'
            }
        ]
    },
    target: 'web'
}