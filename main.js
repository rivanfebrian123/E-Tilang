// NOTE: Perhatikan fitur2 baru Javascript yang tidak bisa ditutup dengan polyfill;
//       yaitu fitur2 yang berkaitan langsung dengan sintaks, bukan hanya variabel,
//       objek, dan fungsi; misal fitur for...of, spread (...) dan template string
//       (backtick [`])
var http = new XMLHttpRequest();
http.open("GET", 'data.xls', true);
http.responseType = 'arraybuffer'

function angkaify(angka) {
  bagian = angka.toString().split('.');
  bagian[0] = bagian[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return bagian.join(',');
}

function kuncify(kunci) {
  return kunci.replace(/\s+/g, '').toLowerCase()
}

function judulify(teks) {
  return teks.toLowerCase().split(' ').map(function(kata) {
    return kata[0].toUpperCase() + kata.slice(1);
  }).join(' ');
}

function render(nama, kendaraan, noTilang, denda, pasal, bukti) {
  kendaraan_id = kendaraan.replace(
    /spm/gi, "Sepeda Motor").replace(
    /l.truck/gi, "Light Truck") + ' | ' + noTilang
  bukti = bukti.replace(
    /ran/gi, "Kendaraan").replace(
    /tnp/gi, "Tanpa").replace(
    /plat/gi, "Plat")

  return '' +
    '<div class="item hasil"><div class="atas flex">' +
    '  <h3 class="elipsis">' + nama + '</h3>' +
    '  <h4 class="elipsis">' + kendaraan_id + '</h4>' +
    '</div>' +
    '<div class="bawah flex">' +
    '  <p><img src="images/uang.svg"/>' + angkaify(denda) + '</p>' +
    '  <p class="elipsis"><img src="images/palu.svg"/>' + pasal + '</p>' +
    '  <p class="elipsis"><img src="images/dompet.svg"/>' + bukti + '</p>' +
    '</div></div>';
}

function cari() {
  const kunci = kuncify($("#kunci").val());
  const daftarItem = $(".item");

  daftarItem.each(function() {
    const kepala = $(this).children().eq(0).children()
    const kunci1 = kuncify(kepala.eq(0).text());
    const kunci2_ = kepala.eq(1).text().split('|');
    const kunci2 = kuncify(typeof kunci2_[1] == 'undefined' ? kunci2_[0] : kunci2_[1]);

    if (kunci1.indexOf(kunci) != -1 || kunci2.indexOf(kunci) != -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

http.onload = function() {
  const elDaftar = $('#daftar');
  const elCari = $("#cari");
  const elSidang = $("#sidang");
  var excel = XLSX.read(http.response, {
    type: 'array'
  });
  var hasil = [];

  if (http.readyState == 4 || http.status == 200) {
    excel.SheetNames.forEach(function(nama) {
      XLSX.utils.sheet_to_json(excel.Sheets[nama], {
        header: 1
      }).forEach(function(kolom) {
        hasil.push(kolom);
      });
    });

    elSidang.text("Sidang: " + judulify(hasil[2][3].replace("SIDANG PADA TANGGAL ", "")));

    hasil.forEach(function(i) {
      // nama, kendaraan, noTilang, denda, pasal, bukti
      if (typeof i[0] === 'number' && typeof i[2] === 'string') {
        elDaftar.append(render(i[2], i[4], i[1], i[7] + i[8], i[5], i[6]))
      }
    });

    elCari.on("submit", function(event) {
      event.preventDefault();
      cari();
    });
  } else {
    location.reload();
  }
}

$(function() {
  http.send()
});
