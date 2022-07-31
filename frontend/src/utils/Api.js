class Api {
  constructor(baseUrl, headers) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleRes(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(console.log(`Ошибка: ${res.status}`));
    }
  }

  _getHeaders() {
    const jwt = localStorage.getItem('jwt');
    return {
      'Authorization': `Bearer ${jwt}`,
      ...this._headers
    }
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders()
    })
      .then(res => {
        return this._handleRes(res);
      })
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._getHeaders()
    })
      .then(res => {
        return this._handleRes(res);
      })
  }

  patchUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(res => {
        return this._handleRes(res);
      })
  }

  patchAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
      .then(res => {
        return this._handleRes(res);
      })
  }

  addNewCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
      .then(res => {
        return this._handleRes(res);
      })
  }

  deleteCard(data){
    return fetch(`${this._baseUrl}/cards/${data._id}`, {
      method: 'DELETE',
      headers: this._getHeaders()
    })
      .then(res => {
        return this._handleRes(res);
      })
  }

  addCardLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers:this._getHeaders()
    })
      .then(res => {
        return this._handleRes(res);
      })
  }

  removeCardLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers:this._getHeaders()
    })
      .then(res => {
        return this._handleRes(res);
      })
  }
}

const api = new Api(
  'https://api.mesto.vova.nomoredomains.xyz',
  {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
);

export default api;