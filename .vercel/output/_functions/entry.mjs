import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DtC-m2W3.mjs';
import { manifest } from './manifest_C3Ll35Xn.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/admin/orders.astro.mjs');
const _page3 = () => import('./pages/api/admin/stats.astro.mjs');
const _page4 = () => import('./pages/api/auth/login.astro.mjs');
const _page5 = () => import('./pages/api/auth/logout.astro.mjs');
const _page6 = () => import('./pages/api/auth/me.astro.mjs');
const _page7 = () => import('./pages/api/auth/register.astro.mjs');
const _page8 = () => import('./pages/api/checkout.astro.mjs');
const _page9 = () => import('./pages/api/design/generate.astro.mjs');
const _page10 = () => import('./pages/api/orders/admin.astro.mjs');
const _page11 = () => import('./pages/api/orders.astro.mjs');
const _page12 = () => import('./pages/api/products.astro.mjs');
const _page13 = () => import('./pages/api/users/orders.astro.mjs');
const _page14 = () => import('./pages/api/users/profile.astro.mjs');
const _page15 = () => import('./pages/checkout.astro.mjs');
const _page16 = () => import('./pages/demo-integraciones.astro.mjs');
const _page17 = () => import('./pages/login.astro.mjs');
const _page18 = () => import('./pages/perfil.astro.mjs');
const _page19 = () => import('./pages/registro.astro.mjs');
const _page20 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/admin/orders.ts", _page2],
    ["src/pages/api/admin/stats.ts", _page3],
    ["src/pages/api/auth/login.ts", _page4],
    ["src/pages/api/auth/logout.ts", _page5],
    ["src/pages/api/auth/me.ts", _page6],
    ["src/pages/api/auth/register.ts", _page7],
    ["src/pages/api/checkout.ts", _page8],
    ["src/pages/api/design/generate.ts", _page9],
    ["src/pages/api/orders/admin.ts", _page10],
    ["src/pages/api/orders.ts", _page11],
    ["src/pages/api/products.ts", _page12],
    ["src/pages/api/users/orders.ts", _page13],
    ["src/pages/api/users/profile.ts", _page14],
    ["src/pages/checkout.astro", _page15],
    ["src/pages/demo-integraciones.astro", _page16],
    ["src/pages/login.astro", _page17],
    ["src/pages/perfil.astro", _page18],
    ["src/pages/registro.astro", _page19],
    ["src/pages/index.astro", _page20]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "080c6772-9ec2-4924-a677-73ed0f62e521",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
