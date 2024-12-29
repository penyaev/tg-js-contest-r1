"use strict";(self.webpackChunktelegram_t=self.webpackChunktelegram_t||[]).push([[7405],{32794:(e,t,n)=>{n.r(t),n.d(t,{AuthCode:()=>y,AuthPassword:()=>E,AuthRegister:()=>w});var r=n(84051),a=n(13439),o=n(87894),s=n(82393),i=n(4961),l=n(26072),c=n(59030),u=n(31481),m=n(71851),d=n(43874),h=n(18104);const A=(0,r.ph)((({code:e,codeLength:t,trackingDirection:n,isTracking:a,isBig:o})=>{const[s,i]=(0,r.J0)(!1),{isMobile:l}=(0,d.Ay)(),c=165/t,A=l?u.UyP:u.H6l,p=(0,r.hb)((()=>i(!0)),[]);return r.Ay.createElement("div",{id:"monkey",className:o?"big":""},!s&&r.Ay.createElement("div",{className:"monkey-preview"}),r.Ay.createElement(h.A,{size:o?u.r2x:A,className:a?"hidden":void 0,tgsUrl:m.w.MonkeyIdle,play:!a,onLoad:p}),r.Ay.createElement(h.A,{size:o?u.r2x:A,className:a?"shown":"hidden",tgsUrl:m.w.MonkeyTracking,playSegment:a?function(){const r=e&&e.length>1||n<0?15+c*(e.length-1):0,a=e.length===t?180:15+c*e.length;return n<1?[a,r]:[r,a]}():void 0,speed:2,noLoop:!0}))}));var p=n(40664),g=n(52745);const y=(0,r.ph)((0,a.EK)((e=>(0,o.Up)(e,["authPhoneNumber","authIsCodeViaApp","authIsLoading","authError"])))((({authPhoneNumber:e,authIsCodeViaApp:t,authIsLoading:n,authError:o})=>{const{setAuthCode:u,returnToAuthPhoneNumber:m,clearAuthError:d}=(0,a.ko)(),h=(0,c.A)(),y=(0,r.li)(null),[v,b]=(0,r.J0)(""),[E,f]=(0,r.J0)(!1),[N,w]=(0,r.J0)(1);(0,r.vJ)((()=>{s.TF||y.current.focus()}),[]),(0,l.A)({isActive:!0,onBack:m});const k=(0,r.hb)((e=>{o&&d();const{currentTarget:t}=e;t.value=t.value.replace(/[^\d]+/,"").substr(0,5),t.value!==v&&(b(t.value),E?t.value.length||f(!1):f(!0),v&&v.length>t.value.length?w(-1):w(1),5===t.value.length&&u({code:t.value}))}),[o,d,v,E,u]);return r.Ay.createElement("div",{id:"auth-code-form",className:"custom-scroll"},r.Ay.createElement("div",{className:"auth-form"},r.Ay.createElement(A,{code:v,codeLength:5,isTracking:E,trackingDirection:N}),r.Ay.createElement("h1",null,e,r.Ay.createElement("div",{className:"auth-number-edit div-button",onClick:function(){m()},role:"button",tabIndex:0,title:h("WrongNumber"),"aria-label":h("WrongNumber")},r.Ay.createElement("i",{className:"icon icon-edit"}))),r.Ay.createElement("p",{className:"note"},(0,i.A)(h(t?"SentAppCode":"Login.JustSentSms"),["simple_markdown"])),r.Ay.createElement(p.A,{ref:y,id:"sign-in-code",label:h("Code"),onInput:k,value:v,error:o&&h(o),autoComplete:"off",inputMode:"numeric"}),n&&r.Ay.createElement(g.A,null)))})));var v=n(15535),b=n(3178);const E=(0,r.ph)((0,a.EK)((e=>(0,o.Up)(e,["authIsLoading","authError","authHint"])))((({authIsLoading:e,authError:t,authHint:n})=>{const{setAuthPassword:o,clearAuthError:s}=(0,a.ko)(),i=(0,c.A)(),[l,u]=(0,r.J0)(!1),m=(0,r.hb)((e=>{u(e)}),[]),d=(0,r.hb)((e=>{o({password:e})}),[o]);return r.Ay.createElement("div",{id:"auth-password-form",className:"custom-scroll"},r.Ay.createElement("div",{className:"auth-form"},r.Ay.createElement(b.A,{isPasswordVisible:l}),r.Ay.createElement("h1",null,i("Login.Header.Password")),r.Ay.createElement("p",{className:"note"},i("Login.EnterPasswordDescription")),r.Ay.createElement(v.A,{clearError:s,error:t&&i(t),hint:n,isLoading:e,isPasswordVisible:l,onChangePasswordVisibility:m,onSubmit:d})))})));var f=n(43434),N=n(64493);const w=(0,r.ph)((0,a.EK)((e=>(0,o.Up)(e,["authIsLoading","authError"])))((({authIsLoading:e,authError:t})=>{const{signUp:n,clearAuthError:o,uploadProfilePhoto:s}=(0,a.ko)(),i=(0,c.A)(),[l,u]=(0,r.J0)(!1),[m,d]=(0,r.J0)(),[h,A]=(0,r.J0)(""),[g,y]=(0,r.J0)(""),v=(0,r.hb)((e=>{t&&o();const{target:n}=e;A(n.value),u(n.value.length>0)}),[t,o]),b=(0,r.hb)((e=>{const{target:t}=e;y(t.value)}),[]);return r.Ay.createElement("div",{id:"auth-registration-form",className:"custom-scroll"},r.Ay.createElement("div",{className:"auth-form"},r.Ay.createElement("form",{action:"",method:"post",onSubmit:function(e){e.preventDefault(),n({firstName:h,lastName:g}),m&&s({file:m})}},r.Ay.createElement(f.A,{onChange:d}),r.Ay.createElement("h2",null,i("YourName")),r.Ay.createElement("p",{className:"note"},i("Login.Register.Desc")),r.Ay.createElement(p.A,{id:"registration-first-name",label:i("Login.Register.FirstName.Placeholder"),onChange:v,value:h,error:t&&i(t),autoComplete:"given-name"}),r.Ay.createElement(p.A,{id:"registration-last-name",label:i("Login.Register.LastName.Placeholder"),onChange:b,value:g,autoComplete:"family-name"}),l&&r.Ay.createElement(N.A,{type:"submit",ripple:!0,isLoading:e},i("Next")))))})))},15535:(e,t,n)=>{n.d(t,{A:()=>h});var r=n(84051),a=n(31481),o=n(66644),s=n(87357),i=n(83868),l=n(82393),c=n(14737),u=n(43874),m=n(59030),d=n(64493);const h=(0,r.ph)((({isLoading:e=!1,isPasswordVisible:t,error:n,hint:h,placeholder:A="Password",submitLabel:p="Next",description:g,shouldShowSubmit:y,shouldResetValue:v,shouldDisablePasswordManager:b=!1,noRipple:E=!1,clearError:f,onChangePasswordVisibility:N,onInputChange:w,onSubmit:k})=>{const L=(0,r.li)(null),C=(0,m.A)(),{isMobile:P}=(0,u.Ay)(),[J,x]=(0,r.J0)(""),[I,S]=(0,r.J0)(!1),T=P?550:400;return(0,r.vJ)((()=>{v&&x("")}),[v]),(0,c.A)((()=>{l.TF||L.current.focus()}),T),(0,r.vJ)((()=>{n&&(0,o.RK)((()=>{L.current.focus(),L.current.select()}))}),[n]),r.Ay.createElement("form",{action:"",onSubmit:k?function(t){t.preventDefault(),e||I&&k(J)}:i.A,autoComplete:"off"},r.Ay.createElement("div",{className:(0,s.A)("input-group password-input",J&&"touched",n&&"error"),dir:C.isRtl?"rtl":void 0},b&&r.Ay.createElement("input",{type:"password",id:"prevent_autofill",autoComplete:"off",className:"visually-hidden",tabIndex:-2}),r.Ay.createElement("input",{ref:L,className:"form-control",type:t?"text":"password",id:"sign-in-password",value:J||"",autoComplete:b?"one-time-code":"current-password",onChange:function(e){n&&f();const{target:t}=e;x(t.value),S(t.value.length>=a.AGC),w&&w(t.value)},maxLength:256,dir:"auto"}),r.Ay.createElement("label",null,n||h||A),r.Ay.createElement("div",{className:"div-button toggle-password",onClick:function(){N(!t)},role:"button",tabIndex:0,title:"Toggle password visibility","aria-label":"Toggle password visibility"},r.Ay.createElement("i",{className:(0,s.A)("icon",t?"icon-eye":"icon-eye-closed")}))),g&&r.Ay.createElement("p",{className:"description"},g),k&&(I||y)&&r.Ay.createElement(d.A,{type:"submit",ripple:!E,isLoading:e,disabled:!I},p))}))},3178:(e,t,n)=>{n.d(t,{A:()=>h});var r=n(84051),a=n(31481),o=n(71851),s=n(14737),i=n(43874),l=n(37661),c=n(18104);const u=[0,50],m=[0,20],d=[20,0],h=(0,r.ph)((({isPasswordVisible:e,isBig:t})=>{const[n,h]=(0,l.A)(!1),[A,p]=(0,l.A)(!1),{isMobile:g}=(0,i.Ay)(),y=g?a.UyP:a.H6l;(0,s.A)(p,2e3);const v=(0,r.hb)(h,[h]);return r.Ay.createElement("div",{id:"monkey",className:t?"big":""},!n&&r.Ay.createElement("div",{className:"monkey-preview"}),r.Ay.createElement(c.A,{size:t?a.r2x:y,className:A?"hidden":"shown",tgsUrl:o.w.MonkeyClose,playSegment:u,noLoop:!0,onLoad:v}),r.Ay.createElement(c.A,{size:t?a.r2x:y,className:A?"shown":"hidden",tgsUrl:o.w.MonkeyPeek,playSegment:e?m:d,noLoop:!0}))}))},14737:(e,t,n)=>{n.d(t,{A:()=>o});var r=n(84051),a=n(17712);const o=function(e,t){const n=(0,a.A)(e);(0,r.vJ)((()=>{if("number"!=typeof t)return;const e=setTimeout((()=>n()),t);return()=>clearTimeout(e)}),[t])}},37859:(e,t,n)=>{n.d(t,{A:()=>a});var r=n(84051);const a=(e,t,n)=>{const a=(0,r.li)();return(0,r.Nf)((()=>{const n=a.current;return a.current=t,e(n||[])}),t,n)}},14680:(e,t,n)=>{n.d(t,{FD:()=>a,ZJ:()=>s,wb:()=>o});let r=0;function a(){r+=1}function o(){r-=1}function s(){return r>0}},91034:(e,t,n)=>{n.d(t,{A:()=>a});var r=n(84051);function a(e){return function(t){const n=(0,r.li)(t);return t.isOpen?n.current=t:n.current={...n.current,isOpen:!1},e(n.current)}}},29441:(e,t,n)=>{function r(e){function t(t){if("Tab"!==t.key)return;t.preventDefault(),t.stopPropagation();const n=Array.from(e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));if(!n.length)return;const r=n.findIndex((e=>e.isSameNode(document.activeElement)));let a=0;r>=0&&(a=t.shiftKey?r>0?r-1:n.length-1:r<n.length-1?r+1:0),n[a].focus()}return document.addEventListener("keydown",t,!1),()=>{document.removeEventListener("keydown",t,!1)}}n.d(t,{A:()=>r})}}]);
//# sourceMappingURL=7405.5616199e3d1e00c9f568.js.map