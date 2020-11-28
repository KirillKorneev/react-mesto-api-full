import { getToken } from './token.js';

class Api {
    constructor({baseURL, headers}) { //options https://mesto.nomoreparties.co/v1/cohortId/
        this.baseURL = baseURL;
        this.headers = headers;
    }

    _getResponseData(res) {
        if(res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);

    }

    getItems(id) { //id = cards +
        return fetch(`${this.baseURL}/${id}`, {
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            }
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }

    deleteItem(id, cardId) { //id = cards  cardId = cardId +
        return fetch(`${this.baseURL}/${id}/${cardId}`, {
            method: 'DELETE',
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            }
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }

    createItem(id, cardName, cardLink) { //id = cards +
        return fetch(`${this.baseURL}/${id}`, {
            method: 'POST',
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                name: cardName,
                link: cardLink
            })
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }

    putLike(id, cardId) { //id = cards/likes cardId = cardId +
        return fetch(`${this.baseURL}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            }
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }

    removeLike(id, cardId) { //id = cards/likes cardId = cardId
        return fetch(`${this.baseURL}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            }
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }

    getUserInformation(id) { // id = users/me +
        return fetch(`${this.baseURL}/${id}`, {
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            }
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }

    profileEditing(id, profileName, profileJob) { // id = users/me +
        return fetch(`${this.baseURL}/${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                name: profileName,
                about: profileJob
            })
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }

    avatarEditing(id, avatar) { // id = users/me/avatar +
        return fetch(`${this.baseURL}/${id}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                'authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                avatar: avatar
            })
        })
        .then(res => {
            return this._getResponseData(res);
        });
    }
}

export const api = new Api({
    baseURL: 'http://api.mestokorneev.students.nomoreparties.xyz',
    //baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
})
