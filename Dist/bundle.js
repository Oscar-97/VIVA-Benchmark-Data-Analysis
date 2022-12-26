(()=>{"use strict";function e(e){let t=e.split("|").filter((e=>e));for(var n=t.length-1;n>=0;n--)t[n]=t[n].replace(/\s+/g,"");return t.slice(0,-1)}function t(e){let t=e.split(" "),n=t.filter((e=>e));return t=n.map((function(e){return e.replace(/[|]/g,"")})),t.slice(0,-1)}const n=document.getElementById("fileInput"),l=document.getElementById("importDataButton"),o=document.getElementById("selectAllButton"),a=document.getElementById("viewSelectionButton"),c=document.getElementById("viewPlotsButton");n.value="";const d=[];function s(){let e=document.getElementsByTagName("input"),t=[];for(let n of e)n.checked&&t.push(n.id);return console.log(t),t}function r(e,t){const n=[];for(let l=0;l<t.length;l++)e.includes(t[l])?n[l]="Used":n[l]="NotUsed";return console.log(n),n}l.addEventListener("click",(function(){try{document.querySelectorAll(".form-check").forEach((e=>{e.remove()})),document.getElementById("tableSearch").remove(),document.getElementById("downloadCSVButton").remove()}catch(e){}o.disabled=!1,"Report"==document.title?a.disabled=!1:"Plots"==document.title&&(c.disabled=!1),l.disabled=!0,function(){const n=d,l=e(n[0]).shift(),c=e(n[0]).slice(1),i=function(e){let t=e.split(" "),n=t.filter((function(e){return"bound"!=e})).map((function(e){return e.replace(/[I| #]/g,"")})).filter((e=>e));for(var l=0;l<n.length;l++)"Primal"===n[l]?n[l]="Primal bound":"Dual"===n[l]?n[l]="Dual bound":"Nodes"===n[l]&&(n[l]="Nodes I");return t=n,t.slice(0,-1)}(n[1]),u=i.splice(0,7),m=t(n[3]);let h=3;const f=[];for(var g=h;g<n.length;g++)f.push(t(n[g])[0]);const p=[];for(;h<n.length;h++)p.push(t(n[h]).slice(1));console.log("Total number of rows in the data file: \n"+n.length),console.log("Solvers: \n",c),console.log("Number of filtered data labels: \n",i.length),console.log("Data labels: \n",i),console.log("Instance categories: \n",u),console.log("Filtered results for problem: \n",m[0],"results: ",m.slice(1)),function(e){for(var t=0;t<e.length;t++){const n=document.createElement("div");n.className="form-check form-check-inline";const l=document.createElement("label");l.className="form-check-label",l.innerText=e[t];const o=document.createElement("input");o.className="form-check-input",o.type="checkbox",o.id=e[t],n.appendChild(o),n.appendChild(l),document.getElementById("tableFilters").appendChild(n)}}(c),o.addEventListener("click",(function(){let e=document.getElementsByTagName("input");for(let t of e)t.checked||"fileInput"==t.id||t.click();o.disabled=!0})),"Report"==document.title&&a.addEventListener("click",(function(){let e=s(),t=r(e,c);!function(e,t,n,l,o,a,c){let d,s;console.log("NewDataLabels length: ",s),console.log("NewResultsData length: ",d),s=[],c.forEach(((e,t)=>{if("Used"===e){const e=8*t,n=8*t+8;let o=[];o=l.slice(e,n),o.forEach((e=>{s.push(e)}))}}));const r=[0,1,2,3,4,5];c.forEach(((e,t)=>{const n=8*t+14;if("Used"===e)for(let e=8*t+6;e<n;e++)r.push(e)})),console.log("Columns to use: ",r),d=a.map((e=>r.map((t=>e[t])))),console.log("NewResultsData after modifications: ",d);const i=document.getElementById("dataTable");i.innerHTML="";let u="<thead class='thead-dark' <tr><th colspan='7'>"+e+"</th>";for(let e=0;e<t.length;e++)u+="<th colspan='8'>"+t[e]+"</th>";u+="</tr></thead>";let m="<thead class='thead-dark' id='datalabelsThead'><tr>";for(let e=0;e<n.length;e++)m+="<th scope='col'>"+n[e]+"</th>";for(let e=0;e<s.length;e++)m+="<th>"+s[e]+"</th>";m+="</tr></thead>";let h="<tbody>";console.log("Problems length: ",o.length);for(let e=0;e<o.length;e++){let t="";d[e].forEach((e=>{t+="<td>"+e+"</td>"})),h+="<tr><th scope='row'>"+o[e]+"</th>"+t+"</tr>"}h+="</tbody>";const f=document.createElement("table");f.className="table table-bordered table-sm",f.id="dataTableGenerated",f.innerHTML=u+m+h,i.appendChild(f);const g=document.getElementById("tableSearch");if(!document.body.contains(g)){const e=document.createElement("input");e.id="tableSearch",e.type="text",e.className="form-control",e.placeholder="Search for a problem...",document.getElementById("tableFilters").appendChild(e)}const p=document.getElementById("downloadCSVButton");if(!document.body.contains(p)){const e=document.createElement("a");e.id="downloadCSVButton",e.type="button",e.className="btn btn-success btn-sm",e.innerHTML="Download CSV",document.getElementById("buttonField").appendChild(e)}}(l,e,u,i,f,p,t),o.disabled=!1;const n=document.getElementById("tableSearch");n.value="",n.oninput=()=>{!function(){const e=document.getElementById("tableSearch").value.toUpperCase(),t=document.getElementById("dataTableGenerated").getElementsByTagName("tr");let n,l;for(let o=2;o<t.length;o++){n=t[o].getElementsByTagName("th");for(let t=0;t<n.length;t++)n[t].innerHTML.toUpperCase().indexOf(e)>-1&&(l=!0);l?(t[o].style.display="",l=!1):t[o].style.display="none"}}()},document.getElementById("downloadCSVButton").addEventListener("click",(()=>function(){const e=document.getElementById("downloadCSVButton"),t=document.querySelector("#dataTableGenerated"),n=Array.from(t.rows).map((e=>Array.from(e.cells).map((e=>e.innerText)).join(","))).join("\n"),l=new Blob([n],{type:"text/csv"});e.href=window.URL.createObjectURL(l),e.download="benchmark-table.csv",console.log("Clicked download.")}()))})),"Plots"==document.title&&document.getElementById("viewPlotsButton").addEventListener("click",(function(){let e=r(s(),c);!function(e,t,n){function l(e){let n=[],l=[],o=8*e+10;for(var a=0;a<t.length;a++)n.push(t[a][o]);for(a=0;a<t.length;a++)l.push({x:n[a],y:a});return l}const o=[];for(let t=0;t<e.length;t++)console.log("Status: ",n[t]),"Used"===n[t]&&(console.log("Creating dataset for: ",e[t]),o.push({label:e[t],data:l(t),backgroundColor:"#"+Math.floor(16777215*Math.random()).toString(16)}));console.log("Dataset content: ",o);const a={datasets:o},c=document.getElementById("dataChart"),d=new Chart(c,{type:"scatter",data:a,options:{plugins:{title:{display:!0,text:"Absolute performance profile (PrimalGap)"}},scales:{x:{title:{display:!0,text:"PrimalGap"}},y:{title:{display:!0,text:"Number of instances."}}}}});document.getElementById("viewPlotsButton").addEventListener("click",(function(){d.destroy()}))}(c,p,e),o.disabled=!1}))}()})),n.addEventListener("change",(function(){l.disabled=!1;let e=new FileReader;e.addEventListener("load",(function(){d.length=0;let t=e.result.split("\n");for(let e=0;e<t.length-1;e++){let n=t[e];d.push(n)}})),e.readAsText(n.files[0])}))})();
//# sourceMappingURL=bundle.js.map