import { a2 as createComponent, ad as renderComponent, ak as renderTemplate } from '../chunks/astro/server_S7tF6J1M.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_U0q2Sge3.mjs';
import { L as LoginPage } from '../chunks/AuthPages_B9HLFgdG.mjs';
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LoginPage", LoginPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jorda/Dev/yishaq/src/components/auth/AuthPages", "client:component-export": "LoginPage" })} ` })}`;
}, "C:/Users/jorda/Dev/yishaq/src/pages/login.astro", void 0);

const $$file = "C:/Users/jorda/Dev/yishaq/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
