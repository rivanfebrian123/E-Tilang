// NOTE: Perhatikan fitur2 baru Javascript yang tidak bisa ditutup dengan polyfill;
//       yaitu fitur2 yang berkaitan langsung dengan sintaks, bukan hanya variabel,
//       objek, dan fungsi; misal fitur for...of, spread (...) dan template string
//       (backtick [`])
var http = new XMLHttpRequest();
http.open("GET", 'data.xlsx', true);
http.responseType = 'arraybuffer';
http.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
http.setRequestHeader('Expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
http.setRequestHeader('Pragma', 'no-cache');

var timeout = null;
var offset = null;
var posisi = 0;
var posisiTerakhir = 0;
var inputTerpilih = false;
var teks = "";
var terpilih = null;
var animend =
  "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var ios = ['iPhone', 'iPad', 'iPod'].indexOf(navigator.platform) != -1 ||
  (navigator.userAgent.indexOf('Mac') != -1 && 'ontouched' in document)

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

function spanImg(namaFile) {
  return '<span><img src="dist/' + namaFile + '"/></span>';
}

function render(nama, kendaraan, noTilang, denda, pasal, bukti) {
  var kenID = kendaraan.replace(/spm/gi, "Sepeda Motor").replace(
    /l.truck/gi, "Light Truck") + ' | ' + noTilang;
  bukti = bukti.replace(/ran/gi, "Kendaraan").replace(/tnp/gi, "Tanpa").replace(
    /plat/gi, "Plat");
  var hasil = $('<div class="hasil flex baris"></div');
  var atas = $('<div class="atas flex kolom"></div>');
  var bawah = $('<div class="bawah flex kolom"></div>');

  atas.append('<h3 class="elipsis">' + nama + '</h3>');
  atas.append('<h4 class="elipsis">' + kenID + '</h4>');
  bawah.append('<div class="id elipsis">' + spanImg('id.svg') + kenID +
    '</div>');
  bawah.append('<div>' + spanImg('uang.svg') + angkaify(denda) + '</div>');
  bawah.append('<div class="elipsis">' + spanImg('palu.svg') + pasal +
    '</div>');
  bawah.append('<div class="elipsis">' + spanImg('dompet.svg') + bukti +
    '</div>');

  hasil.append(atas).append(bawah);
  hasil.click(function () {
    terpilih = $(this).hasClass("pilih");
    animify($(this).children().eq(1), "fadein");
    $(".pilih").removeClass("pilih");

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
  posisi = $(window).scrollTop();

  if (posisi > offset) {
    elNavigasi.addClass("ambang");
    elNavigasiPad.addClass("pad");
  } else {
    elNavigasi.removeClass("ambang");
    elNavigasiPad.removeClass("pad");
  }

  if (ios) {
    if (inputTerpilih) {
      elNavigasi.css("top", (posisiTerakhir - posisi) + "px");
    } else {
      posisiTerakhir = posisi;
    }
  }

  elKunci.attr("placeholder", posisi + ', ' + posisiTerakhir + ', ' + $(window).innerHeight());
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

  if (!ios) {
    elKunci.focus();
  }
};

http.onerror = function name() {
  location.reload();
}

$(function () {
  elDaftar = $("#daftar");
  elCari = $("#cari");
  elKunci = $("#kunci");
  elNavigasi = $("#navigasi");
  elNavigasiPad = $("#navigasi-pad");
  elSidang = $("#sidang");

  $(window).resize(function () {
    updateOffset();
    updateNavigasi();
  });

  $(window).scroll(updateNavigasi);

  if (ios) {
    // $(document).on("touchmove", function (event) {
    //   event.preventDefault();
    // });

    $("input").focus(function() {
      inputTerpilih = true;
    });

    $("input").blur(function() {
      inputTerpilih = false;
      elNavigasi.css("top", 0);
    });
  }

  updateOffset();
  updateNavigasi();
  http.send();
});
