const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports={
    entry:'./src/game.ts',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js',
    },
    module:{
        rules:[{
            test:/\.ts$/,
            use:'ts-loader',
            include: path.resolve(__dirname,'src')
        }]
    },
    devServer:{
        static:{
            directory:path.resolve(__dirname,'./'),
        },
        open:true,
        port: 8080,
        host:'localhost'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins:[
        new HTMLWebpackPlugin({
            template:"./index.html"
        }),
        new CopyPlugin({
             patterns: [{ from: "assets", to: "assets" }],
        }),
    ]
}