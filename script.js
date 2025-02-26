'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;
      let coords = [latitude, longitude];

      //sets the view to the current location
      const map = L.map('map').setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', function (mapEvent) {
        form.classList.remove('hidden');
        inputDistance.focus();

        //Modifies the form according to the type of activities
        //if Cycling---->Elev Gain on the form
        //if Running---->Cadence on the form

        form.addEventListener('submit', function (e) {
          e.preventDefault();

          //OnSubmit---->Adds marker to the page && adds the activity to the list

          const { lat, lng } = mapEvent.latlng;
          L.marker([lat, lng])
            .addTo(map)
            .bindPopup(
              L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
              })
            )
            .setPopupContent('Workout')
            .openPopup();
        });
      });
    },
    function () {
      alert('Unable to get location');
    }
  );

// let formattedCurrency = new Intl.NumberFormat(navigator.language, {
//   style: 'currency',
//   currency: 'USD',
// }).format(1399999999);

// console.log(formattedCurrency);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(900719925474099149999n);
// console.log(BigInt('900719925474099149999'));
