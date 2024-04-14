/*! For license information please see 2000.d3a40b7a.js.LICENSE.txt */
(self.webpackChunksurspress=self.webpackChunksurspress||[]).push([["2000"],{87258:function(s,e,n){"use strict";n.r(e);var r=n("11527"),i=n("65788");function l(s){let e=Object.assign({h2:"h2",a:"a",p:"p",img:"img",ol:"ol",li:"li",code:"code",h3:"h3",pre:"pre",span:"span",blockquote:"blockquote"},(0,i.ah)(),s.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(e.h2,{id:"47-redis-\u4E3B\u4ECE\u590D\u5236-",children:[(0,r.jsx)(e.a,{className:"header-anchor","aria-hidden":"true",href:"#47-redis-\u4E3B\u4ECE\u590D\u5236-",children:"#"}),"47-Redis( \u4E3B\u4ECE\u590D\u5236 )"]}),"\n",(0,r.jsx)(e.p,{children:"Redis\u4E3B\u4ECE\u590D\u5236\u662F\u4E00\u79CD\u6570\u636E\u590D\u5236\u548C\u540C\u6B65\u673A\u5236\uFF0C\u5176\u4E2D\u4E00\u4E2ARedis\u670D\u52A1\u5668\uFF08\u79F0\u4E3A\u4E3B\u670D\u52A1\u5668\uFF09\u5C06\u5176\u6570\u636E\u590D\u5236\u5230\u4E00\u4E2A\u6216\u591A\u4E2A\u5176\u4ED6Redis\u670D\u52A1\u5668\uFF08\u79F0\u4E3A\u4ECE\u670D\u52A1\u5668\uFF09\u3002\u4E3B\u4ECE\u590D\u5236\u63D0\u4F9B\u4E86\u6570\u636E\u5197\u4F59\u5907\u4EFD\u3001\u8BFB\u5199\u5206\u79BB\u548C\u6545\u969C\u6062\u590D\u7B49\u529F\u80FD\u3002"}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.img,{src:"https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307201015471.png",alt:"image-20240307201015471"})}),"\n",(0,r.jsx)(e.p,{children:"\u4EE5\u4E0B\u662FRedis\u4E3B\u4ECE\u590D\u5236\u7684\u4E00\u822C\u5DE5\u4F5C\u6D41\u7A0B\uFF1A"}),"\n",(0,r.jsxs)(e.ol,{children:["\n",(0,r.jsxs)(e.li,{children:["\u914D\u7F6E\u4E3B\u670D\u52A1\u5668\uFF1A\u5728\u4E3B\u670D\u52A1\u5668\u4E0A\uFF0C\u4F60\u9700\u8981\u5728\u914D\u7F6E\u6587\u4EF6\u4E2D\u542F\u7528\u4E3B\u4ECE\u590D\u5236\u5E76\u6307\u5B9A\u4ECE\u670D\u52A1\u5668\u7684IP\u5730\u5740\u548C\u7AEF\u53E3\u53F7\u3002\u4F60\u53EF\u4EE5\u4F7F\u7528",(0,r.jsx)(e.code,{children:"replicaof"}),"\u914D\u7F6E\u9009\u9879\u6216",(0,r.jsx)(e.code,{children:"slaveof"}),"\u914D\u7F6E\u9009\u9879\u6765\u6307\u5B9A\u4ECE\u670D\u52A1\u5668\u3002"]}),"\n",(0,r.jsxs)(e.li,{children:["\u8FDE\u63A5\u4ECE\u670D\u52A1\u5668\uFF1A\u4ECE\u670D\u52A1\u5668\u8FDE\u63A5\u5230\u4E3B\u670D\u52A1\u5668\u5E76\u53D1\u9001\u590D\u5236\u8BF7\u6C42\u3002\u4ECE\u670D\u52A1\u5668\u901A\u8FC7\u53D1\u9001",(0,r.jsx)(e.code,{children:"SYNC"}),"\u547D\u4EE4\u8BF7\u6C42\u8FDB\u884C\u5168\u91CF\u590D\u5236\u6216\u901A\u8FC7\u53D1\u9001",(0,r.jsx)(e.code,{children:"PSYNC"}),"\u547D\u4EE4\u8BF7\u6C42\u8FDB\u884C\u90E8\u5206\u590D\u5236\uFF08\u589E\u91CF\u590D\u5236\uFF09\u3002"]}),"\n",(0,r.jsx)(e.li,{children:"\u5168\u91CF\u590D\u5236\uFF08SYNC\uFF09\uFF1A\u5982\u679C\u4ECE\u670D\u52A1\u5668\u662F\u7B2C\u4E00\u6B21\u8FDE\u63A5\u6216\u65E0\u6CD5\u6267\u884C\u90E8\u5206\u590D\u5236\uFF0C\u4E3B\u670D\u52A1\u5668\u5C06\u6267\u884C\u5168\u91CF\u590D\u5236\u3002\u5728\u5168\u91CF\u590D\u5236\u671F\u95F4\uFF0C\u4E3B\u670D\u52A1\u5668\u5C06\u5FEB\u7167\u6587\u4EF6\uFF08RDB\u6587\u4EF6\uFF09\u53D1\u9001\u7ED9\u4ECE\u670D\u52A1\u5668\uFF0C\u4ECE\u670D\u52A1\u5668\u5C06\u63A5\u6536\u5E76\u52A0\u8F7D\u8BE5\u6587\u4EF6\u4EE5\u5B8C\u5168\u590D\u5236\u4E3B\u670D\u52A1\u5668\u7684\u6570\u636E\u3002"}),"\n",(0,r.jsx)(e.li,{children:"\u90E8\u5206\u590D\u5236\uFF08PSYNC\uFF09\uFF1A\u5982\u679C\u4ECE\u670D\u52A1\u5668\u5DF2\u7ECF\u6267\u884C\u8FC7\u5168\u91CF\u590D\u5236\u5E76\u5EFA\u7ACB\u4E86\u590D\u5236\u65AD\u70B9\uFF0C\u4E3B\u670D\u52A1\u5668\u5C06\u6267\u884C\u90E8\u5206\u590D\u5236\u3002\u5728\u90E8\u5206\u590D\u5236\u671F\u95F4\uFF0C\u4E3B\u670D\u52A1\u5668\u5C06\u53D1\u9001\u589E\u91CF\u590D\u5236\u6D41\uFF08replication stream\uFF09\u7ED9\u4ECE\u670D\u52A1\u5668\uFF0C\u4ECE\u670D\u52A1\u5668\u5C06\u63A5\u6536\u5E76\u5E94\u7528\u8BE5\u6D41\u4EE5\u4FDD\u6301\u4E0E\u4E3B\u670D\u52A1\u5668\u7684\u540C\u6B65\u3002"}),"\n",(0,r.jsx)(e.li,{children:"\u590D\u5236\u6301\u4E45\u5316\uFF1A\u4ECE\u670D\u52A1\u5668\u63A5\u6536\u5230\u6570\u636E\u540E\uFF0C\u4F1A\u5C06\u5176\u4FDD\u5B58\u5728\u672C\u5730\u78C1\u76D8\u4E0A\uFF0C\u4EE5\u4FBF\u5728\u91CD\u542F\u540E\u4ECD\u7136\u4FDD\u6301\u6570\u636E\u7684\u4E00\u81F4\u6027\u3002"}),"\n",(0,r.jsx)(e.li,{children:"\u540C\u6B65\u5EF6\u8FDF\uFF1A\u4ECE\u670D\u52A1\u5668\u7684\u590D\u5236\u662F\u5F02\u6B65\u7684\uFF0C\u56E0\u6B64\u5B58\u5728\u590D\u5236\u5EF6\u8FDF\u3002\u5EF6\u8FDF\u53D6\u51B3\u4E8E\u7F51\u7EDC\u5EF6\u8FDF\u3001\u4E3B\u670D\u52A1\u5668\u7684\u8D1F\u8F7D\u548C\u4ECE\u670D\u52A1\u5668\u7684\u6027\u80FD\u7B49\u56E0\u7D20\u3002"}),"\n",(0,r.jsx)(e.li,{children:"\u8BFB\u5199\u5206\u79BB\uFF1A\u4E00\u65E6\u5EFA\u7ACB\u4E86\u4E3B\u4ECE\u590D\u5236\u5173\u7CFB\uFF0C\u4ECE\u670D\u52A1\u5668\u53EF\u4EE5\u63A5\u6536\u8BFB\u64CD\u4F5C\u3002\u8FD9\u4F7F\u5F97\u53EF\u4EE5\u5C06\u8BFB\u6D41\u91CF\u4ECE\u4E3B\u670D\u52A1\u5668\u5206\u6563\u5230\u4ECE\u670D\u52A1\u5668\u4E0A\uFF0C\u4ECE\u800C\u51CF\u8F7B\u4E3B\u670D\u52A1\u5668\u7684\u8D1F\u8F7D\u3002"}),"\n",(0,r.jsx)(e.li,{children:"\u6545\u969C\u6062\u590D\uFF1A\u5982\u679C\u4E3B\u670D\u52A1\u5668\u53D1\u751F\u6545\u969C\uFF0C\u53EF\u4EE5\u5C06\u4E00\u4E2A\u4ECE\u670D\u52A1\u5668\u63D0\u5347\u4E3A\u65B0\u7684\u4E3B\u670D\u52A1\u5668\uFF0C\u4EE5\u7EE7\u7EED\u63D0\u4F9B\u670D\u52A1\u3002\u5F53\u4E3B\u670D\u52A1\u5668\u6062\u590D\u65F6\uFF0C\u5B83\u53EF\u4EE5\u4F5C\u4E3A\u4ECE\u670D\u52A1\u5668\u8FDE\u63A5\u5230\u65B0\u7684\u4E3B\u670D\u52A1\u5668\uFF0C\u7EE7\u7EED\u8FDB\u884C\u6570\u636E\u590D\u5236\u3002"}),"\n"]}),"\n",(0,r.jsxs)(e.h3,{id:"\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6",children:[(0,r.jsx)(e.a,{className:"header-anchor","aria-hidden":"true",href:"#\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6",children:"#"}),"\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6"]}),"\n",(0,r.jsxs)(e.p,{children:["\u5728\u6839\u76EE\u5F55\u4E0B\u9762\u65B0\u5EFA\u4E00\u4E2A redis-6378.conf \u914D\u7F6E\u6587\u4EF6 \u4F5C\u4E3Aredis",(0,r.jsx)(e.code,{children:"\u4ECE\u670D\u52A1\u5668"}),",\u9ED8\u8BA4\u7684\u914D\u7F6E\u6587\u4EF66379\u4F5C\u4E3A",(0,r.jsx)(e.code,{children:"\u4E3B\u670D\u52A1\u5668"})]}),"\n",(0,r.jsx)(e.p,{children:"redis-6378.conf \u6587\u4EF6\u914D\u7F6E\uFF0C\u914D\u7F6E\u6587\u4EF6\u540D\u5B57\u968F\u4FBF\u53D6"}),"\n",(0,r.jsx)(e.pre,{className:"code",children:(0,r.jsx)(e.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(e.code,{className:"language-bash",meta:"",children:[(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"bind"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"127.0"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-string)"},children:".0.1"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-comment)"},children:"#ip\u5730\u5740"})]}),"\n",(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"port"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"6378"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-comment)"},children:"#\u7AEF\u53E3\u53F7"})]}),"\n",(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"daemonize"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-string)"},children:"yes"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-comment)"},children:"#\u5B88\u62A4\u7EBF\u7A0B\u9759\u9ED8\u8FD0\u884C"})]}),"\n",(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"replicaof"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"127.0"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-string)"},children:".0.1"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"6379"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-comment)"},children:"#\u6307\u5B9A\u4E3B\u670D\u52A1\u5668"})]}),"\n"]})})}),"\n",(0,r.jsx)(e.p,{children:"\u542F\u52A8\u4ECE\u670D\u52A1\u5668"}),"\n",(0,r.jsx)(e.pre,{className:"code",children:(0,r.jsx)(e.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(e.code,{className:"language-bash",meta:"",children:[(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"redis-server"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-string)"},children:"./redis-6378.conf"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-comment)"},children:"# \u6307\u5B9A\u914D\u7F6E\u6587\u4EF6"})]}),"\n"]})})}),"\n",(0,r.jsx)(e.p,{children:"\u6253\u5F00\u4ECE\u670D\u52A1\u5668cli"}),"\n",(0,r.jsx)(e.pre,{className:"code",children:(0,r.jsx)(e.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(e.code,{className:"language-bash",meta:"",children:[(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"redis-cli"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-string)"},children:"-p"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"6378"})]}),"\n"]})})}),"\n",(0,r.jsx)(e.p,{children:"\u542F\u52A8\u4E3B\u670D\u52A1\u5668"}),"\n",(0,r.jsx)(e.pre,{className:"code",children:(0,r.jsx)(e.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(e.code,{className:"language-bash",meta:"",children:[(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"redis-cli"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-comment)"},children:"# \u76F4\u63A5\u542F\u52A8\u9ED8\u8BA4\u5C31\u662F\u4E3B\u670D\u52A1\u5668\u7684\u914D\u7F6E\u6587\u4EF6"})]}),"\n"]})})}),"\n",(0,r.jsx)(e.p,{children:"\u4E3B\u670D\u52A1\u5668\u5199\u5165\u4E00\u4E2A\u503C"}),"\n",(0,r.jsx)(e.pre,{className:"code",children:(0,r.jsx)(e.pre,{className:"shiki css-variables has-line-number",style:{backgroundColor:"var(--shiki-color-background)"},tabIndex:"0",children:(0,r.jsxs)(e.code,{className:"language-bash",meta:"",children:[(0,r.jsxs)(e.span,{className:"line line-number",children:[(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-function)"},children:"set"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-string)"},children:"master"}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-color-text)"},children:" "}),(0,r.jsx)(e.span,{style:{color:"var(--shiki-token-constant)"},children:"2"})]}),"\n"]})})}),"\n",(0,r.jsx)(e.p,{children:"\u4ECE\u670D\u52A1\u5668\u76F4\u63A5\u540C\u6B65\u8FC7\u6765\u8FD9\u4E2A\u503C \u5C31\u53EF\u4EE5\u76F4\u63A5\u83B7\u53D6\u5230"}),"\n",(0,r.jsxs)(e.blockquote,{children:["\n",(0,r.jsx)(e.p,{children:"\u6CE8\u610F\u4ECE\u670D\u52A1\u5668\u662F\u4E0D\u5141\u8BB8\u5199\u5165\u7684\u64CD\u4F5C"}),"\n"]})]})}function c(){let s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:e}=Object.assign({},(0,i.ah)(),s.components);return e?(0,r.jsx)(e,Object.assign({},s,{children:(0,r.jsx)(l,s)})):l(s)}e.default=c,c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["guide%2Fnode%2F47-Redis(%20%E4%B8%BB%E4%BB%8E%E5%A4%8D%E5%88%B6%20).md"]={toc:[{id:"47-redis-\u4E3B\u4ECE\u590D\u5236-",text:"47-Redis( \u4E3B\u4ECE\u590D\u5236 )",depth:2},{id:"\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6",text:"\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6",depth:3}],title:"",frontmatter:{}}}}]);