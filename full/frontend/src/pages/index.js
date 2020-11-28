import {Card} from '../components/Card.js'; 
import {FormValidator} from '../components/FormValidator.js';
import {Section} from '../components/Section.js';
import {PopupWithImage} from '../components/PopupWithImage.js';
import {PopupWithForm} from '../components/PopupWithForm.js';
import {UserInfo} from '../components/UserInfo.js';
import {PopupChangeAvatar} from '../components/PopupChangeAvatar.js';
import {PopupAgreement} from '../components/PopupAgreement.js';
import {Api} from '../components/Api.js';
import {profileJob, profileName, inputChangeName, inputChangeJob, profileEdit, profileAddButton, formList,
        formInfo, initialCards, elements, cardInput, formChangeInfo, formAdd, formElement, formAddCard, addButton,
        profileChangeAvatarButton, changeAvatarButton, profilePhoto, popupUpdatePhoto, popupDeleteAgree} from '../utils/constants.js';

import '../pages/index.css';

///Абсолютно пустая секция
const cards = new Section({ 
    items: null,
    renderer: null
}, '.elements');


const api = new Api({
    baseURL: 'https://mesto.nomoreparties.co/v1/cohort-14', 
    headers: {
        'Content-Type': 'application/json',
        'authorization': '42b45684-18cf-461b-be7b-02246c8d8e0d'
    }
})

///Попап удаления карточки
const popupDeleteCard = new PopupAgreement('.popup_agreement', () => {});
popupDeleteCard.setEventListeners();

///Валидация форм
formList.forEach((formElement) => {
    const form = new FormValidator(formInfo, formElement);
    form.enableValidation();
});

///Слушатели формы смены имени и работы
const popupInfoCurrent = new UserInfo({
    userInfo: profileJob,
    userName: profileName,
    userAvatar: profilePhoto
});

function renderLoading(element, isLoading, loadingText, usualText) {
    if (isLoading) {
        element.querySelector('.form__button').textContent = loadingText;
    }
    else {
        element.querySelector('.form__button').textContent = usualText;
    }
}

function generateCard(cardId, res, userId) {
    const card = new Card({
        cardName: res.name, 
        cardLink: res.link,
        handleCardClick: () => {
            popupZoomPhoto.open(res.name, res.link);
        },
        handleLikeClick: () => {
            if(!card.isLiked()) {
                api.putLike('cards/likes', cardId)
                .then(data => {
                    card.toggleLikeButton();
                    card.plusLike(res);
                })
                .catch((err) => {
                    console.log(`Ошибка ${err}`)
                });
            }
            else {
                api.removeLike('cards/likes', cardId)
                .then(data => {
                    card.toggleLikeButton();
                    card.minusLike(res);
                })
                .catch((err) => {
                    console.log(`Ошибка ${err}`)
                });
            }
        },
        handleDeleteIconClick: () => {
            popupDeleteCard.setSubmitAction(_ => {
                renderLoading(popupDeleteAgree, true, 'Удаление...', 'Удалить');
                api.deleteItem('cards', cardId)
                .then(data => {
                    card.removeCard();
                    popupDeleteCard.close();
                })
                .catch((err) => {
                    console.log(`Ошибка ${err}`)
                })
                .finally(() => {
                    renderLoading(popupDeleteAgree, false, 'Удаление...', 'Удалить');
                });
            })
            popupDeleteCard.open();
        }
    }, '#tem-element');
    const cardElement = card.generateCards();
    if(!card.getView(userId, res.owner._id)) {
        card.removeTrash()
    }
    for(let i = 0; i < res.likes.length; i++) {
        if (res.likes[i]._id === userId) {
            card.toggleLikeButton();
        }
    }
    card.setLikes(res);
    cards.addItem(cardElement);
}

///Установка начальных значений страницы
Promise.all([
    api.getUserInformation('users/me'),
    api.getItems('cards')
])
.then((res) => {
    const [userInfo, firstCards] = res;
    popupInfoCurrent.setUserInfo({
        name: userInfo.name, 
        job: userInfo.about,
        url: userInfo.avatar
    });
    const userId = userInfo._id;
    const cards = new Section({
        items: firstCards,
        renderer: (item) => {
            const cardId = item._id;
            generateCard(cardId, item, userId);
        }
    }, '.elements');
    cards.renderItems();
})
.catch((err) => {
    console.log(`Ошибка ${err}`)
});

const popupInfoForm = new PopupWithForm('.popup_info', (inputList) => {
    renderLoading(formElement, true, 'Сохранение...', 'Сохранить');
    api.profileEding('users/me', inputList.inputChangeName, inputList.inputChangeJob)
    .then(res => {
        popupInfoCurrent.setUserInfo({
            name: res.name, 
            job: res.about,
            url: res.avatar
        });
        popupInfoForm.close();
    })
    .catch((err) => {
        console.log(err); // выведем ошибку в консоль
    })
    .finally(() => {
        renderLoading(formElement, false, 'Сохранение...', 'Сохранить');
    });
});

popupInfoForm.setEventListeners();

profileEdit.addEventListener('click', () => {
    const currentData = popupInfoCurrent.getUserInfo();
    inputChangeName.value = currentData.name;
    inputChangeJob.value = currentData.job;
    popupInfoForm.open();
});

///Увеличенное фото
const popupZoomPhoto = new PopupWithImage('.popup_photo');
popupZoomPhoto.setEventListeners();

profileAddButton.addEventListener('click', () => {
    addButton.disabled = 'true';
    addButton.classList.add('form__button_inactive');
    popupNewCardForm.open();
}); 

///Слушатели формы добавления карточек
const popupNewCardForm = new PopupWithForm('.popup_new', () => {
    renderLoading(formAddCard, true, 'Создание...', 'Создать');
    const cardValue = {
        name: cardInput.name.value,
        link: cardInput.link.value
    };
    Promise.all([
        api.getUserInformation('users/me'),
        api.createItem('cards', cardValue.name, cardValue.link)
    ])
    .then((res) => {
        const [userInfo, item] = res;
        const userId = userInfo._id;
        const cardId = item._id;
        generateCard(cardId, item, userId);
        popupNewCardForm.close();
    })
    .catch((err) => {
        console.log(`Ошибка ${err}`);
    })
    .finally(() => {
        renderLoading(formAddCard, false, 'Создание...', 'Создать');
    });
});

popupNewCardForm.setEventListeners();

///Слушатели смены фотографии
const popupChangePhoto = new PopupWithForm('.popup_updatePhoto', (value) => {
    renderLoading(popupUpdatePhoto, true, 'Сохранение...', 'Сохранить');
    api.avatarEding('users/me/avatar', value.inputAddName)
    .then(res => {
        popupInfoCurrent.setUserInfo({
            name: res.name, 
            job: res.about,
            url: res.avatar
        });
        popupChangePhoto.close();
    })
    .catch((err) => {
        console.log(err); // выведем ошибку в консоль
    })
    .finally(() => {
        renderLoading(popupUpdatePhoto, false, 'Сохранение...', 'Сохранить');
    });
});

popupChangePhoto.setEventListeners();

profileChangeAvatarButton.addEventListener('click', () => {
    changeAvatarButton.disabled = 'true';
    changeAvatarButton.classList.add('form__button_inactive');
    popupChangePhoto.open();
});


