import { a2 as createComponent, ad as renderComponent, ak as renderTemplate } from '../chunks/astro/server_S7tF6J1M.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_U0q2Sge3.mjs';
import { R as RegisterPage } from '../chunks/AuthPages_B9HLFgdG.mjs';
export { renderers } from '../renderers.mjs';

const $$Registro = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "RegisterPage", RegisterPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jorda/Dev/yishaq/src/components/auth/AuthPages", "client:component-export": "RegisterPage" })} ` })}`;
}, "C:/Users/jorda/Dev/yishaq/src/pages/registro.astro", void 0);

const $$file = "C:/Users/jorda/Dev/yishaq/src/pages/registro.astro";
const $$url = "/registro";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Registro,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
