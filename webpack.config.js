const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "file-loader", query: {name: "bundle.css"} },
                    { loader: "extract-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    },
    devtool: 'source-map',
    target: 'web',
    devServer: {
        contentBase: './dist',
    }
}
