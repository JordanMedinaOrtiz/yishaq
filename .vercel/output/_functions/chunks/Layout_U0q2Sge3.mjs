import { a2 as createComponent, _ as addAttribute, af as renderHead, ai as renderSlot, ak as renderTemplate, a1 as createAstro } from './astro/server_S7tF6J1M.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="es" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/png" href="/Yishaq.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Yishaq</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/jorda/Dev/yishaq/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
