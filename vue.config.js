const path = require('path')
const resolve = dir => {
    return path.join(__dirname, dir)
}
module.exports = {
    configureWebpack: {
        // 文件夹通过@定位到src
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, 'src/styles/_variables.less')
            ]
        }
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://www.mock.com', // 对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        open: true
    }
}
