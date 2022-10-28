let searchName = document.getElementById('searchName');
let searchLetter = document.getElementById('searchLetter');
let userName = document.getElementById('userName');
let userEmail = document.getElementById('userEmail');
let userPhone = document.getElementById('userPhone');
let userAge = document.getElementById('userAge');
let userPass = document.getElementById('userPass');
let userRePass = document.getElementById('userRePass');
let usersInfo = [];

if (localStorage.getItem('User') != null) {
	usersInfo = JSON.parse(localStorage.getItem('User'));
}
console.log(usersInfo);
// SEARCH BY NAME
async function searchMeal(mealName) {
	let meal = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
	if (meal.ok && meal.status != 400) {
		meal = await meal.json();
		meal = meal.meals;
		displayMeals(meal);
	}
}

$(searchName).keyup((e) => {
	searchMeal(e.target.value);
});
// SEARCH BY LETTER
async function searchByLetter(mealName) {
	let meal = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealName}`);
	if (meal.ok && meal.status != 400) {
		meal = await meal.json();
		meal = meal.meals;
		displayMeals(meal);
	}
}

$(searchLetter).keyup((e) => {
	searchMeal(e.target.value);
});

// DISPLING SEARCH SEACTION
function displaySearch() {
	$('#sidebar').toggleClass('visible');
	$(`#sideUL`).fadeToggle(1000);
	$(`#hideMain`).removeClass(`d-none`);
	$(`#searchSection`).removeClass(`d-none`);
	$(`#hideContact`).addClass(`d-none`);
	$('#mainSection').empty();
}
// DISPLAY CATEGORY SECTION
async function displayCategories() {
	$('#sidebar').toggleClass('visible');
	$(`#sideUL`).fadeToggle(1000);
	$(`#hideMain`).removeClass(`d-none`);
	$(`#hideContact`).addClass(`d-none`);
	$(`#searchSection`).addClass(`d-none`);
	let categ = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
	if (categ.ok && categ.status != 400) {
		let finalCateg = await categ.json();
		let catArray = finalCateg.categories;

		let c = ``;
		for (i = 0; i < catArray.length; i++) {
			c += `<div class="item col-md-6 col-lg-3 ">
					<div class="meal overflow-hidden position-relative" onclick="filterByCategory('${catArray[i].strCategory}')">
						<img src="${catArray[i].strCategoryThumb}" alt="" class="w-100" />
						<div class="meal-Info">
							<h2>${catArray[i].strCategory}</h2>
							<p>${catArray[i].strCategoryDescription.split(' ').slice(0, 20).join(' ')}</p>
						</div>
					</div>
				</div>`;
		}
		document.getElementById('mainSection').innerHTML = c;
	}
}

//  MEALS FILTRING THE MEALS Categories
async function filterByCategory(category) {
	let meals = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
	if (meals.ok && meals.status != 400) {
		meals = await meals.json();
		let mealsArray = meals.meals;
		let f = ``;
		for (i = 0; i < mealsArray.length; i++) {
			f += `<div class="item col-md-6 col-lg-3 position-relative">
						<div	 class="meal overflow-hidden position-relative" onclick="getMeal('${mealsArray[i].idMeal}')">
							<img src="${mealsArray[i].strMealThumb}" alt="" class="w-100" />
						<div class="meal-Info">
							<h2>${mealsArray[i].strMeal}</h2>
						</div>
						</div>
				</div>`;
		}
		document.getElementById('mainSection').innerHTML = f;
	}
}

// GETTING MEAL IP TO GET ITS DESCRIPTION
async function getMeal(mealID) {
	let meal = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
	if (meal.ok && meal.status != 400) {
		meal = await meal.json();
		displayMealDesc(meal.meals[0]);
	}
}

// MEAL DESCRIPTION
async function displayMealDesc(meal) {
	// Recipes Section
	let recipes = ``;
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			recipes += `<li class="my-3 mx-1 p-2 rounded">
			${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}
			</li>`;
		}
	}

	// TAGS SECTION
	let tags = meal.strTags?.split(',');
	let tagsStr = '';
	for (i = 0; i < tags?.length; i++) {
		tagsStr = `<li class="my-3 mx-1 p-2 rounded">${tags[i]}</li>`;
	}
	// MAIN SECTION
	let str = `
	<div class="col-md-4 my-3 text-white d-flex flex-column justify-content-center align-items-center">
	<img src="${meal.strMealThumb}" alt="" class="w-100 mb-3 rounded-2" />
	<h1>${meal.strMeal}</h1>
</div>
								


									<div class="col-md-8 text-start">
									<h2>Instructions</h2>
									<p class="">${meal.strInstructions}</p>
									<p><b class="fw-bolder">Area :</b> ${meal.strArea}</p>
									<p><b class="fw-bolder">Category :</b> ${meal.strCategory}</p>
									<h3>Recipes :</h3>
									<ul class="d-flex flex-wrap m-0 py-0 px-2" id="recipes">
									</ul>
									<h3 class="my-2 mx-1 p-1">Tags :</h3>
									<ul class="d-flex flex-wrap m-0 py-0 px-2" id="tags">
									</ul>
									<h3 class="my-2 mx-1 p-1">Sources :</h3>
									<a class="btn btn-secondary text-white py-2 px-4 mx-2" target="_blank" href="${meal.strSource}">Article</a>
									<a class="btn btn-danger text-white py-2 px-4 mx-2" target="_blank" href="${meal.strYoutube}">YouTube</a>
								</div>
								


	`;
	document.getElementById('mainSection').innerHTML = str;
	document.getElementById('recipes').innerHTML = recipes;
	document.getElementById('tags').innerHTML = tagsStr;
}

//////////////////////////////////// AREA SECTION

async function displayArea() {
	$('#sidebar').toggleClass('visible');
	$(`#sideUL`).fadeToggle(1000);
	$(`#searchSection`).addClass(`d-none`);
	let area = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
	if (area.ok && area.status != 400) {
		area = await area.json();
		area = area.meals;
		let a = ``;
		for (i = 0; i <= 19; i++) {
			a += `
			<div class="col-md-6 col-lg-3 my-3" >
			<div class="post p-3 border rounded-3 " id="city" onclick="filterByArea('${area[i].strArea}')">
				<i class="fa-solid fa-city fa-3x text-danger"></i>
				<h2 class="text-white">${area[i].strArea}</h2>
			</div>
		</div>
			`;
		}
		document.getElementById('mainSection').innerHTML = a;
	}
}

async function filterByArea(city) {
	let meal = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${city}`);
	if (meal.ok && meal.status != 400) {
		meal = await meal.json();
		mealsArray = meal.meals;
		displayMeals(mealsArray);
	}
}

function displayMeals(meals) {
	let c = ``;
	for (i = 0; i < meals.length; i++) {
		c += `<div class="item col-md-6 col-lg-3 ">
					<div class="meal overflow-hidden position-relative" onclick="getMeal('${meals[i].idMeal}')">
						<img src="${meals[i].strMealThumb}" alt="" class="w-100" />
						<div class="meal-Info">
							<h2>${meals[i].strMeal}</h2>
						</div>
					</div>
				</div>`;
	}
	document.getElementById('mainSection').innerHTML = c;
}

//////////////////// Ingredients SECTION

async function getIngredients() {
	$(`#hideMain`).removeClass(`d-none`);
	$(`#hideContact`).addClass(`d-none`);
	$('#sidebar').toggleClass('visible');
	$(`#sideUL`).fadeToggle(1000);
	let meal = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
	if (meal.ok && meal.status != 400) {
		meal = await meal.json();
		mealsArray = meal.meals;
		displayIngredients(mealsArray);
	}
}

function displayIngredients(array) {
	$(`#searchSection`).addClass(`d-none`);
	let c = ``;
	for (i = 0; i <= 19; i++) {
		c += `<div class=" col-md-6 col-lg-3 ">
					<div class="meal overflow-hidden position-relative rounded-2 p-3" onclick="filterByIngredients('${array[i].strIngredient}')">
						<i class="fa-solid fa-bowl-food fa-3x text-success"></i>
						<div class="Ingredients ">
							<h2>${array[i].strIngredient}</h2>
							<p>${array[i].strDescription.split(' ').slice(0, 20).join(' ')}</p>
						</div>
					</div>
				</div>`;
	}
	document.getElementById('mainSection').innerHTML = c;
}

async function filterByIngredients(ingredient) {
	let meal = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);

	if (meal.ok && meal.status != 400) {
		meal = await meal.json();
		meal = meal.meals;
		displayMeals(meal);
	}
}

/////////////////// CONTACT SECTION
function emailExists() {
	let result = false;
	for (i = 0; i < usersInfo.length; i++) {
		if (userEmail.value == usersInfo[i].mail) {
			result = true;
			$(`#invalidEmail`).removeClass(`d-none`);
		}
	}
	if (result == false) {
		$(`#invalidEmail`).addClass(`d-none`);
		getUserInfo()
		
	}
}
function getUserInfo() {
	let user = {
		name: userName.value,
		mail: userEmail.value,
		phone: userPhone.value,
		age: userAge.value,
		pass: userPass.value,
		repass: userRePass.value,
	};
	usersInfo.push(user);
	localStorage.setItem('User', JSON.stringify(usersInfo));
	clearForm();
	$(`#success`).removeClass(`d-none`);
	$('#submetData').addClass(`disabled`);
}

$(`#submetData`).click(() => {
	emailExists();
});

// CLEAR FORM
function clearForm() {
	userName.value = ``;
	userEmail.value = ``;
	userPhone.value = ``;
	userAge.value = ``;
	userPass.value = ``;
	userRePass.value = ``;
}

// VALIDATION SECTION
let uNameValid = false;
let uEmailValid = false;
let uPHoneValid = false;
let uAgeValid = false;
let uPasswordValid = false;
let uRePasswordValid = false;

function userNameValid() {
	let regex = /^[a-zA-Z ]+$/;
	return regex.test(userName.value);
}

$(`#userName`).keyup(() => {
	Validation();
});

////// EMAIL REGEX

function userEmailValid() {
	let regex = /^([a-z\d\.-]+)@([a-z]{2,8})\.([a-z]{2,10})$/;
	return regex.test(userEmail.value);
}
$(`#userEmail`).keyup(() => {
	Validation();
});

////// PHONE REGEX

function userPHoneValid() {
	let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
	return regex.test(userPhone.value);
}
$(`#userPhone`).keyup(() => {
	Validation();
});
////// AGE REGEX
function userAgeValid() {
	let regex = /^[1-9][0-9]?$|^100$/;
	return regex.test(userAge.value);
}

////// PASSWORD REGEX
function userPasswordValid() {
	let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	return regex.test(userPass.value);
}

////// SECOND PASSWORD REGEX
$(`#userRePass`).keyup(() => {
	Validation();
});

// VALIDATION FUNCTION
function Validation() {
	if (userPass.value == userRePass.value) {
		$(`#rePassAlert`).addClass(`d-none`);
		uRePasswordValid = true;
	} else {
		$(`#rePassAlert`).removeClass(`d-none`);
		uRePasswordValid = false;
	}
	///////////////
	if (userPasswordValid()) {
		$(`#passAlert`).addClass(`d-none`);
		uPasswordValid = true;
	} else {
		$(`#passAlert`).removeClass(`d-none`);
		uPasswordValid = false;
	}
	//////////////////
	if (userAgeValid()) {
		$(`#ageAlert`).addClass(`d-none`);
		uAgeValid = true;
	} else {
		$(`#ageAlert`).removeClass(`d-none`);
		uAgeValid = false;
	}
	//////////////////
	if (userPHoneValid()) {
		$(`#phoneAlert`).addClass(`d-none`);
		uPHoneValid = true;
	} else {
		$(`#phoneAlert`).removeClass(`d-none`);
		uPHoneValid = false;
	}
	//////////////////
	if (userEmailValid()) {
		$(`#mailAlert`).addClass(`d-none`);
		uEmailValid = true;
	} else {
		$(`#mailAlert`).removeClass(`d-none`);
		uEmailValid = false;
	}
	//////////////////
	if (userNameValid()) {
		$('#NameAlert').addClass('d-none');
		uNameValid = true;
	} else {
		$('#NameAlert').removeClass('d-none');
		uNameValid = false;
	}
	//////////////////
	if (uNameValid == true && uEmailValid == true && uPHoneValid == true && uAgeValid == true && uPasswordValid == true && uRePasswordValid == true) {
		$('#submetData').removeClass(`disabled`);
	} else {
		$('#submetData').addClass(`disabled`);
	}
}

function displayContact() {
	$(`#hideMain`).addClass(`d-none`);
	$(`#hideContact`).removeClass(`d-none`);
	$('#sidebar').toggleClass('visible');
	$(`#sideUL`).fadeToggle(1000);
}
// SIDE- BAR

$('#sidebar-btn').click(function () {
	$('#sidebar').toggleClass('visible');
	$(`#sideUL`).fadeToggle(1000);
});

searchMeal(``);

$(document).ready(function () {
	$(`#loading .sk-folding-cube`).fadeOut(500, () => {
		$(`#loading`).fadeOut(500, () => {
			$(`#loading`).remove();
			$(`body`).css(`overflow`, `auto`);
		});
	});
});

