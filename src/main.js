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

var timeoutCari = null;
var timeoutSentuh = null;
var posisi = 0;
var posisiLama = 0;
var offsetAmbang = null;
var offsetSembunyi = null;
var teks = "";
var disentuh = null;
var animasiJalan = null;
var teksFokus = null;
var animend =
  "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd " +
  "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd ";
var ios = ['iPhone', 'iPad', 'iPod'].indexOf(navigator.platform) != -1 ||
  (navigator.userAgent.indexOf('Mac') != -1 && 'ontouched' in document)
var mobile = null;
var ukuranStabil = null;

var elDaftar = null;
var elCari = null;
var elKunci = null;
var elNavigasi = null;
var elNavigasiPad = null;
var elSidang = null;
var elBody = $(document.body);
var elWindow = $(window);

function animify(elemen, kelas) {
  if (!elemen.hasClass(kelas)) {
    animasiJalan = true;

    elemen.addClass(kelas).one(animend, function () {
      elemen.removeClass(kelas);
      animasiJalan = false;
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
  if (elemen.is(":focus")) {
    elemen.attr("readonly", "readonly").attr("disabled", "true").blur()
      .removeAttr("readonly").removeAttr("disabled");
  }
}

function spanImg(namaFile) {
  return '<span><img src="dist/' + namaFile + '"/></span>';
}

function renderItem(nama, kendaraan, noTilang, denda, pasal, bukti) {
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
    var itemTerpilih = $(this).hasClass("pilih");

    if (mobile) {
      animify($(this).children().eq(1), "fadein");
    }

    $(".pilih").removeClass("pilih");

    if (!itemTerpilih) {
      $(this).addClass("pilih");
    }
  });

  return hasil;
}

function cari() {
  var kunci_ = elKunci.val();
  ukuranStabil = false;

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

  if (ios) {
    elBody.scrollTop(0);
  }

  teks = elKunci.val();
  ukuranStabil = true;
}

function updateOffset() {
  offsetAmbang = elNavigasiPad.offset().top - (elKunci.height() / 2.5);
  offsetSembunyi = elDaftar.offset().top;

  if (elWindow.width() < 600) {
    mobile = true;
  } else {
    mobile = false;
    elNavigasi.removeClass("sembunyi");
  }

  updateNavigasi();
}

function updateNavigasi() {
  posisi = elWindow.scrollTop();

  if (disentuh) {
    unkeyboardify(elKunci);
  }

  if (posisi < offsetAmbang) {
    elNavigasi.removeClass("ambang");
    elNavigasiPad.removeClass("pad");
  } else if ((mobile && posisi > offsetSembunyi) || (!mobile && posisi >
      offsetAmbang)) {
    elNavigasi.addClass("ambang");
    elNavigasiPad.addClass("pad");
  }

  // !teksFokus digunakan agar saat text selection atau keyboard muncul,
  // navigasi tidak langsung tiba2 tersembunyi atau tampil karena
  // efek scroll dari resize window
  if (mobile && ukuranStabil && !animasiJalan && !teksFokus) {
    if (posisi > posisiLama) {
      elNavigasi.addClass("sembunyi");
    } else {
      elNavigasi.removeClass("sembunyi");
    }
  }

  posisiLama = posisi;
}

http.onload = function () {
  var excel = XLSX.read(http.response, {
    type: 'array'
  });
  var hasil = [];
  ukuranStabil = false;

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
      elDaftar.append(renderItem(i[2], i[4], i[1], i[7] + i[8], i[5], i[6]));
    }
  });

  elCari.submit(function (event) {
    event.preventDefault();
    unkeyboardify(elKunci);
  });

  elCari.keyup(function (event) {
    event.preventDefault();
    clearTimeout(timeoutCari);
    timeoutCari = setTimeout(cari, 225);
  });

  elCari.removeClass("load");
  $(".load").remove();

  if (!mobile) {
    elKunci.focus();
  }

  ukuranStabil = true;
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

  elWindow.resize(updateOffset);
  elWindow.scroll(updateNavigasi);

  elWindow.on("touchmove", function () {
    disentuh = true;
    clearTimeout(timeoutSentuh);
    timeoutSentuh = setTimeout(function () {
      disentuh = false;
    }, 175);
  });

  $("input").focus(function () {
    teksFokus = true;
  }).blur(function () {
    teksFokus = false;
  });

  updateOffset();
  http.send();
});
