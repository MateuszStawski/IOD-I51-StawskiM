const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'http://145.239.80.63:8080/',
    proxy: 'http://145.239.80.63:8080/*',
    proxy: 'http://145.239.80.63:8080',
    proxy: 'http://localhost:8080/*',
    proxy: 'http://localhost:8080',
    proxy: 'http://localhost:8081/*',
    proxy: 'http://localhost:8081/company/add/',
    proxy: 'http://localhost:8081/user/login/'

}

})
