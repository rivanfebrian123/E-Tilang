var a=new XMLHttpRequest();a.open("GET",'data.xlsx',true);a.responseType='arraybuffer';a.setRequestHeader('Cache-Control','no-cache, no-store, max-age=0');a.setRequestHeader('Expires','Tue, 01 Jan 1980 1:00:00 GMT');a.setRequestHeader('Pragma','no-cache');var b=null;var c=null;var d=0;var e=0;var f=null;var g=null;var h="";var i=null;var j=null;var k=null;var l="animationstart webkitAnimationStart oAnimationStart MSAnimationStart "+"transitionstart webkitTransitionStart oTransitionStart MSTransitionStart "+"animationiteration webkitAnimationIteration oAnimationIteration "+"MSAnimationIteration";var m="animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd "+"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";var n=['iPhone','iPad','iPod'].indexOf(navigator.platform)!=-1||(navigator.userAgent.indexOf('Mac')!=-1&&'ontouched' in document);var o=-1;var p=null;var q=null;var r=null;var s=null;var t=null;var u=null;var v=null;var w=null;var x=$(document.body);var y=$(window);function z(a,b){if(!a.hasClass(b))a.addClass(b).one(m,function(){a.removeClass(b);});}function A(a){var b=a.toString().split('.');b[0]=b[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return b.join(',');}function B(a){return a.replace(/\s+/g,'').toLowerCase();}function C(a){return a.toLowerCase().split(' ').map(function(a){return a[0].toUpperCase()+a.slice(1);}).join(' ');}function D(a){if(a.is(":focus"))a.attr("readonly","readonly").attr("disabled","true").blur().removeAttr("readonly").removeAttr("disabled");}function E(a){return '<span><img src="dist/'+a+'"/></span>';}function F(a,b,c,d,e,f){var g=b.replace(/spm/gi,"Sepeda Motor").replace(/l.truck/gi,"Light Truck")+' | '+c;f=f.replace(/ran/gi,"Kendaraan").replace(/tnp/gi,"Tanpa").replace(/plat/gi,"Plat");var h=$('<div class="hasil flex baris"></div');var i=$('<div class="atas flex kolom"></div>');var j=$('<div class="bawah flex kolom"></div>');i.append('<h3 class="elipsis">'+a+'</h3>');i.append('<h4 class="elipsis">'+g+'</h4>');j.append('<div class="id elipsis">'+E('id.svg')+g+'</div>');j.append('<div>'+E('uang.svg')+A(d)+'</div>');j.append('<div class="elipsis">'+E('palu.svg')+e+'</div>');j.append('<div class="elipsis">'+E('dompet.svg')+f+'</div>');h.append(i).append(j);h.click(function(){var a=$(this).hasClass("pilih");if(p)z($(this).children().eq(1),"fadein");$(".pilih").removeClass("pilih");if(!a)$(this).addClass("pilih");});return h;}function G(){var a=t.val();q=false;if(h===a)return null;var b=B(a);z(r,"fadein");$(".hasil").each(function(){var a=$(this).children().eq(0).children();var c=B(a.eq(0).text());var d=a.eq(1).text().split('|');var e=B(typeof d[1]=='undefined'?d[0]:d[1]);if(c.indexOf(b)!=-1||e.indexOf(b)!=-1)$(this).show();else $(this).hide();});h=t.val();q=true;if(n){if(o==13)window.scrollTo(0,0);x.scrollTop(0);}}function H(){f=v.offset().top-(t.height()/2.5);g=r.offset().top;if(y.width()<600)p=true;else{p=false;u.removeClass("sembunyi");}I();}function I(){d=y.scrollTop();if(d==e)return null;if(i)D(t);if(d<f){u.removeClass("ambang");v.removeClass("pad");}else if((p&&d>g)||(!p&&d>f)){u.addClass("ambang");v.addClass("pad");}if(p&&q&&!j&&!k)if(d>e)u.addClass("sembunyi");else u.removeClass("sembunyi");e=d;}a.onload=function(){var c=XLSX.read(a.response,{type:'array'});var d=[];q=false;c.SheetNames.forEach(function(a){XLSX.utils.sheet_to_json(c.Sheets[a],{header:1}).forEach(function(a){d.push(a);});});w.text("Sidang: "+C(d[2][3].replace("SIDANG PADA TANGGAL ","")));d.forEach(function(a){if(typeof a[0]==='number'&&typeof a[2]==='string')r.append(F(a[2],a[4],a[1],a[7]+a[8],a[5],a[6]));});s.submit(function(a){a.preventDefault();D(t);});s.keyup(function(a){a.preventDefault();clearTimeout(b);b=setTimeout(G,225);});s.removeClass("load");$(".load").remove();if(!p)t.focus();q=true;};a.onerror=function J(){location.reload();};$(function(){r=$("#daftar");s=$("#cari");t=$("#kunci");u=$("#navigasi");v=$("#navigasi-pad");w=$("#sidang");if(n)o=parseInt((navigator.appVersion).match(/OS (\d+)/)[1],10);y.resize(H);y.scroll(I);y.on("touchmove",function(){i=true;clearTimeout(c);c=setTimeout(function(){i=false;},175);});y.on(l,function(){j=true;}).on(m,function(){j=false;});$("input").focus(function(){k=true;}).blur(function(){k=false;});H();a.send();});