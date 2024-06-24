/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const devMode = process.env.NODE_ENV !== 'production'
const profile = process.env.NODE_PROFILE === 'profile'
const profileSuffix = profile ? '-profile' : ''

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.html'],
        alias: {
            // eslint-disable-next-line no-undef
            '~': path.resolve(__dirname, 'web/js/'),
            '@css': path.resolve(__dirname, 'web/css/'),
            '@web': path.resolve(__dirname, 'web/'),
            template: path.resolve(__dirname, 'web/js/common/templates'),
            'react-dom$': profile || devMode ? 'react-dom/profiling' : 'react-dom',
        },
    },
    module: {
        rules: [
            { test: /\.hbs$/, loader: 'handlebars-loader' },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules|websdk/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name].[ext]',
                },
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]',
                },
            },
        ],
    },
    entry: {
        web: ['./src/App.tsx'],
    },
    devtool: 'source-map',
    plugins: [
        new CopyPlugin({ patterns: [{ from: './src/favicon.ico', to: 'favicon.ico' }] }),
        new CopyPlugin({ patterns: [{ from: './web/images/favicons/*', to: '.' }] }),
        new webpack.ProvidePlugin({ process: 'process/browser.js' }),
    ],
    output: {
        filename: `[name]${profileSuffix}.js`,
    },
    mode: devMode ? 'development' : 'production',
    target: ['browserslist:last 2 years'],
    optimization: {
        minimize: !(profile || devMode),
    },
}