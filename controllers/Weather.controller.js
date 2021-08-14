'use strict';

const Forecast = require('../models/Weather.model');
const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const data = require('../data/weather.json');
let newData = JSON.stringify(data);
let newData2 = JSON.parse(newData);
let cache = {};


const weather = (req, response) => {
  let key = req.params.city_name;
  let url1 = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${req.params.lat}&lon=${req.params.lon}&key=${WEATHER_API_KEY}&days=5`;
  if(cache[key]) {
    response.send(cache[key]);
    console.log('from our local');
  } else {
    console.log('from api');
    let newArr = [];
    let filtered;
    axios.get(url1).then(res => {
      cache[key] = res.data.data;
      filtered = res.data;
      newArr = filtered.data.map((el) => {return new Forecast(el);});
      response.send(newArr);
    }).catch(err => {
      response.status(500).send(err);
      console.log(err);
    });
  }
};

const weather1 = (req, res) => {
  let newArr = [];
  let cityWeather = newData2.find((el) => el.city_name === req.params.city_name);
  if(cityWeather) {
    cityWeather.data.map((el) => newArr.push(new Forecast(el)));
    res.send(newArr);
  } else {
    res.status(500).send('the location not found');
  }
};

const weather2 = (req, res) => {
  let city = newData2.find(el => el.lon === req.params.lon && el.lat === req.params.lat && el.city_name === req.params.city_name);
  if(city) {res.send(city);}
  else {res.status(500).send('Not Available');}
};

module.exports={weather, weather1, weather2};




