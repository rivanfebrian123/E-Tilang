var a=new XMLHttpRequest();a.open("GET",'data.xlsx',true);a.responseType='arraybuffer';a.setRequestHeader('Cache-Control','no-cache, no-store, max-age=0');a.setRequestHeader('Expires','Tue, 01 Jan 1980 1:00:00 GMT');a.setRequestHeader('Pragma','no-cache');var b=null;var c=null;var d=0;var e=0;var f=null;var g=null;var h="";var i=false;var j=false;var k=false;var l="animationstart webkitAnimationStart oAnimationStart MSAnimationStart "+"transitionstart webkitTransitionStart oTransitionStart MSTransitionStart "+"animationiteration webkitAnimationIteration oAnimationIteration "+"MSAnimationIteration";var m="animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd "+"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";var n=['iPhone','iPad','iPod'].indexOf(navigator.platform)!=-1||(navigator.userAgent.indexOf('Mac')!=-1&&'ontouched' in document);var o=-1;var p=false;var q=null;var r=null;var s=null;var t=null;var u=null;var v=null;var w=$(document.body);var x=$(window);function y(a,b){if(!a.hasClass(b))a.addClass(b).one(m,function(){a.removeClass(b);});}function z(a){var b=a.toString().split('.');b[0]=b[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return b.join(',');}function A(a){return a.replace(/\s+/g,'').toLowerCase();}function B(a){return a.toLowerCase().split(' ').map(function(a){return a[0].toUpperCase()+a.slice(1);}).join(' ');}function C(a){if(a.is(":focus"))a.attr("readonly","readonly").attr("disabled","true").blur().removeAttr("readonly").removeAttr("disabled");}function D(a){return '<span><img src="dist/'+a+'"/></span>';}function E(a,b,c,d,e,f){var g=b.replace(/spm/gi,"Sepeda Motor").replace(/l.truck/gi,"Light Truck")+' | '+c;f=f.replace(/ran/gi,"Kendaraan").replace(/tnp/gi,"Tanpa").replace(/plat/gi,"Plat");var h=$('<div class="hasil flex baris"></div');var i=$('<div class="atas flex kolom"></div>');var j=$('<div class="bawah flex kolom"></div>');i.append('<h3 class="elipsis">'+a+'</h3>');i.append('<h4 class="elipsis">'+g+'</h4>');j.append('<div class="id elipsis">'+D('id.svg')+g+'</div>');j.append('<div>'+D('uang.svg')+z(d)+'</div>');j.append('<div class="elipsis">'+D('palu.svg')+e+'</div>');j.append('<div class="elipsis">'+D('dompet.svg')+f+'</div>');h.append(i).append(j);h.click(function(){var a=$(this).hasClass("pilih");if(p)y($(this).children().eq(1),"fadein");$(".pilih").removeClass("pilih");if(!a)$(this).addClass("pilih");});return h;}function F(){var a=s.val();if(h===a)return null;var b=A(a);y(q,"fadein");$(".hasil").each(function(){var a=$(this).children().eq(0).children();var c=A(a.eq(0).text());var d=a.eq(1).text().split('|');var e=A(typeof d[1]=='undefined'?d[0]:d[1]);if(c.indexOf(b)!=-1||e.indexOf(b)!=-1)$(this).show();else $(this).hide();});h=s.val();if(n)if(o==13)window.scrollTo(0,0);else w.scrollTop(0);}function G(){f=u.offset().top-(s.height()/2.5);g=q.offset().top;if(x.width()<600)p=true;else{p=false;t.removeClass("sembunyi");}H();}function H(){d=x.scrollTop();if(d==e)return null;if(i)C(s);if(d<f){t.removeClass("ambang");u.removeClass("pad");}else if((p&&d>g)||(!p&&d>f)){t.addClass("ambang");u.addClass("pad");}if(p&&!j&&!k)if(d>e)t.addClass("sembunyi");else t.removeClass("sembunyi");e=d;}a.onload=function(){var c=XLSX.read(a.response,{type:'array'});var d=[];c.SheetNames.forEach(function(a){XLSX.utils.sheet_to_json(c.Sheets[a],{header:1}).forEach(function(a){d.push(a);});});v.text("Sidang: "+B(d[2][3].replace("SIDANG PADA TANGGAL ","")));d.forEach(function(a){if(typeof a[0]==='number'&&typeof a[2]==='string')q.append(E(a[2],a[4],a[1],a[7]+a[8],a[5],a[6]));});r.submit(function(a){a.preventDefault();C(s);});r.keyup(function(a){a.preventDefault();clearTimeout(b);b=setTimeout(F,225);});r.removeClass("load");$(".load").remove();if(!p)s.focus();};a.onerror=function I(){location.reload();};$(function(){q=$("#daftar");r=$("#cari");s=$("#kunci");t=$("#navigasi");u=$("#navigasi-pad");v=$("#sidang");if(n)o=parseInt((navigator.appVersion).match(/OS (\d+)/)[1],10);a.send();G();x.resize(G);x.scroll(H);x.on("touchmove wheel",function(){i=true;clearTimeout(c);c=setTimeout(function(){i=false;},175);});x.on(l,function(){j=true;}).on(m,function(){j=false;});$("input").focus(function(){k=true;}).blur(function(){k=false;});});