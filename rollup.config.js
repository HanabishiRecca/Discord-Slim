import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';

const output = {
    dir: 'package/dist',
    format: 'es',
};

export default [
    {
        input,
        output,
        plugins: [
            typescript(),
        ],
    },
    {
        input,
        output,
        plugins: [
            dts(),
        ],
    },
];
