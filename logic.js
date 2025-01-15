let apiMainURL = "https://x8ki-letl-twmt.n7.xano.io/api:8ZImpl5O";				
let loader = document.querySelector('.loader-overlay')

if(document.getElementById('registerBtn')) {									
	document.getElementById('registerBtn').onclick = function(e) {				
		e.preventDefault();														

		let name = document.getElementById('name').value;
		let email = document.getElementById('email').value;
		let phone = document.getElementById('phone').value;
		let password = document.getElementById('password').value;
		let repeat_password = document.getElementById('repeat_password').value;			

		let apiEndpoint = apiMainURL + "/auth/signup";									

		let requestBody = {															
			name,
			email,
			phone,
			password,
			repeat_password
		}

		loader.style.display = 'flex';										

		fetch(apiEndpoint, {			
			method: 'POST',															
			headers: {
				'Content-Type': 'application/json'
			},																	
			body: JSON.stringify(requestBody)									
		})																			
		.then(data => {
			
			if(data.authToken){
				localStorage.setItem('authToken', data.authToken);			
																			
				window.location.href = 'novi_oglas.html';					
			}

			loader.style.display = 'none';							
		});													
	};															
}


if(document.getElementById('odjaviSe')) {
	document.getElementById('odjaviSe').onclick = function(e) {				
		e.preventDefault();

		localStorage.clear();
		window.location.href = 'index.html';							
	}
}


if(document.getElementById('noviOglasBtn')) {							
	document.getElementById('noviOglasBtn').onclick = function(e) {
		e.preventDefault();

		let apiEndpoint = apiMainURL + "/car";

		let formData = new FormData();							

		let marka = document.getElementById('marka').value;			
		let price = document.getElementById('price').value;
		let fuel = document.getElementById('fuel').value;
		let year = document.getElementById('year').value;
		let user_id = document.getElementById('user_id').value;				
		let karoserija = document.getElementById('karoserija').value;
		let file = document.getElementById('file');						

		formData.append('marka', marka);					
		formData.append('price', price);
		formData.append('fuel', fuel);
		formData.append('year', year);
		formData.append('user_id', user_id);				
		formData.append('karoserija', karoserija);
		formData.append('file', file.files[0]);						

		loader.style.display = 'flex';

		fetch(apiEndpoint, {
			method: 'POST',							
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			alert('Oglas uspešno dodat. Čeka se odobravanje administratora.');			
			location.reload();														
			loader.style.display = 'none';
		});
	}
}

if(document.getElementById('loginBtn')) {							
	document.getElementById('loginBtn').onclick = function(e) {	
		e.preventDefault();

		let email = document.getElementById('email').value;
		let password = document.getElementById('password').value;

		let apiEndpoint = apiMainURL + "/auth/login";

		let requestBody = {
			email,
			password
		}

		loader.style.display = 'flex';

		fetch(apiEndpoint, {										
			method: 'POST',															
			headers: {
				'Content-Type': 'application/json'
			},																	
			body: JSON.stringify(requestBody)													
		})																			
		.then(response => response.json())
		.then(data => {
			if (data.authToken) {
				localStorage.setItem('authToken', data.authToken);			
				window.location.href = 'novi_oglas.html';	

				loader.style.display = 'none';				
			}
		});								
	}
}


if (localStorage.getItem('authToken')) {													
	document.getElementById("navigation").innerHTML = `<a href="novi_oglas.html" class="btn btn-warning">Dodaj oglas</a>
														<a href="#" id="odjaviSe" class="btn btn-info">Odjavi se</a>`

	document.getElementById('odjaviSe').onclick = function(e) {
		e.preventDefault();
		localStorage.clear();
		window.location.href = 'index.html'
	};
}

if(document.getElementById('sviOglasi')) {						

	let currentUrl = window.location.href;
	if(!currentUrl.includes('?')) {							
		let apiEndpoint = apiMainURL + "/car";

		loader.style.display = 'flex';

		fetch(apiEndpoint)									
		.then(response => response.json())
		.then(cars => {

			let container = document.getElementById('sviOglasi');			

			cars.forEach(car => {

				let carElement = document.createElement('div');				

				carElement.className = 'col-sm-4';					
																	
				carElement.innerHTML = `
					<div class="car-item-wrapper">										
						<img src="${car.car_image.url}?tpl=big" alt="${car.marka}">
						<h4>${car.marka}</h4>
						<p>Cijena: ${car.price} €</p>
						<p>Godiste: ${car.year}</p>
						<a class="btn btn-warning" href="car.html?id=${car.id}">Vidi više</a>
					</div>
				`;

				container.appendChild(carElement);				
			});

			loader.style.display = 'none';
		});
	}
}

if(document.getElementById('appendImage')) {					
	let urlParams = new URLSearchParams(window.location.search);		
	let car_id = urlParams.get('id');

	let apiEndpoint = apiMainURL + "/car/" + car_id;					

	loader.style.display = 'flex';

	fetch(apiEndpoint)
	.then(response => response.json())
	.then(car => {

		car = car[0];													

		let imageContainer = document.querySelector('#appendImage');
		if (imageContainer) {
			let img = document.createElement('img');
			img.src = `${car.car_image.url}`;
			img.alt = car.marka;
			imageContainer.appendChild(img);								
		} else {
			alert('Image container #appendImage not found');
		}



		let contentContainer = document.querySelector('#appendContent');
		if (contentContainer) {												
			contentContainer.innerHTML = `									
				<h4>${car.marka}</h4>
				<p>Cijena: ${car.price} €</p>
				<p>Godiste: ${car.year}</p>
				<p>Gorivo: ${car.fuel}</p>
				<p>Karoserija: ${car.karoserija}</p>
				<p>Kontakt telefon: ${car._user.phone}</p>
			`;
			
		} else {
			alert('Content container #appendContent not found');
		}

		loader.style.display = 'none';
	})
}

if(document.getElementById('pretraziBtn')) {

	let currentUrl = window.location.href;				

	if(currentUrl.includes('?')) {
		let queryParams = new URLSearchParams(window.location.search);

		let marka = queryParams.get('marka');
		let year_from = queryParams.get('year_from');
		let year_to = queryParams.get('year_to');
		let price = queryParams.get('price');
		let gorivo = queryParams.get('gorivo');
		let karoserija = queryParams.get('karoserija');

		if(marka)													
			document.getElementById('marka').value = marka;
		if(gorivo)
			document.getElementById('gorivo').value = gorivo;
		if(karoserija)
			document.getElementById('karoserija').value = karoserija;
		if(year_from)
			document.getElementById('year_from').value = year_from;
		if(year_to)
			document.getElementById('year_to').value = year_to;
		if(price)
			document.getElementById('price').value = price;


		let apiEndpoint = apiMainURL + "/search";				
																
		apiEndpoint += `?marka=${encodeURIComponent(marka)}&year_from=${year_from}&year_to=${year_to}&price=${price}&gorivo=${encodeURIComponent(gorivo)}&karoserija=${encodeURIComponent(karoserija)}`;

		loader.style.display = 'flex';						

		fetch(apiEndpoint, {											
			method: 'GET',															
			headers: {
				'Content-Type': 'application/json'
			}																										
		})																			
		.then(response => response.json())
		.then(cars => {
			let container = document.querySelector('#sviOglasi');			
			container.innerHTML = '';										

			cars.forEach(car => {

				let carElement = document.createElement('div');				
				carElement.className = 'col-sm-4';
				carElement.innerHTML = `
				<div class="car-item-wrapper">										
					<img src="${car.car_image.url}?tpl=big" alt="${car.marka}">
					<h4>${car.marka}</h4>
					<p>Cijena: ${car.price} €</p>
					<p>Godiste: ${car.year}</p>
					<a class="btn btn-warning" href="car.html?id=${car.id}">Vidi više</a>
				</div>
			`;

				container.appendChild(carElement);

			});

			loader.style.display = 'none';					
		});
	}
}


