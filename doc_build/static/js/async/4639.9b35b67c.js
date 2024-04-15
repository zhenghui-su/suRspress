/*! For license information please see 4639.9b35b67c.js.LICENSE.txt */
(self.webpackChunksurspress=self.webpackChunksurspress||[]).push([["4639"],{73762:function(s,n,e){"use strict";e.r(n);var r=e("11527"),l=e("65788");function o(s){let n=Object.assign({h2:"h2",a:"a",p:"p",code:"code",h3:"h3",strong:"strong",pre:"pre",span:"span",ol:"ol",li:"li"},(0,l.ah)(),s.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h2,{id:"21-crypto",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#21-crypto",children:"#"}),"21-crypto"]}),"\n",(0,r.jsxs)(n.p,{children:["crypto \u6A21\u5757\u7684\u76EE\u7684\u662F\u4E3A\u4E86\u63D0\u4F9B\u901A\u7528\u7684",(0,r.jsx)(n.code,{children:"\u52A0\u5BC6\u548C\u54C8\u5E0C\u7B97\u6CD5"}),"\u3002\u7528\u7EAF JavaScript \u4EE3\u7801\u5B9E\u73B0\u8FD9\u4E9B\u529F\u80FD\u4E0D\u662F\u4E0D\u53EF\u80FD\uFF0C\u4F46\u901F\u5EA6\u4F1A\u975E\u5E38\u6162\u3002nodejs \u7528 C/C++\u5B9E\u73B0\u8FD9\u4E9B\u7B97\u6CD5\u540E\uFF0C\u901A\u8FC7 crypto \u8FD9\u4E2A\u6A21\u5757\u66B4\u9732\u4E3A JavaScript \u63A5\u53E3\uFF0C\u8FD9\u6837\u7528\u8D77\u6765\u65B9\u4FBF\uFF0C\u8FD0\u884C\u901F\u5EA6\u4E5F\u5FEB\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u5BC6\u7801\u5B66\u662F\u8BA1\u7B97\u673A\u79D1\u5B66\u4E2D\u7684\u4E00\u4E2A\u91CD\u8981\u9886\u57DF\uFF0C\u5B83\u6D89\u53CA\u5230\u52A0\u5BC6\u3001\u89E3\u5BC6\u3001\u54C8\u5E0C\u51FD\u6570\u548C\u6570\u5B57\u7B7E\u540D\u7B49\u6280\u672F\u3002Node.js \u662F\u4E00\u4E2A\u6D41\u884C\u7684\u670D\u52A1\u5668\u7AEF JavaScript \u8FD0\u884C\u73AF\u5883\uFF0C\u5B83\u63D0\u4F9B\u4E86\u5F3A\u5927\u7684\u5BC6\u7801\u5B66\u6A21\u5757\uFF0C\u4F7F\u5F00\u53D1\u4EBA\u5458\u80FD\u591F\u8F7B\u677E\u5730\u5728\u5176\u5E94\u7528\u7A0B\u5E8F\u4E2D\u5B9E\u73B0\u5404\u79CD\u5BC6\u7801\u5B66\u529F\u80FD\u3002\u672C\u6587\u5C06\u4ECB\u7ECD\u5BC6\u7801\u5B66\u7684\u57FA\u672C\u6982\u5FF5\uFF0C\u5E76\u63A2\u8BA8 Node.js \u4E2D\u5E38\u7528\u7684\u5BC6\u7801\u5B66 API\u3002"}),"\n",(0,r.jsxs)(n.h3,{id:"\u5BF9\u79F0\u52A0\u5BC6",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5BF9\u79F0\u52A0\u5BC6",children:"#"}),"\u5BF9\u79F0\u52A0\u5BC6"]}),"\n",(0,r.jsxs)(n.p,{children:["\u200B \u5BF9\u79F0\u52A0\u5BC6\u662F\u4E00\u79CD\u7B80\u5355\u800C\u5FEB\u901F\u7684\u52A0\u5BC6\u65B9\u5F0F\uFF0C\u5B83\u4F7F\u7528",(0,r.jsx)(n.strong,{children:"\u76F8\u540C\u7684\u5BC6\u94A5"}),"\uFF08\u79F0\u4E3A\u5BF9\u79F0\u5BC6\u94A5\uFF09\u6765\u8FDB\u884C\u52A0\u5BC6\u548C\u89E3\u5BC6\u3002\u8FD9\u610F\u5473\u7740\u53D1\u9001\u8005\u548C\u63A5\u6536\u8005\u5728\u52A0\u5BC6\u548C\u89E3\u5BC6\u8FC7\u7A0B\u4E2D\u90FD\u4F7F\u7528\u76F8\u540C\u7684\u5BC6\u94A5\u3002\u5BF9\u79F0\u52A0\u5BC6\u7B97\u6CD5\u7684\u52A0\u5BC6\u901F\u5EA6\u5F88\u5FEB\uFF0C\u9002\u5408\u5BF9\u5927\u91CF\u6570\u636E\u8FDB\u884C\u52A0\u5BC6\u548C\u89E3\u5BC6\u64CD\u4F5C\u3002\u7136\u800C\uFF0C\u5BF9\u79F0\u5BC6\u94A5\u7684\u5B89\u5168\u6027\u662F\u4E00\u4E2A\u6311\u6218\uFF0C\u56E0\u4E3A\u9700\u8981\u786E\u4FDD\u53D1\u9001\u8005\u548C\u63A5\u6536\u8005\u90FD\u5B89\u5168\u5730\u5171\u4EAB\u5BC6\u94A5\uFF0C\u5426\u5219\u6709\u98CE\u9669\u88AB\u672A\u6388\u6743\u7684\u4EBA\u83B7\u53D6\u5BC6\u94A5\u5E76\u89E3\u5BC6\u6570\u636E\uFF0Ccrypto \u4F7F\u7528\u5BF9\u79F0\u52A0\u5BC6\u5982\u4E0B"]}),"\n",(0,r.jsx)(n.pre,{className:"code",children:(0,r.jsx)(n.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(n.code,{className:"language-js",meta:"",children:[(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:"require"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'node:crypto'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u751F\u6210\u4E00\u4E2A\u968F\u673A\u7684 16 \u5B57\u8282\u7684\u521D\u59CB\u5316\u5411\u91CF (IV)"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"iv"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"Buffer"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".from"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".randomBytes"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"16"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"));"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u751F\u6210\u4E00\u4E2A\u968F\u673A\u7684 32 \u5B57\u8282\u7684\u5BC6\u94A5"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"key"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".randomBytes"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"32"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u521B\u5EFA\u52A0\u5BC6\u5B9E\u4F8B\uFF0C\u4F7F\u7528 AES-256-CBC \u7B97\u6CD5\uFF0C\u63D0\u4F9B\u5BC6\u94A5\u548C\u521D\u59CB\u5316\u5411\u91CF"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"cipher"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".createCipheriv"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'aes-256-cbc'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" key"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" iv);"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u5BF9\u8F93\u5165\u6570\u636E\u8FDB\u884C\u52A0\u5BC6\uFF0C\u5E76\u8F93\u51FA\u52A0\u5BC6\u7ED3\u679C\u7684\u5341\u516D\u8FDB\u5236\u8868\u793A"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"cipher"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".update"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'susu'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'utf-8'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'hex'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"result"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"cipher"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".final"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'hex'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u89E3\u5BC6"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"de"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".createDecipheriv"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'aes-256-cbc'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" key"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" iv);"})]}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"de"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".update"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"(result"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'hex'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"decrypted"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"de"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".final"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'utf-8'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"console"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".log"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'Decrypted:'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" decrypted);"})]}),"\n"]})})}),"\n",(0,r.jsxs)(n.h3,{id:"\u975E\u5BF9\u79F0\u52A0\u5BC6",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u975E\u5BF9\u79F0\u52A0\u5BC6",children:"#"}),"\u975E\u5BF9\u79F0\u52A0\u5BC6"]}),"\n",(0,r.jsxs)(n.p,{children:["\u200B \u975E\u5BF9\u79F0\u52A0\u5BC6\u4F7F\u7528\u4E00\u5BF9\u5BC6\u94A5\uFF0C\u5206\u522B\u662F",(0,r.jsx)(n.strong,{children:"\u516C\u94A5"}),"\u548C",(0,r.jsx)(n.strong,{children:"\u79C1\u94A5"}),"\u3002\u53D1\u9001\u8005\u4F7F\u7528\u63A5\u6536\u8005\u7684\u516C\u94A5\u8FDB\u884C\u52A0\u5BC6\uFF0C\u800C\u63A5\u6536\u8005\u4F7F\u7528\u81EA\u5DF1\u7684\u79C1\u94A5\u8FDB\u884C\u89E3\u5BC6\u3002\u516C\u94A5\u53EF\u4EE5\u81EA\u7531\u5206\u4EAB\u7ED9\u4EFB\u4F55\u4EBA\uFF0C\u800C\u79C1\u94A5\u5FC5\u987B\u4FDD\u5BC6\u3002\u975E\u5BF9\u79F0\u52A0\u5BC6\u7B97\u6CD5\u63D0\u4F9B\u4E86\u66F4\u9AD8\u7684\u5B89\u5168\u6027\uFF0C\u56E0\u4E3A\u5373\u4F7F\u516C\u94A5\u6CC4\u9732\uFF0C\u53EA\u6709\u6301\u6709\u79C1\u94A5\u7684\u63A5\u6536\u8005\u624D\u80FD\u89E3\u5BC6\u6570\u636E\u3002\u7136\u800C\uFF0C\u975E\u5BF9\u79F0\u52A0\u5BC6\u7B97\u6CD5\u7684\u52A0\u5BC6\u901F\u5EA6\u76F8\u5BF9\u8F83\u6162\uFF0C\u4E0D\u9002\u5408\u52A0\u5BC6\u5927\u91CF\u6570\u636E\u3002\u56E0\u6B64\uFF0C\u5728\u5B9E\u9645\u5E94\u7528\u4E2D\uFF0C\u901A\u5E38\u4F7F\u7528\u975E\u5BF9\u79F0\u52A0\u5BC6\u6765\u4EA4\u6362\u5BF9\u79F0\u5BC6\u94A5\uFF0C\u7136\u540E\u4F7F\u7528\u5BF9\u79F0\u52A0\u5BC6\u7B97\u6CD5\u6765\u52A0\u5BC6\u5B9E\u9645\u7684\u6570\u636E\u3002"]}),"\n",(0,r.jsx)(n.pre,{className:"code",children:(0,r.jsx)(n.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(n.code,{className:"language-js",meta:"",children:[(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:"require"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'node:crypto'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u751F\u6210 RSA \u5BC6\u94A5\u5BF9"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" { "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"privateKey"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"publicKey"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" } "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".generateKeyPairSync"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'rsa'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" {"})]}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"  modulusLength"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:":"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"2048"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"});"})}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u8981\u52A0\u5BC6\u7684\u6570\u636E"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"text"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'susu'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:";"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u4F7F\u7528\u516C\u94A5\u8FDB\u884C\u52A0\u5BC6"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"encrypted"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".publicEncrypt"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"(publicKey"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"Buffer"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".from"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"(text"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'utf-8'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"));"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u4F7F\u7528\u79C1\u94A5\u8FDB\u884C\u89E3\u5BC6"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"decrypted"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".privateDecrypt"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"(privateKey"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" encrypted);"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"console"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".log"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"decrypted"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".toString"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"());"})]}),"\n"]})})}),"\n",(0,r.jsxs)(n.h3,{id:"\u54C8\u5E0C\u51FD\u6570",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u54C8\u5E0C\u51FD\u6570",children:"#"}),"\u54C8\u5E0C\u51FD\u6570"]}),"\n",(0,r.jsx)(n.p,{children:"\u54C8\u5E0C\u51FD\u6570\u5177\u6709\u4EE5\u4E0B\u7279\u70B9\uFF1A"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"\u56FA\u5B9A\u957F\u5EA6\u8F93\u51FA\uFF1A\u4E0D\u8BBA\u8F93\u5165\u6570\u636E\u7684\u5927\u5C0F\uFF0C\u54C8\u5E0C\u51FD\u6570\u7684\u8F93\u51FA\u957F\u5EA6\u662F\u56FA\u5B9A\u7684\u3002\u4F8B\u5982\uFF0C\u5E38\u89C1\u7684\u54C8\u5E0C\u51FD\u6570\u5982 MD5 \u548C SHA-256 \u751F\u6210\u7684\u54C8\u5E0C\u503C\u957F\u5EA6\u5206\u522B\u4E3A 128 \u4F4D\u548C 256 \u4F4D\u3002"}),"\n",(0,r.jsx)(n.li,{children:"\u4E0D\u53EF\u9006\u6027\uFF1A\u54C8\u5E0C\u51FD\u6570\u662F\u5355\u5411\u7684\uFF0C\u610F\u5473\u7740\u4ECE\u54C8\u5E0C\u503C\u63A8\u5BFC\u51FA\u539F\u59CB\u8F93\u5165\u6570\u636E\u662F\u975E\u5E38\u56F0\u96BE\u7684\uFF0C\u51E0\u4E4E\u4E0D\u53EF\u80FD\u3002\u5373\u4F7F\u8F93\u5165\u6570\u636E\u53D1\u751F\u5FAE\u5C0F\u7684\u53D8\u5316\uFF0C\u5176\u54C8\u5E0C\u503C\u4E5F\u4F1A\u5B8C\u5168\u4E0D\u540C\u3002"}),"\n",(0,r.jsx)(n.li,{children:"\u552F\u4E00\u6027\uFF1A\u54C8\u5E0C\u51FD\u6570\u5E94\u8BE5\u5177\u6709\u8F83\u4F4E\u7684\u78B0\u649E\u6982\u7387\uFF0C\u5373\u4E0D\u540C\u7684\u8F93\u5165\u6570\u636E\u751F\u6210\u76F8\u540C\u7684\u54C8\u5E0C\u503C\u7684\u53EF\u80FD\u6027\u5E94\u8BE5\u975E\u5E38\u5C0F\u3002\u8FD9\u6709\u52A9\u4E8E\u786E\u4FDD\u54C8\u5E0C\u503C\u80FD\u591F\u552F\u4E00\u5730\u6807\u8BC6\u8F93\u5165\u6570\u636E\u3002"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u4F7F\u7528\u573A\u666F:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u6211\u4EEC\u53EF\u4EE5\u907F\u514D\u5BC6\u7801\u660E\u6587\u4F20\u8F93 \u4F7F\u7528 md5 \u52A0\u5BC6\u6216\u8005 sha256"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u9A8C\u8BC1\u6587\u4EF6\u5B8C\u6574\u6027\uFF0C\u8BFB\u53D6\u6587\u4EF6\u5185\u5BB9\u751F\u6210 md5 \u5982\u679C\u524D\u7AEF\u4E0A\u4F20\u7684 md5 \u548C\u540E\u7AEF\u7684\u8BFB\u53D6\u6587\u4EF6\u5185\u90E8\u7684 md5 \u5339\u914D\u8BF4\u660E\u6587\u4EF6\u662F\u5B8C\u6574\u7684"}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{className:"code",children:(0,r.jsx)(n.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(n.code,{className:"language-js",meta:"",children:[(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:"require"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'node:crypto'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u8981\u8BA1\u7B97\u54C8\u5E0C\u7684\u6570\u636E"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"let"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" text "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'123456'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:";"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u521B\u5EFA\u54C8\u5E0C\u5BF9\u8C61\uFF0C\u5E76\u4F7F\u7528 MD5 \u7B97\u6CD5"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"hash"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"crypto"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".createHash"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'md5'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u66F4\u65B0\u54C8\u5E0C\u5BF9\u8C61\u7684\u6570\u636E"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"hash"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".update"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"(text);"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsx)(n.span,{className:"line line-number",children:(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-comment)"},children:"// \u8BA1\u7B97\u54C8\u5E0C\u503C\uFF0C\u5E76\u4EE5\u5341\u516D\u8FDB\u5236\u5B57\u7B26\u4E32\u5F62\u5F0F\u8F93\u51FA"})}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"const"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"hashValue"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-keyword)"},children:"="}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"hash"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".digest"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'hex'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:");"})]}),"\n",(0,r.jsx)(n.span,{className:"line line-number"}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"console"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".log"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'Text:'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" text);"})]}),"\n",(0,r.jsxs)(n.span,{className:"line line-number",children:[(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-constant)"},children:"console"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-function)"},children:".log"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:"("}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-string-expression)"},children:"'Hash:'"}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-token-punctuation)"},children:","}),(0,r.jsx)(n.span,{style:{color:"var(--shiki-color-text)"},children:" hashValue);"})]}),"\n"]})})})]})}function i(){let s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,l.ah)(),s.components);return n?(0,r.jsx)(n,Object.assign({},s,{children:(0,r.jsx)(o,s)})):o(s)}n.default=i,i.__RSPRESS_PAGE_META={},i.__RSPRESS_PAGE_META["guide%2Fnode%2F21-crypto.md"]={toc:[{id:"21-crypto",text:"21-crypto",depth:2},{id:"\u5BF9\u79F0\u52A0\u5BC6",text:"\u5BF9\u79F0\u52A0\u5BC6",depth:3},{id:"\u975E\u5BF9\u79F0\u52A0\u5BC6",text:"\u975E\u5BF9\u79F0\u52A0\u5BC6",depth:3},{id:"\u54C8\u5E0C\u51FD\u6570",text:"\u54C8\u5E0C\u51FD\u6570",depth:3}],title:"",frontmatter:{}}}}]);