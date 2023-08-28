const Timestamp = new Date();
module.exports = {
	publicPath: './',
	outputDir: 'YDJ-' + (Timestamp.getMonth()+1) + '-' + Timestamp.getDate() + '_' + Timestamp.getHours() + '_' + Timestamp.getMinutes() + '_' + Timestamp.getSeconds(),
	lintOnSave: true,
	runtimeCompiler: true,
	chainWebpack: () => {},
	configureWebpack: { 
		output: { 
			filename: `js/[name].js?${Timestamp.getTime()}`,
			chunkFilename: `js/[name].js?${Timestamp.getTime()}`
		},
	},
	productionSourceMap:false,
	devServer: {
		port: 1555,
	},
}
