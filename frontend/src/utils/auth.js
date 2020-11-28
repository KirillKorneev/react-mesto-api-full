import { setToken, getToken } from './token.js';

//export const BASE_URL = 'http://api.mestokorneev.students.nomoreparties.xyz';
export const BASE_URL = 'http://localhost:3000';


export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then((response) => {
    return response.json();
  })
  .then((res) => {
    return res;
  })
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then((response) => response.ok ? response.json() : Promise.reject(`Ошибка: ${response.status}`))
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then((response) => response.ok ? response.json() : Promise.reject(`Ошибка: ${response.status}`))
}

