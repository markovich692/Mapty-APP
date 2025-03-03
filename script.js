'use strict';

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

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setdescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);

    this.cadence = cadence;

    this.calcPace();

    this._setdescription();
  }

  calcPace() {
    //min/km
    this.pace = this.duration / this.cadence;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);

    this.elevation = elevationGain;

    this.calcSpeed();

    this._setdescription();
  }

  calcSpeed() {
    //km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

////////////////////////////////////////
//Implements the App class
class App {
  #map;
  #mapEvent;
  #workouts = [];

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
    // console.log(this);
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

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    inputType.value = 'running';

    form.style.display = 'none';

    form.classList.add('hidden');

    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = function (...inputs) {
      return inputs.every(inp => Number.isFinite(inp));
    };

    const allPositive = function (...inputs) {
      return inputs.every(inp => inp > 0);
    };

    e.preventDefault();

    //Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //If workout is Running create a running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      //Checks if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Input must be a positive number');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    //If workout is Cycling create a cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //Checks if data is valid

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Input must be a positive number');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //Adds new object to workout array
    this.#workouts.push(workout);
    // console.log(type);

    //Render workout on map as marker

    this._renderWorkoutMarker(workout);

    //Render workout on list
    // this._renderWorkout(this.#workouts);
    this._renderWorkout(workout);

    //Remove form + clear input on submit
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}
          ${workout.description}
        `
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    const html = `<li class="workout workout--${workout.type}" data-id=${
      workout.id
    }>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon"> ${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }  </span>
            <span class="workout__value"> ${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">
            ${
              workout.type === 'running'
                ? workout.pace.toFixed(1)
                : workout.speed.toFixed(1)
            }
            </span>
            <span class="workout__unit">
            ${workout.type === 'running' ? 'min/km' : 'km/h'}
            </span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">
            ${workout.type === 'running' ? '🦶🏼' : '⛰'}
            </span>
            <span class="workout__value">
            ${workout.type === 'running' ? workout.cadence : workout.elevation}
            </span>
            <span class="workout__unit">
            ${workout.type === 'running' ? 'spm' : 'm'}
            </span>
          </div>
      </li>   
          `;

    form.insertAdjacentHTML('afterend', html);
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
