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

// let btn_signIn = document.querySelector('.login__sign-in');
// let btn_signUp = document.querySelector('.login__sign-up');
// let form_signIn = document.querySelector('.form__sign-in');
// let form_signUp = document.querySelector('.form__sign-up');

// btn_signIn.onclick = function(){
// 	if (!btn_signIn.classList.contains('login__nav-item_active')){
// 		btn_signIn.classList.add("login__nav-item_active");
// 		btn_signUp.classList.remove("login__nav-item_active");
// 		form_signIn.classList.add("form__active");
// 		form_signUp.classList.remove("form__active");
// 		console.log('sign in 1')
// 	}
// }
// btn_signUp.onclick = function () {
// 	if (!btn_signUp.classList.contains('login__nav-item_active')) {
// 		btn_signIn.classList.remove("login__nav-item_active");
// 		btn_signUp.classList.add("login__nav-item_active");
// 		form_signIn.classList.remove("form__active");
// 		form_signUp.classList.add("form__active");
// 	}
// }

let cards = document.querySelectorAll('.meet__item_actual');
let notice = document.querySelector('.sidebar-menu__notice');
notice.innerHTML = cards.length;
