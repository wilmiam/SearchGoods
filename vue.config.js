module.exports = {
    lintOnSave: false,
    publicPath: "./",
    // outputDir: "hello",
    configureWebpack: {
        //警告 webpack 的性能提示
        performance: {
            hints:false, //关闭webpack的性能提示
            // hints:'error',
            // 入口起点的最大体积
            // maxEntrypointSize: 1000000,
            // 生成文件的最大体积
            // maxAssetSize: 500000,
            // 只给出 js 文件的性能提示
            // assetFilter: function(assetFilename) {
            //     return assetFilename.endsWith('.js');
            // }
        }
    }
};