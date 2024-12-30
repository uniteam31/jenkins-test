import { WebpackConfiguration } from 'webpack-cli';
import { BuildOptions } from './types/config';

export const BuildDevServer = ({ port }: BuildOptions): WebpackConfiguration['devServer'] => {
	return {
		port: port,
		historyApiFallback: true, // чтобы не падало при перезагрузке на маршруте
		hot: true,
	};
};
