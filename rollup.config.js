/* eslint-disable indent */
/* global process, require */
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn(
                'npm',
                ['run', 'start', '--', '--dev'],
                {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true,
                }
            );

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

const babelConfig = (bundledHelpers = false) => ({
    babelrc: false,
    exclude: [/\/core-js\//, 'node_modules/**'],
    sourceMaps: true,
    inputSourceMap: true,
    babelHelpers: bundledHelpers ? 'bundled' : 'runtime',
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                    browsers: ['>0.25%', 'not dead', 'ie 11'],
                },
            },
        ],
    ],
    plugins: bundledHelpers
        ? ['@babel/plugin-syntax-optional-chaining']
        : [
              '@babel/plugin-syntax-optional-chaining',
              '@babel/plugin-transform-runtime',
          ],
});

const builds = [
    {
        external: ['/@babel/runtime/'],
        input: './src/index.js',
        output: {
            file: './dist/index.m.js',
            format: 'esm',
            sourcemap: true,
            inlineDynamicImports: true,
        },
        plugins: [resolve({ browser: true }), babel(babelConfig()), commonjs()],
    },
    {
        input: './src/index.js',
        output: {
            file: 'dist/sticky-parameters.umd.js',
            format: 'umd',
            inlineDynamicImports: true,
            name: 'stickyParameters',
            sourcemap: true,
        },
        plugins: [
            resolve({ browser: true }),
            babel(babelConfig(true)),
            commonjs(),
            production &&
                terser({
                    mangle: true,
                    compress: true,
                    output: {
                        comments: function (node, comment) {
                            var text = comment.value;
                            var type = comment.type;
                            if (type == 'comment2') {
                                // multiline comment
                                return (
                                    /@preserve|@license|@cc_on/i.test(text) ||
                                    /^!/.test(text)
                                );
                            }
                        },
                    },
                }),
            !production &&
                copy({
                    targets: [
                        {
                            src: 'dist/sticky-parameters.umd.js',
                            dest: './demo/build/',
                        },
                    ],
                    hook: 'writeBundle',
                }),
        ],
    },
];

if (!production) {
    builds.push({
        input: 'test-implementation/test.js',
        output: {
            file: './demo/build/demo-bundle.js',
            format: 'umd',
            inlineDynamicImports: true,
            sourcemap: true,
            name: 'stickyParametersDemo',
        },
        plugins: [
            resolve({ browser: true }),
            babel(babelConfig(true)),
            commonjs(),

            serve(),

            // Watch the `demo` directory and refresh the
            // browser on changes when not in production
            livereload('./demo/'),
        ],
        context: 'window',
        watch: {
            clearScreen: false,
        },
    });
    builds.push({
        input: 'test-implementation/with-referrer.js',
        output: {
            file: './demo/build/referrer-demo-bundle.js',
            format: 'umd',
            inlineDynamicImports: true,
            sourcemap: true,
            name: 'stickyParametersReferrerDemo',
        },
        plugins: [
            resolve({ browser: true }),
            babel(babelConfig(true)),
            commonjs(),
        ],
        context: 'window',
    });
}

export default builds;
