import{c as l}from"./createLucideIcon.CybawYvi.js";import{j as x}from"./jsx-runtime.D_zvdyIk.js";import{r as n}from"./index.BT22dv9w.js";/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],P=l("plus",I);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],q=l("shield",w),d="yishaq_cart",y=n.createContext(void 0);function E(){if(typeof window>"u")return[];try{const r=localStorage.getItem(d);if(r){const s=JSON.parse(r);if(Array.isArray(s))return s}}catch(r){console.error("Error reading cart from localStorage:",r)}return[]}function v(r){if(!(typeof window>"u"))try{localStorage.setItem(d,JSON.stringify(r))}catch(s){console.error("Error saving cart to localStorage:",s)}}function A({children:r}){const[s,a]=n.useState([]),[p,u]=n.useState(!1),[i,m]=n.useState(!1);n.useEffect(()=>{const t=E();a(t),m(!0)},[]),n.useEffect(()=>{i&&v(s)},[s,i]);const C=t=>{a(o=>o.find(e=>e.id===t.id&&e.size===t.size)?o.map(e=>e.id===t.id&&e.size===t.size?{...e,quantity:e.quantity+1}:e):[...o,{...t,quantity:1}]),u(!0)},f=t=>{a(o=>o.filter(c=>c.id!==t))},S=(t,o)=>{if(o<=0){f(t);return}a(c=>c.map(e=>e.id===t?{...e,quantity:o}:e))},g=()=>{a([]),typeof window<"u"&&localStorage.removeItem(d)},h=s.reduce((t,o)=>t+o.price*o.quantity,0);return x.jsx(y.Provider,{value:{items:s,addItem:C,removeItem:f,updateQuantity:S,clearCart:g,isOpen:p,setIsOpen:u,total:h,isHydrated:i},children:r})}function N(){const r=n.useContext(y);if(!r)throw new Error("useCart must be used within a CartProvider");return r}export{A as C,P,q as S,N as u};
