import{cB as u}from"./index.9e465e98.js";function l(t){return(i,e)=>u.uploadFile({url:t||"/app/admin/common/upload/file",onUploadProgress:e},i)}function S(t){return i=>u.get({url:t,params:i})}function m(t){return t==="true"?!0:t==="false"?!1:String(Number(t))===t?Number(t):t}function x(t,i,e){i=m(i);let r=t.control;const o={disabled:e=="edit"?t.readonly:!1};let s=t.control_args;if(r=="Switch"&&(e=="search"?(r="Select",s="options:1:\u662F,0:\u5426"):i=!!i),r=="DatePicker"&&(o.showTime=!0),(r=="ApiTreeSelect"||r=="ApiTree")&&(o.resultField="list",i&&o.multiple&&typeof i!="number"&&(i=i.split(","))),s)for(const f of s.split(";")){let p=f.indexOf(":");if(p==-1)continue;const c=f.substring(0,p).trim();let n=f.substring(p+1).trim();if(r=="Upload"&&c==="url"){o.api=l(n);continue}if((r=="ApiTreeSelect"||r=="ApiTree")&&c==="url"){o.api=S(n);continue}if(p=n.indexOf(":"),p!==-1){const b=n.split(",");n=[];for(const g of b){const[A,T]=g.split(":");n.push({value:A,label:T})}}o[c]=m(n)}return r=="Upload"&&(e=="search"?r="Input":(i?(i=i.split(","),o.value=i):o.value=[],o.api||(o.api=l()))),[r,o,i]}export{x as t};
