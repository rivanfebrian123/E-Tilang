var a=new XMLHttpRequest();a.open("GET",'data.xlsx',true);a.responseType='arraybuffer';a.setRequestHeader('Cache-Control','no-cache, no-store, max-age=0');a.setRequestHeader('Expires','Tue, 01 Jan 1980 1:00:00 GMT');a.setRequestHeader('Pragma','no-cache');var b=null;var c=null;var d="";var e=null;var f="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";var g=['iPhone','iPad','iPod'].includes(navigator.platform)||(navigator.userAgent.includes('Mac')&&'ontouched' in document);var h=null;var i=null;var j=null;var k=null;var l=null;var m=null;function n(a,b){if(!a.hasClass(b))a.addClass(b).one(f,function(){a.removeClass(b);});}function o(a){var b=a.toString().split('.');b[0]=b[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return b.join(',');}function p(a){return a.replace(/\s+/g,'').toLowerCase();}function q(a){return a.toLowerCase().split(' ').map(function(a){return a[0].toUpperCase()+a.slice(1);}).join(' ');}function r(a){a.attr("readonly","readonly").attr("disabled","true").blur().removeAttr("readonly").removeAttr("disabled");}function s(a){return '<span><img src="dist/'+a+'"/></span>';}function t(a,b,c,d,f,g){var h=b.replace(/spm/gi,"Sepeda Motor").replace(/l.truck/gi,"Light Truck")+' | '+c;g=g.replace(/ran/gi,"Kendaraan").replace(/tnp/gi,"Tanpa").replace(/plat/gi,"Plat");var i=$('<div class="hasil flex baris"></div');var j=$('<div class="atas flex kolom"></div>');var k=$('<div class="bawah flex kolom"></div>');j.append('<h3 class="elipsis">'+a+'</h3>');j.append('<h4 class="elipsis">'+h+'</h4>');k.append('<div class="id elipsis">'+s('id.svg')+h+'</div>');k.append('<div>'+s('uang.svg')+o(d)+'</div>');k.append('<div class="elipsis">'+s('palu.svg')+f+'</div>');k.append('<div class="elipsis">'+s('dompet.svg')+g+'</div>');i.append(j).append(k);i.click(function(){e=$(this).hasClass("pilih");n($(this).children().eq(1),"fadein");$(".pilih").removeClass("pilih");if(!e)$(this).addClass("pilih");});return i;}function u(){var a=j.val();if(d===a)return null;var b=p(a);n(h,"fadein");$(".hasil").each(function(){var a=$(this).children().eq(0).children();var c=p(a.eq(0).text());var d=a.eq(1).text().split('|');var e=p(typeof d[1]=='undefined'?d[0]:d[1]);if(c.indexOf(b)!=-1||e.indexOf(b)!=-1)$(this).show();else $(this).hide();});d=j.val();}function v(){c=l.offset().top-(j.height()/3.1);}function w(){document.body.scrollTop=0;}function x(){if($(window).scrollTop()>c){k.addClass("ambang");l.addClass("pad");}else{k.removeClass("ambang");l.removeClass("pad");}}a.onload=function(){var c=XLSX.read(a.response,{type:'array'});var d=[];c.SheetNames.forEach(function(a){XLSX.utils.sheet_to_json(c.Sheets[a],{header:1}).forEach(function(a){d.push(a);});});m.text("Sidang: "+q(d[2][3].replace("SIDANG PADA TANGGAL ","")));d.forEach(function(a){if(typeof a[0]==='number'&&typeof a[2]==='string')h.append(t(a[2],a[4],a[1],a[7]+a[8],a[5],a[6]));});i.submit(function(a){a.preventDefault();r(j);});i.keyup(function(a){a.preventDefault();clearTimeout(b);b=setTimeout(u,225);});i.removeClass("load");$(".load").remove();j.focus();};a.onerror=function y(){location.reload();};$(function(){var b=navigator.userAgent.toLowerCase();h=$("#daftar");i=$("#cari");j=$("#kunci");k=$("#navigasi");l=$("#navigasi-pad");m=$("#sidang");a.send();v();w();$(window).resize(function(){v();x();});$(window).scroll(x);x();if(g){$(this).on("touchmove",function(a){a.preventDefault();});$("input").focus(function(a){w();});}});