// NOTE: Perhatikan fitur2 baru Javascript yang tidak bisa ditutup dengan polyfill;
//       yaitu fitur2 yang berkaitan langsung dengan sintaks, bukan hanya variabel,
//       objek, dan fungsi; misal fitur for...of, spread (...) dan template string
//       (backtick [`])
var http = new XMLHttpRequest();
http.open("GET", 'data.xls', true);
http.responseType = 'arraybuffer';
http.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
http.setRequestHeader('Expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
http.setRequestHeader('Pragma', 'no-cache');

var timeout = null;
var offset = null;
var teks = "";
var terpilih = null;
var animend =
  "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

var elDaftar = null;
var elCari = null;
var elKunci = null;
var elNavigasi = null;
var elNavigasiPad = null;
var elSidang = null;

function animify(elemen, kelas) {
  if (!elemen.hasClass(kelas)) {
    elemen.addClass(kelas).one(animend, function () {
      elemen.removeClass(kelas);
    });
  }
}

function angkaify(angka) {
  var bagian = angka.toString().split('.');
  bagian[0] = bagian[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return bagian.join(',');
}

function kuncify(kunci) {
  return kunci.replace(/\s+/g, '').toLowerCase();
}

function judulify(teks) {
  return teks.toLowerCase().split(' ').map(function (kata) {
    return kata[0].toUpperCase() + kata.slice(1);
  }).join(' ');
}

function unkeyboardify(elemen) {
  elemen.attr("readonly", "readonly").attr("disabled", "true").blur()
    .removeAttr("readonly").removeAttr("disabled");
}

function render(nama, kendaraan, noTilang, denda, pasal, bukti) {
  var kendaraan_id = kendaraan.replace(/spm/gi, "Sepeda Motor").replace(
    /l.truck/gi, "Light Truck") + ' | ' + noTilang;
  bukti = bukti.replace(/ran/gi, "Kendaraan").replace(/tnp/gi, "Tanpa").replace(
    /plat/gi, "Plat");

  var hasil = $('<div class="hasil flex baris"><div class="atas flex kolom">' +
    '<h3 class="elipsis">' + nama + '</h3><h4 class="elipsis">' +
    kendaraan_id + '</h4></div><div class="bawah flex kolom">' +
    '<div class="id elipsis"><span><img src="dist/id.svg"/></span>' +
    kendaraan_id + '</div><div><span>' + '<img src="dist/uang.svg"/></span>' +
    angkaify(denda) + '</div><div class="elipsis"><span>' +
    '<img src="dist/palu.svg"/></span>' + pasal +
    '</div><div class="elipsis"><span><img src="dist/dompet.svg"/></span>' +
    bukti + '</div></div></div>');

  hasil.click(function () {
    terpilih = $(this).hasClass("pilih");
    $(".pilih").removeClass("pilih");
    animify($(this).children().eq(1), "fadein");

    if (!terpilih) {
      $(this).addClass("pilih");
    }
  });

  return hasil;
}

function cari() {
  var kunci_ = elKunci.val();

  if (teks === kunci_) {
    return null;
  }

  var kunci = kuncify(kunci_);

  animify(elDaftar, "fadein");

  $(".hasil").each(function () {
    var kepala = $(this).children().eq(0).children();
    var kunci1 = kuncify(kepala.eq(0).text());
    var kunci2_ = kepala.eq(1).text().split('|');
    var kunci2 = kuncify(typeof kunci2_[1] == 'undefined' ? kunci2_[0] :
      kunci2_[1]);

    if (kunci1.indexOf(kunci) != -1 || kunci2.indexOf(kunci) != -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });

  teks = elKunci.val();
}

function updateOffset() {
  offset = elNavigasiPad.offset().top - (elKunci.height() / 3.1);
}

function updateNavigasi() {
  if ($(window).scrollTop() > offset) {
    elNavigasi.addClass("ambang");
    elNavigasiPad.addClass("pad");
  } else {
    elNavigasi.removeClass("ambang");
    elNavigasiPad.removeClass("pad");
  }
}

http.onload = function () {
  var excel = XLSX.read(http.response, {
    type: 'array'
  });
  var hasil = [];

  excel.SheetNames.forEach(function (nama) {
    XLSX.utils.sheet_to_json(excel.Sheets[nama], {
      header: 1
    }).forEach(function (kolom) {
      hasil.push(kolom);
    });
  });

  elSidang.text("Sidang: " + judulify(hasil[2][3].replace(
    "SIDANG PADA TANGGAL ", "")));

  hasil.forEach(function (i) {
    // nama, kendaraan, noTilang, denda, pasal, bukti
    if (typeof i[0] === 'number' && typeof i[2] === 'string') {
      elDaftar.append(render(i[2], i[4], i[1], i[7] + i[8], i[5], i[6]));
    }
  });

  elCari.submit(function (event) {
    event.preventDefault();
    unkeyboardify(elKunci);
  });

  elCari.keyup(function (event) {
    event.preventDefault();
    clearTimeout(timeout);
    timeout = setTimeout(cari, 225);
  });

  elCari.removeClass("load");
  $(".load").remove();
  elKunci.focus();
};

$(function () {
  var ua = navigator.userAgent.toLowerCase();
  elDaftar = $("#daftar");
  elCari = $("#cari");
  elKunci = $("#kunci");
  elNavigasi = $("#navigasi");
  elNavigasiPad = $("#navigasi-pad");
  elSidang = $("#sidang");

  http.send();
  updateOffset();

  if (ua.indexOf("iphone") != -1 | ua.indexOf("ipad") != -1 || ua.indexOf(
      "ipod") != -1) {
    $("body").addClass("fix-hp-apple");
  } else if (ua.indexOf("x11") != -1 || ua.indexOf("linux") != -1 || ua
    .indexOf("android") != -1 || ua.indexOf("mac") != -1) {
    $("body").addClass("fix-unix");
  }

  $(window).resize(function () {
    updateOffset();
    updateNavigasi();
  });

  $(window).scroll(updateNavigasi);
  updateNavigasi();
});
