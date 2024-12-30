import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { WebpackConfiguration } from 'webpack-cli';
import { BuildOptions } from './types/config';

export const BuildPlugins = ({
	paths,
	isDev,
	apiUrl,
}: BuildOptions): WebpackConfiguration['plugins'] => {
	return [
		new HtmlWebpackPlugin({
			template: paths.html,
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			chunkFilename: 'css/[name].[contenthash:8].css',
		}),
		new webpack.DefinePlugin({
			__IS_DEV__: JSON.stringify(isDev),
			__API_URL__: JSON.stringify(apiUrl),
		}),
		new webpack.ProgressPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	];
};
