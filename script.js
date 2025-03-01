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

//Implements the Workout class
class Workout {
  date = new Date();
  id = (+new Date() + '').slice(-10);

  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
}

class Running extends Workout {
  constructor(distance, duration, coords, cadence, pace) {
    super(distance, duration, coords);

    this.cadence = cadence;
    this.pace = pace;
  }
}

class Cycling extends Workout {
  constructor(distance, duration, coords, elevationGain, speed) {
    super(distance, duration, coords);

    this.elevationGain = elevationGain;
    this.speed = speed;
  }
}

////////////////////////////////////////
//Implements the App class
class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();

    //Changes the type of activity on change
    inputType.addEventListener('change', this._toggleElevationField);

    //FORM
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Unable to get location');
        }
      );
  }

  _loadMap(position) {
    console.log(this);
    const { latitude, longitude } = position.coords;
    let coords = [latitude, longitude];
    //sets the view to the current location
    this.#map = L.map('map').setView(coords, 13);

    // console.log(this.#map);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // console.log(this.#map);
    // console.log(this);

    //Handling events on map using the map object
    this.#map.on('click', this._showForm.bind(this));
    // console.log(this);
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    //OnSubmit---->Adds marker to the page
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
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

    //Clear input on submit
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }
}

const app = new App();

// let formattedCurrency = new Intl.NumberFormat(navigator.language, {
//   style: 'currency',
//   currency: 'USD',
// }).format(1399999999);

// console.log(formattedCurrency);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(900719925474099149999n);
// console.log(BigInt('900719925474099149999'));

//CLASS
// class Workout {
//   #id;
//   #date;

//   constructor(id, distance, duration, coords, date) {
//     this.#id = id;
//     this.distance = distance;
//     this.duration = duration;
//     this.coords = coords;
//     this.#date = date;
//   }
// }

// class Running extends Workout {
//   #fName;

//   constructor(id, distance, duration, coords, date, fName, cadence, pace) {
//     super(id, distance, duration, coords, date);

//     this.#fName = fName;
//     this.cadence = cadence;
//     this.pace = pace;
//   }
// }

// class Cycling extends Workout {
//   #fName;
//   constructor(
//     id,
//     distance,
//     duration,
//     coords,
//     date,
//     fName,
//     elevationGain,
//     speed
//   ) {
//     super(id, distance, duration, coords, date);

//     this.#fName = fName;
//     this.elevationGain = elevationGain;
//     this.speed = speed;
//   }
// }
