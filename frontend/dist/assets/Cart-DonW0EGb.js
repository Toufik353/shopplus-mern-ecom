import{r as h,g as F,a as A,j as r,k as Q}from"./index-BhxEaC_k.js";import{E as U,C as $}from"./CheckoutPage-BLVAGC86.js";import{Q as D,B as y}from"./ReactToastify-BodD9Uj_.js";const R="_cartContainer_10h4v_12",G="_cartTitle_10h4v_22",O="_cartContent_10h4v_28",W="_cartItems_10h4v_36",Y="_cartItem_10h4v_36",J="_itemImage_10h4v_53",z="_itemInfo_10h4v_60",M="_itemQuantity_10h4v_65",H="_quantityBtn_10h4v_72",K="_removeBtn_10h4v_85",V="_cartSummary_10h4v_98",X="_checkoutBtn_10h4v_109",Z="_error_10h4v_125",l={cartContainer:R,cartTitle:G,cartContent:O,cartItems:W,cartItem:Y,itemImage:J,itemInfo:z,itemQuantity:M,quantityBtn:H,removeBtn:K,cartSummary:V,checkoutBtn:X,error:Z};var I="https://js.stripe.com/v3",tt=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/,E="loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used",et=function(){for(var t=document.querySelectorAll('script[src^="'.concat(I,'"]')),n=0;n<t.length;n++){var s=t[n];if(tt.test(s.src))return s}return null},C=function(t){var n="",s=document.createElement("script");s.src="".concat(I).concat(n);var a=document.head||document.body;if(!a)throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");return a.appendChild(s),s},rt=function(t,n){!t||!t._registerWrapper||t._registerWrapper({name:"stripe-js",version:"5.1.0",startTime:n})},p=null,S=null,g=null,nt=function(t){return function(){t(new Error("Failed to load Stripe.js"))}},ot=function(t,n){return function(){window.Stripe?t(window.Stripe):n(new Error("Stripe.js not available"))}},at=function(t){return p!==null?p:(p=new Promise(function(n,s){if(typeof window>"u"||typeof document>"u"){n(null);return}if(window.Stripe&&t&&console.warn(E),window.Stripe){n(window.Stripe);return}try{var a=et();if(a&&t)console.warn(E);else if(!a)a=C(t);else if(a&&g!==null&&S!==null){var m;a.removeEventListener("load",g),a.removeEventListener("error",S),(m=a.parentNode)===null||m===void 0||m.removeChild(a),a=C(t)}g=ot(n,s),S=nt(s),a.addEventListener("load",g),a.addEventListener("error",S)}catch(_){s(_);return}}),p.catch(function(n){return p=null,Promise.reject(n)}))},st=function(t,n,s){if(t===null)return null;var a=t.apply(void 0,n);return rt(a,s),a},f,k=!1,P=function(){return f||(f=at(null).catch(function(t){return f=null,Promise.reject(t)}),f)};Promise.resolve().then(function(){return P()}).catch(function(c){k||console.warn(c)});var ct=function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];k=!0;var a=Date.now();return P().then(function(m){return st(m,n,a)})};const it=ct("pk_test_51QUjVGKkKrbP0tjiYejD4jpLDu8MDQoKIAHHglpYJZGWUQtgjLLIvQYGkaw9XSlko3Y5iW8qb1UMhhMP5qfeRuBF00Tc67HwQE"),mt=()=>{const[c,t]=h.useState({items:[]}),[n,s]=h.useState(null),[a,m]=h.useState(""),[_,T]=h.useState(!1);F(o=>o.cart.cartCount),A(),h.useEffect(()=>{B()},[]);const B=async()=>{const o=localStorage.getItem("authToken");try{const e=await fetch("https://shopplus-ecom-backend.onrender.com/cart",{headers:{Authorization:`Bearer ${o}`}}),i=await e.json();if(e.ok)t(i.cart||{items:[]}),j(i.cart.items.length);else throw new Error(i.message||"Failed to fetch cart data")}catch(e){console.error(e.message),s(e.message)}},j=o=>{localStorage.setItem("cartCount",o),window.dispatchEvent(new Event("storage"))},b=async()=>{const o=localStorage.getItem("authToken");try{const e=await fetch("https://shopplus-ecom-backend.onrender.com/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({cart:c})}),i=await e.json();if(e.ok)m(i.clientSecret),T(!0);else throw new Error(i.message||"Failed to create payment intent")}catch(e){console.error("Payment Error:",e.message),s("Failed to initiate payment")}},N=()=>c.items.reduce((o,e)=>{var d;const i=((d=e.productId)==null?void 0:d.price)||0,u=e.quantity||0;return o+i*u},0),x=async(o,e)=>{const i=localStorage.getItem("authToken");if(!(e<=0))try{const u=await fetch("https://shopplus-ecom-backend.onrender.com/cart/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify({productId:o,quantity:e})});if(u.ok)t(d=>{const v=d.items.map(w=>w.productId._id===o?{...w,quantity:e}:w);return j(v.length),{...d,items:v}}),y.success("Cart updated successfully!",{position:"top-center"});else{const d=await u.json();throw new Error(d.message||"Failed to update cart")}}catch{y.error("Failed to update cart")}},q=async o=>{console.log("prid id",o);const e=localStorage.getItem("authToken");try{const i=await fetch("https://shopplus-ecom-backend.onrender.com/cart/",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({productId:o})});if(i.ok)t(u=>{const d=u.items.filter(v=>v.productId._id!==o);return j(d.length),{...u,items:d}}),y.success("Item removed from cart!",{position:"top-center"});else{const u=await i.json();throw new Error(u.message||"Failed to remove item from cart")}}catch{y.error("Failed to remove item from cart")}},L=()=>{localStorage.setItem("orderData",JSON.stringify(c)),localStorage.removeItem("cart"),t({items:[]}),window.location.href="/order-confirmation"};return _?r.jsx(U,{stripe:it,children:r.jsx($,{clientSecret:a,onPaymentSuccess:L,cart:c})}):r.jsxs("div",{className:l.cartContainer,children:[r.jsx("h1",{className:l.cartTitle,children:"Your Cart"}),n&&r.jsx("p",{className:l.error,children:n}),r.jsxs("div",{className:l.cartContent,children:[r.jsx("div",{className:l.cartItems,children:c.items.length>0?c.items.map(o=>{const e=o.productId||{name:"Unnamed Product",price:0,imageUrl:""};return r.jsxs("div",{className:l.cartItem,children:[r.jsx("div",{className:l.itemImage,children:r.jsx("img",{src:e.image||"https://via.placeholder.com/150",alt:e.name})}),r.jsxs("div",{className:l.itemInfo,children:[r.jsx("h4",{children:e.name}),r.jsxs("p",{children:["Price: $",e.price?e.price.toFixed(2):"N/A"]})]}),r.jsxs("div",{className:l.itemQuantity,children:[r.jsx("button",{className:l.quantityBtn,onClick:()=>x(e._id,o.quantity-1),children:"-"}),r.jsx("span",{children:o.quantity||0}),r.jsx("button",{className:l.quantityBtn,onClick:()=>x(e._id,o.quantity+1),children:"+"})]}),r.jsx("button",{className:l.removeBtn,onClick:()=>q(e._id),children:r.jsx(Q,{})})]},o._id)}):r.jsx("p",{children:"Your cart is empty"})}),r.jsxs("div",{className:l.cartSummary,children:[r.jsxs("h3",{children:["Total: $",N().toFixed(2)]}),r.jsx("button",{className:l.checkoutBtn,onClick:b,children:"Proceed to Checkout"})]})]}),r.jsx(D,{})]})};export{mt as default};