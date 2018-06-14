Ext.define("Site.page.Docs",{singleton:true,config:{currentTocItem:null,currentKey:null},requestTpl:['<h5 class="request-title">',"Request:"," {method:uppercase}"," {[encodeURI(values.url)]}",'<tpl if="Ext.Object.getSize(params.query)">',"?{[Ext.Object.toQueryString(values.params.query)]}","</tpl>","</h5>",'<dl class="request-headers">','<tpl foreach="headers">','<div class="dli">',"<dt>{$}</dt>","<dd>{.}</dd>","</div>","</tpl>","</dl>"],responseTpl:['<h5 class="response-title">Response: {status_code} {status_reason}</h5>','<dl class="response-headers">','<tpl foreach="headers">','<div class="dli">',"<dt>{$}</dt>","<dd>{.}</dd>","</div>","</tpl>","</dl>",'<h5 class="response-title">Response Body</h5>','<pre class="response-body language-{language}">{body}</pre>'],pathParamRe:/\{(\w+)\}/,numberTypeRe:/number|integer/,httpErrorReasons:{400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Payload Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Unassigned",426:"Upgrade Required",427:"Unassigned",428:"Precondition Required",429:"Too Many Requests",430:"Unassigned",431:"Request Header Fields Too Large",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",509:"Unassigned",510:"Not Extended",511:"Network Authentication Required"},constructor:function(){Ext.onReady(this.onDocReady,this)},updateCurrentTocItem:function(a,b){if(b){b.linkEl.removeCls("current")}if(a){a.linkEl.addCls("current")}},updateCurrentKey:function(b,a){if(a){a.removeCls("key-in-use");a.down(".button.key-use").removeCls("disabled")}if(b){b.addCls("key-in-use");b.down(".button.key-use").addCls("disabled")}},onDocReady:function(){var b=this,a;b.docsCt=a=Ext.getBody().down(".endpoint-docs");b.apiSchemes=a.getAttribute("data-schemes").split(",");b.apiHost=a.getAttribute("data-host");b.apiBasePath=a.getAttribute("data-basepath");b.apiHandle=a.getAttribute("data-handle");b.apiKeyRequired=a.dom.getAttribute("data-key-required")!==null;b.initializeToc();b.initializeKeySelector();b.initializeTryItOut();b.initializeSubscribe();Ext.get(document).on("scroll","onDocumentScroll",b)},onDocumentScroll:function(b,a){this.syncTocFromScroll()},initializeToc:function(){var b=this,c=b.toc=new Ext.util.Collection(),a=b.tocTops=[];Ext.getBody().down(".docs-toc").select('a[href^="#"]').each(function(f){var d=f.dom.hash.substr(1),g=Ext.get(d),e=g&&g.getTop();if(!g){return}c.add({id:d,linkEl:Ext.get(f),targetEl:g,targetTop:e});a.push(e)});b.syncTocFromScroll()},initializeKeySelector:function(){var b=this,a;Ext.select("article.key",true).each(function(c){if(!c.hasCls("key-active")){return}c.down("footer").insertFirst({tag:"a",cls:"button key-use",href:"#keys",html:"Use"}).on("click",function(e,d){e.stopEvent();b.setCurrentKey(c)});a=a||c});if(a){b.setCurrentKey(a)}},initializeTryItOut:function(){var c=this,b=Ext.XTemplate.getTpl(c,"requestTpl"),e=Ext.XTemplate.getTpl(c,"responseTpl"),a=Ext.get("keys"),f={csv:",",ssv:" ",tsv:"\t",pipes:"|"},d={number:"number",integer:"number",string:"text",file:"file","boolean":"checkbox"};Ext.select(".endpoint-path-method",true).each(function(h){var m=h.appendChild({cls:"console-ct"}),i=m.appendChild({tag:"button",html:"Try it out!"}),o=m.appendChild({tag:"span",cls:"loading-indicator",html:"Loading&hellip;"}),g=h.getAttribute("data-method"),p=h.up(".endpoint-path").getAttribute("data-path"),l=m.appendChild({cls:"request-ct"}),n=m.appendChild({cls:"response-ct"}),j=h.down(".parameters-table");j.down("thead th").insertSibling({tag:"th",html:"Value"},"after");j.select("tbody > tr").each(function(q){var r=q.getAttribute("data-type"),t={tag:"input",cls:"field-control",type:d[r]},s;if(r==="array"){t.placeholder=["item1","item2","..."].join((f[q.getAttribute("data-collectionformat")||"csv"]))}q.down("td").insertSibling({tag:"td",cn:[t]},"after")});function k(){var s=c.getCurrentKey(),t={path:{},query:{}},r=c.apiSchemes[0]+"://"+c.apiHost+c.apiBasePath,u={},v="",q;if(c.apiKeyRequired&&!s){window.alert("An API key is required for making calls to this API. Please request one in the API Keys section above");window.location="#keys";return}else{if(s){u.Authorization="Gatekeeper-Key "+s.getAttribute("data-key")}}h.select(".parameters-table tbody > tr").each(function(w){var y=w.down("input"),A=(y.dom.value===""),x=w.getAttribute("data-in"),z;if(A&&(w.getAttribute("data-required")||x==="path")){y.addCls("invalid");if(!q){q=Ext.get(y)}}else{if(!A){z=y.dom.value;if(w.getAttribute("data-type")==="boolean"){z=y.dom.checked?"true":"false"}t[x][w.getAttribute("data-name")]=z}}y.on("input",function(C,B){Ext.fly(B).removeCls("invalid")})});if(q){q.dom.focus();h.on("blur",function(x,w){Ext.fly(w).toggleCls("invalid",w.value==="")},null,{delegate:"input.invalid"});return}m.addCls("is-loading");r+=c.populatePlaceholders(p,t.path);b.overwrite(l,{method:g,url:r,params:t,headers:u});Ext.Ajax.request({method:g,url:r,params:t.query,disableCaching:false,headers:u,callback:function(y,B,x){var A=x.getAllResponseHeaders(),w=x.responseText;if(/(x|ht)ml/.test(A["content-type"])){v="markup";w=c.prettyPrintXML(w)}else{if(A["content-type"].indexOf("json")!==-1){try{w=JSON.stringify(JSON.parse(w),null,"   ");v="javascript"}catch(z){w=x.responseText}}}if(v!==""){w=Prism.highlight(w,Prism.languages[v])}else{w=Ext.util.Format.htmlEncode(w)}e.overwrite(n,{body:w,headers:A,language:v,status_code:x.status,status_reason:B?(x.statusText||"OK"):(x.statusText||c.httpErrorReasons[x.status]||"Error")});m.removeCls("is-loading")}})}i.on("click",k);j.on("keypress",function(r,q){if(r.keyCode==13){r.stopEvent();k()}})})},initializeSubscribe:function(){var a=this;Ext.select(".subscribe.toggle",true).each(function(b){var c=b.down("input");c.on("change",function(f,e){var d=e.checked;b[d?"addCls":"removeCls"]("off-to-on");b[d?"removeCls":"addCls"]("on-to-off");Ext.Ajax.request({method:d?"POST":"DELETE",url:"/subscriptions/"+a.apiHandle,headers:{Accept:"application/json"},success:function(g){var h=Ext.decode(g.responseText);e.checked=!!h.data;b.removeCls(["off-to-on","on-to-off"])},failure:function(g){if(g.status==401){location.href="/login?return="+encodeURIComponent(location.pathname+location.search)}else{window.alert("Failed to subscribe, please try again later")}}})})})},getTocFromY:function(f){var d=this,b=d.tocTops,a=1,e=b.length,c;for(;a<e;a++){c=b[a];if(f<c-25){return d.toc.getAt(a-1)}}return null},syncTocFromScroll:function(){var a=this,b=a.getTocFromY(Ext.getBody().getScroll().top);a.setCurrentTocItem(b)},populatePlaceholders:function(c,a){var d=this.pathParamRe,b;while((b=d.exec(c))!==null){c=c.replace(b[0],a[b[1]])}return c},prettyPrintXML:function formatXml(b){var d="",c=/(>)(<)(\/*)/g,e=0,a;b=b.toString().replace(c,"$1\r\n$2$3");a=b.split("\r\n");a.forEach(function(g){var f=0,h;if(g.match(/.+<\/\w[^>]*>$/)){f=0}else{if(g.match(/^<\/\w/)){if(h!==0){h-=1}}else{if(g.match(/^<\w[^>]*[^\/]>.*$/)){f=1}else{f=0}}}d+=Ext.String.repeat("   ",h)+g+"\r\n";h+=f});return d}});