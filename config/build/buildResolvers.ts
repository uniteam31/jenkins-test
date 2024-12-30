import { WebpackConfiguration } from 'webpack-cli';
import { BuildOptions } from './types/config';

export const BuildResolvers = (options: BuildOptions): WebpackConfiguration['resolve'] => {
	return {
		extensions: ['.tsx', '.ts', '.js'],
		// настройки для работы абсолютных путей
		preferAbsolute: true,
		modules: [options.paths.src, 'node_modules'],
		mainFiles: ['index'],
		alias: {},
	};
};
