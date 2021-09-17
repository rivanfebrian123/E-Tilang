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

function angkaify(angka) {
  var bagian = angka.toString().split('.');
  bagian[0] = bagian[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return bagian.join(',');
}

function kuncify(kunci) {
  return kunci.replace(/\s+/g, '').toLowerCase();
}

function judulify(teks) {
  return teks.toLowerCase().split(' ').map(function(kata) {
    return kata[0].toUpperCase() + kata.slice(1);
  }).join(' ');
}

function unkeyboardify(elemen) {
  elemen.attr(
    "readonly", "readonly").attr(
    "disabled", "true").blur().removeAttr(
    "readonly").removeAttr(
    "disabled");
}

function render(nama, kendaraan, noTilang, denda, pasal, bukti) {
  var kendaraan_id = kendaraan.replace(
    /spm/gi, "Sepeda Motor").replace(
    /l.truck/gi, "Light Truck") + ' | ' + noTilang;
  bukti = bukti.replace(
    /ran/gi, "Kendaraan").replace(
    /tnp/gi, "Tanpa").replace(
    /plat/gi, "Plat");

  return '' +
    '<div class="hasil flex baris">' +
    '  <div class="atas flex kolom">' +
    '    <h3 class="elipsis">' + nama + '</h3>' +
    '    <h4 class="elipsis">' + kendaraan_id + '</h4>' +
    '  </div>' +
    '  <div class="bawah flex kolom">' +
    '    <div><span><img src="images/uang.svg"/></span>' + angkaify(denda) + '</div>' +
    '    <div class="elipsis"><span><img src="images/palu.svg"/></span>' + pasal + '</div>' +
    '    <div class="elipsis"><span><img src="images/dompet.svg"/></span>' + bukti + '</div>' +
    '  </div>' +
    '</div>';
}

function cari() {
  var kunci_ = $("#kunci").val();

  if (teks === kunci_) {
    return null;
  }

  console.log(teks);
  console.log(kunci_);

  var kunci = kuncify(kunci_);
  var daftarItem = $(".hasil");
  var elDaftar = $("#daftar").addClass("sembunyi");

  daftarItem.each(function() {
    var kepala = $(this).children().eq(0).children();
    var kunci1 = kuncify(kepala.eq(0).text());
    var kunci2_ = kepala.eq(1).text().split('|');
    var kunci2 = kuncify(typeof kunci2_[1] == 'undefined' ? kunci2_[0] : kunci2_[1]);

    if (kunci1.indexOf(kunci) != -1 || kunci2.indexOf(kunci) != -1) {
      if (!$(this).hasClass("load")) {
        $(this).show();
      }
    } else {
      $(this).hide();
    }
  });

  setTimeout(function() {
    elDaftar.removeClass("sembunyi");
  }, 300);
  teks = $("#kunci").val();
}

function navigasi() {
  if ($(window).scrollTop() > offset) {
    $("#navigasi").addClass("ambang");
    $("#navigasi-pad").addClass("pad");
  } else {
    $("#navigasi").removeClass("ambang");
    $("#navigasi-pad").removeClass("pad");
  }
}

http.onload = function() {
  var elDaftar = $('#daftar');
  var excel = XLSX.read(http.response, {
    type: 'array'
  });
  var hasil = [];

  excel.SheetNames.forEach(function(nama) {
    XLSX.utils.sheet_to_json(excel.Sheets[nama], {
      header: 1
    }).forEach(function(kolom) {
      hasil.push(kolom);
    });
  });

  $("#sidang").text("Sidang: " + judulify(hasil[2][3].replace("SIDANG PADA TANGGAL ", "")));

  hasil.forEach(function(i) {
    // nama, kendaraan, noTilang, denda, pasal, bukti
    if (typeof i[0] === 'number' && typeof i[2] === 'string') {
      elDaftar.append(render(i[2], i[4], i[1], i[7] + i[8], i[5], i[6]));
    }
  });

  $("#cari").submit(function(event) {
    event.preventDefault();
    unkeyboardify($("#kunci"));
  }).keyup(function(event) {
    event.preventDefault();
    clearTimeout(timeout);
    timeout = setTimeout(cari, 300);
  }).removeClass("load");

  $(".load").hide();
  $("#kunci").focus();
};

$(function() {
  http.send();

  offset = $("#navigasi-pad").offset().top - ($("#kunci").height() / 3.1);

  $(window).resize(function() {
    offset = $("#navigasi-pad").offset().top - ($("#kunci").height() / 3.1);
    navigasi();
  });

  $(window).scroll(navigasi);
  navigasi();
});
