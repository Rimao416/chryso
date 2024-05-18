import{f as h,j as s,a}from"./index.f27c2642.js";const t=({children:c,title:d,subtitle:r,headerslot:e,className:o="custom-class",bodyClass:l="p-6",noborder:i,titleClass:n="custom-class"})=>{const[m]=h();return s("div",{className:`
        card rounded-md bg-white dark:bg-slate-800   ${m==="bordered"?" border border-slate-200 dark:border-slate-700":"shadow-base"}
   
    ${o}
        `,children:[(d||r)&&s("header",{className:`card-header ${i?"no-border":""}`,children:[s("div",{children:[d&&a("div",{className:`card-title ${n}`,children:d}),r&&a("div",{className:"card-subtitle",children:r})]}),e&&a("div",{className:"card-header-slot",children:e})]}),a("main",{className:`card-body ${l}`,children:c})]})};export{t as C};
