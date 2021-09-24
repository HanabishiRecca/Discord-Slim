import ts from 'rollup-plugin-ts';
import del from 'rollup-plugin-delete';

const input = 'src/index.ts';

const output = {
    dir: 'package/dist',
    format: 'es',
    generatedCode: 'es2015',
    sourcemap: true,
};

const plugins = [
    ts(),
    del({ targets: `${output.dir}/*`, runOnce: true }),
];

const external = [
    'ws',
    'events',
    'https',
    'url',
];

export default { input, output, plugins, external };
