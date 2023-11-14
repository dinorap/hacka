window.onload = function () {
  // get data từ localstorage

  listNews = getListNews() || listNews;
  addTableTinTuc();
  addEventChangeTab();
  openTab("Trang Chủ");
};

// ======================= Các Tab =========================
function addEventChangeTab() {
  var sidebar = document.getElementsByClassName("sidebar")[0];
  var list_a = sidebar.getElementsByTagName("a");
  for (var a of list_a) {
    if (!a.onclick) {
      a.addEventListener("click", function () {
        turnOff_Active();
        this.classList.add("active");
        var tab = this.childNodes[1].data.trim();
        openTab(tab);
      });
    }
  }
}
function sha256(input) {
  var encoder = new TextEncoder();
  var data = encoder.encode(input);
  return crypto.subtle.digest("SHA-256", data).then(function (buffer) {
    var hashArray = Array.from(new Uint8Array(buffer));
    var hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  });
}
function turnOff_Active() {
  var sidebar = document.getElementsByClassName("sidebar")[0];
  var list_a = sidebar.getElementsByTagName("a");
  for (var a of list_a) {
    a.classList.remove("active");
  }
}

function openTab(nameTab) {
  // ẩn hết
  var main = document.getElementsByClassName("main")[0].children;
  for (var e of main) {
    e.style.display = "none";
  }

  // mở tab
  switch (nameTab) {
    case "Trang Chủ":
      document.getElementsByClassName("home")[0].style.display = "block";
      break;

    case "Tài Khoản":
      document.getElementsByClassName("tintuc")[0].style.display = "block";
      break;
  }
}
function addTableTinTuc() {
  var tc = document
    .getElementsByClassName("tintuc")[0]
    .getElementsByClassName("table-content")[0];
  var s = `<table class="table-outline hideImg">`;
  var listNew = getListNews() || listNews;
  console.log(listNew);
  for (var i = 0; i < listNew.length; i++) {
    var u = listNew[i];
    s +=
      `
    <tr>
      <td style="width: 5%">${i + 1}</td>
      <td style="width: 20%">${u.email}</td>
      <td style="width: 20%">${u.password}</td>
      <td style="width: 45%">
  <p>Số giờ đã học: ${u.infor.gio}</p>
  <p>Số bài đã hoàn thành: ${u.infor.baihoanthanh}</p>
  <p>Số Từ vựng đã học: ${u.infor.tuvungdahoc}</p>
</td>

      <td style="width: 10%">
        <div class="tooltip">
          <i class="fa fa-wrench" onclick="addKhungSuaTinTuc('` +
      u.email +
      `')"></i>
          <span class="tooltiptext">Sửa</span>
        </div>
        <div class="tooltip">
        <i class="fa fa-trash" onclick="xoaTinTuc('` +
      u.email +
      `')"></i>
          <span class="tooltiptext">Xóa</span>
        </div>
      </td>
    </tr>
`;
  }

  s += `</table>`;
  tc.innerHTML = s;
}
// ================== Sort ====================

var decrease = true; // Sắp xếp giảm dần

// loại là tên cột, func là hàm giúp lấy giá trị từ cột loai
function quickSort(arr, left, right, loai, func) {
  var pivot, partitionIndex;

  if (left < right) {
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right, loai, func);

    //sort left and right
    quickSort(arr, left, partitionIndex - 1, loai, func);
    quickSort(arr, partitionIndex + 1, right, loai, func);
  }
  return arr;
}
// hàm của sắp xếp
function partition(arr, pivot, left, right, loai, func) {
  var pivotValue = func(arr[pivot], loai),
    partitionIndex = left;

  for (var i = left; i < right; i++) {
    if (
      (decrease && func(arr[i], loai) > pivotValue) ||
      (!decrease && func(arr[i], loai) < pivotValue)
    ) {
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
}

function swap(arr, i, j) {
  var tempi = arr[i].cloneNode(true);
  var tempj = arr[j].cloneNode(true);
  arr[i].parentNode.replaceChild(tempj, arr[i]);
  arr[j].parentNode.replaceChild(tempi, arr[j]);
}

function ThemTinTuc() {
  var News = layThongTinTinTucTuTable("KhungThemTinTuc");
  var u = getListNews();
  if (!News) return;
  var emailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
  if (!emailRegex.test(News.email)) {
    alert("Vui lòng nhập địa chỉ email hợp lệ (@gmail.com).");
    return;
  }

  // Kiểm tra mật khẩu tối thiểu 8 ký tự, phải có ít nhất một chữ hoa, một chữ thường và một số
  var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(News.password)) {
    alert(
      "Mật khẩu phải tối thiểu 8 ký tự và bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số."
    );
    return;
  }
  for (var p of u) {
    if (p.email == News.email) {
      alert("Email bị trùng !!");
      return false;
    }
  }

  listNews.push(News);
  // Lưu vào localstorage
  setListNews(listNews);
  addTableTinTuc();
  alert('Thêm tài khoản "' + News.email + '" thành công.');
  document.getElementById("KhungThemTinTuc").style.transform = "scale(0)";
  clearInputNews();
}
function clearInputNews() {
  document.getElementById("email").value = ""; // Thay "ho" bằng id của input họ
  document.getElementById("pass").value = ""; // Thay "ten" bằng id của input tên
}
function layThongTinTinTucTuTable(id) {
  const length = 28;

  // Chuỗi chứa các ký tự có thể được chọn
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Tạo chuỗi ngẫu nhiên

  var khung = document.getElementById(id);
  var tr = khung.getElementsByTagName("tr");

  var email = tr[1]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;
  var password = tr[2]
    .getElementsByTagName("td")[1]
    .getElementsByTagName("input")[0].value;

  if (!email || !password) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return false;
  }
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  // Sử dụng hàm băm để băm mật khẩu

  return {
    email: email,
    password: randomString,
    infor: {
      gio: "0",
      baihoanthanh: "0",
      tuvungdahoc: "0",
    },
  };
}

// Hàm băm mật khẩu

function xoaTinTuc(title) {
  if (window.confirm("Bạn có chắc muốn xóa tài khoản " + title)) {
    // Xóa
    for (var i = 0; i < listNews.length; i++) {
      if (listNews[i].email == title) {
        console.log(title);
        listNews.splice(i, 1);
      }
    }
    // Lưu vào localstorage
    setListNews(listNews);
    // Vẽ lại table
    addTableTinTuc();
  }
}
function addKhungSuaTinTuc(title) {
  var tt;
  for (var p of listNews) {
    if (p.email == title) {
      tt = p;
    }
  }
  var s =
    `<span class="close" onclick="this.parentElement.style.transform = 'scale(0)';">&times;</span>
  <table  style="margin-top: 300px;" class="overlayTable table-outline table-content table-header">
  <tr>
            <th colspan="2">` +
    tt.email +
    `</th>
        </tr>
     <tr>
            <td>Email:</td>
            <td><input type="text" value="` +
    tt.email +
    `"></td>
        </tr>
        <tr>
            <td>Pass:</td>
            <td><input type="text" value="` +
    tt.password +
    `"></td>
        </tr>
     <tr>
        <td colspan="2"  class="table-footer"> <button onclick="suaTinTuc('` +
    tt.email +
    `')">SỬA</button> </td>
     </tr>
  </table>
  `;
  var khung = document.getElementById("khungSuaTinTuc");
  khung.innerHTML = s;
  khung.style.transform = "scale(1)";
}
function suaTinTuc(title) {
  var tt = layThongTinTinTucTuTable("khungSuaTinTuc");
  if (!tt) return;
  // Sửa
  for (var i = 0; i < listNews.length; i++) {
    if (listNews[i].email == title) {
      listNews[i] = tt;
    }
  }
  // Lưu vào localstorage
  setListNews(listNews);

  // Vẽ lại table
  addTableTinTuc();

  alert("Sửa " + title + " thành công");

  document.getElementById("khungSuaTinTuc").style.transform = "scale(0)";
}
function sortNewsTable(loai) {
  var list = document
    .getElementsByClassName("tintuc")[0]
    .getElementsByClassName("table-content")[0];

  var tr = list.getElementsByTagName("tr");
  var td = tr.getElementsByTagName("td");

  quickSort(tr, 0, tr.length - 1, loai, Number(td[0].innerHTML)); // type cho phép lựa chọn sort theo mã hoặc tên hoặc giá ...
  decrease = !decrease;
}
function sortNewsTable(loai) {
  var list = document
    .getElementsByClassName("tintuc")[0]
    .getElementsByClassName("table-content")[0];
  var tr = list.getElementsByTagName("tr");
  quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTable_TinTuc); // type cho phép lựa chọn sort theo mã hoặc tên hoặc giá ...
  decrease = !decrease;
}

// Lấy giá trị của loại(cột) dữ liệu nào đó trong bảng
function getValueOfTypeInTable_TinTuc(tr, loai) {
  var td = tr.getElementsByTagName("td");
  switch (loai) {
    case "stt":
      return Number(td[0].innerHTML);
    case "email":
      return td[2].innerHTML.toLowerCase();
  }
  return false;
}
function timKiemTinTuc(inp) {
  var kieuTim = document.getElementsByName("kieutimtintuc")[0].value;
  var text = inp.value;
  // Lọc
  var vitriKieuTim = { email: 1 };

  var listTr_table = document
    .getElementsByClassName("tintuc")[0]
    .getElementsByClassName("table-content")[0]
    .getElementsByTagName("tr");
  for (var tr of listTr_table) {
    var td = tr
      .getElementsByTagName("td")
      [vitriKieuTim[kieuTim]].innerHTML.toLowerCase();
    console.log(td);
    if (td.indexOf(text.toLowerCase()) < 0) {
      tr.style.display = "none";
    } else {
      tr.style.display = "";
    }
  }
}
function setListNews(newList) {
  window.localStorage.setItem("listNews", JSON.stringify(newList));
}
function getListNews() {
  return JSON.parse(window.localStorage.getItem("listNews"));
}
