const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const portFinderSync = require('portfinder-sync')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development'
    }
    
),
{
    devServer: {
        host: '0.0.0.0',
        port: portFinderSync.getPort(8080),
        contentBase: "/src/",
        static: "/src/",
        watchContentBase: true,
        open: true,
        https: false,
        useLocalIp: true,
        disableHostCheck: true,
        overlay: true,
        noInfo: true,
        inline: true,
        hot: true,
        after: function(app, server, compiler)
        {
            const port = server.options.port
            const https = server.options.https ? 's' : ''
            const localIp = ip.v4.sync()
            const domain1 = `http${https}://${localIp}:${port}`
            const domain2 = `http${https}://localhost:${port}`
      
            console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
        }
      }
    }
      

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}