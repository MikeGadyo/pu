// import 'fslightbox'; // Lightbox: npm install fslightbox, site: https://fslightbox.com/javascript/documentation
// import Swiper from 'swiper'; // Slider: npm install swiper, site: https://swiperjs.com/get-started
// import AirDatepicker from 'air-datepicker'; // Datepicker: npm i air-datepicker -S, site: https://air-datepicker.com/ru
let sidebar = document.querySelector(".sidebar");
let burger = document.querySelector(".sidebar__burger");
burger.onclick = function () {
	sidebar.classList.toggle("sidebar__is-open");
}

let accountName = document.querySelector('.sidebar-account__name')
accountName.innerHTML = accountName.innerText.split(" ")[0] + " " + accountName.innerText.split(" ")[1][0];

