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
  const elNama = document.createElement("h3");
  elNama.textContent = nama;

  const elKendaraanNoTilang = document.createElement("p");
  elKendaraanNoTilang.textContent = kendaraan.replace(/spm/gi, "Sepeda Motor").replace(/l.truck/gi, "Light Truck") + ' | ' + noTilang;

  const elDenda = document.createElement("p");
  elDenda.textContent = angkaify(denda);

  const elPasal = document.createElement("p");
  elPasal.textContent = pasal;

  const elBukti = document.createElement("p");
  elBukti.textContent = bukti;

  const container = document.createElement("article");
  container.append(elNama, elKendaraanNoTilang, elDenda, elPasal, elBukti);
  container.classList.add("item");

  return container;
}

function cari() {
  const kunci = kuncify(document.getElementById("kunci").value);
  const daftarItem = document.querySelectorAll(".item");

  for (item of daftarItem) {
    const kunci1 = kuncify(item.children[0].textContent);
    const kunci2 = kuncify(item.children[1].textContent);

    if (kunci1.indexOf(kunci) != -1 || kunci2.indexOf(kunci) != -1) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  }
}

http.onload = function() {
  const elDaftar = document.getElementById('daftar');
  const elCari = document.getElementById("cari");
  const elSidang = document.getElementById("sidang");
  var excel = XLSX.read(http.response, {
    type: 'array'
  });
  var hasil = [];

  if (http.readyState == 4 || http.status == 200) {
    for (name of excel.SheetNames) {
      hasil.push(...XLSX.utils.sheet_to_json(excel.Sheets[name], {
        header: 1
      }));
    }

    elSidang.textContent = "Sidang: " + judulify(hasil[2][3].replace("SIDANG PADA TANGGAL ", ""));

    for (i of hasil) {
      console.log(i)
      // nama, kendaraan, noTilang, denda, pasal, bukti
      if (typeof i[0] === 'number' && typeof i[2] === 'string') {
        elDaftar.append(render(i[2], i[4], i[1], i[7] + i[8], i[5], i[6]))
      }
    }

    elCari.addEventListener("submit", function(event) {
      event.preventDefault();
      cari();
    });
  } else {
    location.reload();
  }
}

http.send();
