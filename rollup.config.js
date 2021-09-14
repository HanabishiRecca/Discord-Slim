import ts from 'rollup-plugin-ts';
import del from 'rollup-plugin-delete';

const input = 'src/index.ts';

const output = {
    dir: 'package/dist',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
};

const exclude = [
    'util.d.ts',
];

const plugins = [
    ts(),
    del({ targets: `${output.dir}/*`, runOnce: true }),
    del({ targets: exclude.map((e) => `${output.dir}/${e}`), hook: 'closeBundle' }),
];

const external = [
    'ws',
    'events',
    'https',
    'url',
];

export default { input, output, plugins, external };
