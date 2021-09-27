const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const jsDir = './src/js/';
const jsFiles = fs.readdirSync(jsDir) // get all files in directory
	.filter(v => /^[^_].*(?<!\.esm)\.[a-z]*$/.test(v)) // filter out modules (starting with _ or ending in .esm.js) and directories
	.reduce((a, v) => ({ ...a, [path.parse(v).name]: jsDir + v }), {}); // create object from filenames

console.log(jsFiles);

module.exports = (env, {mode}) => ({
	mode: mode,
	entry: jsFiles,
	devtool: mode === 'development' ? 'source-map' : false,
	module: {
		rules: [
			{
				test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)$/i,
				type: 'asset/resource',
				generator: {
				  filename: '[name][ext]'
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: [
								["@babel/transform-runtime"]
							]
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		})
	],
	output: {
		path: path.resolve(__dirname, './assets'),
		filename: '[name].js',
		clean: true
	}
});
