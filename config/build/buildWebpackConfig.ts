import { WebpackConfiguration } from 'webpack-cli';
import { BuildDevServer } from './buildDevServer';
import { BuildLoaders } from './buildLoaders';
import { BuildPlugins } from './buildPlugins';
import { BuildResolvers } from './buildResolvers';
import { BuildOptions } from './types/config';

export const BuildWebpackConfig = (options: BuildOptions): WebpackConfiguration => {
	const { mode, paths } = options;

	return {
		module: {
			rules: BuildLoaders(options),
		},
		resolve: BuildResolvers(options),
		entry: paths.entry,
		output: {
			filename: '[name][contenthash].js',
			path: paths.build,
			clean: true,
			publicPath: '/',
		},
		mode: mode,
		plugins: BuildPlugins(options),
		devServer: BuildDevServer(options),
		ignoreWarnings: [
			{
				message: /Deprecation/,
			},
		],
	};
};
