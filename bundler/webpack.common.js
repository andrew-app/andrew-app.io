const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
    entry: path.resolve(__dirname, '../src/multicanv.ts'),
    mode: 'development',
    output:
    {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
        devtool: 'source-map',
        plugins:[
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../static') }
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                minify: true
            }),
            new MiniCSSExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },
            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            },

            {
                test: /\.(gltf)$/,
                use: [
                  {
                    loader: "gltf-webpack-loader"
                  }
                ]
            },

            {
                test: /\.(bin)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {}
                  }
                ]
            }
        ],

    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    }
        
}
