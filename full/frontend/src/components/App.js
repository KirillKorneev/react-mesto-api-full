import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { getToken, setToken } from '../utils/token.js';
import * as Auth from '../utils/auth.js';
import {Header} from  './Header.js';
import {Main} from './Main.js';
import {ProtectedRoute} from './ProtectedRouter.js';
import {Register} from './Register.js';
import {Login} from './Login.js';
import {NotificationPopup} from './NotificationPoopup.js';
import {Footer} from './Footer.js';
import {CurrentUserContext} from '../contexts/currentUserContext.js';
import {api} from '../utils/api.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [success, setSuccess] = React.useState(false);
  const [userData, setUserData] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(false);
  const history = useHistory();

  function startInfo() {
    Promise.all([
      api.getUserInformation('users/me'),
      api.getItems('cards')
    ])
    .then((res) => {
      const [userInfo, firstCards] = res;
      console.log(getToken());
      console.log(res);
      console.log(userInfo);
      setCards(firstCards);
      setCurrentUser(userInfo);
      console.log(userInfo);
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`)
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    
    if(isLiked) {
        api.removeLike('cards/likes', card._id)
          .then((newCard) => {
            const newCards = cards.map((c) => c._id === card._id ? newCard : c);
            setCards(newCards);
          })
          .catch(err => console.log(err));
    }
    else {
        api.putLike('cards/likes', card._id)
          .then((newCard) => {
            const newCards = cards.map((c) => c._id === card._id ? newCard : c);
            setCards(newCards);
          })
          .catch(err => console.log(err));
    }
  } 

  function handleEditAvatar() {
    setIsEditAvatarPopupOpen(true);
  }
  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleNotificationOpen() {
    setIsNotificationPopupOpen(true);
  }

  function handleSuccesToTrue() {
    setSuccess(true);
  }

  function handleSuccesToFalse() {
    setSuccess(false);
  }

  function deleteCard(card) {
    api.deleteItem('cards', card._id)
    .then(() => {
      const newCards = cards.filter((c) => c._id !== card._id);
      setCards(newCards);
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsNotificationPopupOpen(false);
    setSelectedCard({});
  }

  function handleUserUpdate({profileName, profileJob}) {
    api.profileEditing('users/me', profileName, profileJob)
    .then((res) => {
      setCurrentUser(res.data);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleAvatarUpdate(link) {
    api.avatarEditing('users/me/avatar', link)
    .then((res) => {
      setCurrentUser(res.data);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleCardsUpdate(name, link) {
    api.createItem('cards', name, link)
    .then((res) => {
      setCards([...cards, res.data]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Ошибка ${err}`);
    });
  }

  function handleLogin(userDataIn) {
    console.log(userDataIn);
    console.log(userData);
    setUserData(userDataIn.email);
    console.log(userData);
    setLoggedIn(true);
  }

  function handleLoginToFalse() {
    setLoggedIn(false);
  }

  function handleLoginSite(email, password) {
    Auth.authorize(email, password)
      .then((data) => {
        if (data.message === "Невалидные данные логина или пароля"){
          setSuccess(false);
          setIsNotificationPopupOpen(true);
          setLoggedIn(false);
        }
        else {
          console.log(data);
          //setToken(data.token);
          handleLogin(data);
          history.push('/');
        }
      })
      .catch((err) => {
        setLoggedIn(false);
        console.log(err)
      });
    //console.log(getToken());
    //tokenCheck();
    startInfo();
  }

  function handleRegisterSite(email, password) {
    Auth.register(email, password)
        .then((res) => {
          if (res.message !== "Такой пользователь уже существует") {
            setSuccess(true)
            setIsNotificationPopupOpen(true);
            history.push('/sign-in');
          }
          else {
            setLoggedIn(false);
            setSuccess(false)
            setIsNotificationPopupOpen(true);
          }
        })
        .catch((err) => console.log(err));
  }

  function tokenCheck() {
    const jwt = getToken();

    if (!jwt) {
      return;
    }

    //localStorage.removeItem('jwt');

    Auth.getContent(jwt)
    .then((res) => {
      if (res) {
        const userDataIn = res.email;
        setToken(jwt);
        setLoggedIn(true);
        setUserData(userDataIn);
        history.push('/')
      }
    })
    .catch((err) => {
      console.log(err);
      setLoggedIn(false);
    });
    startInfo();
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  return ( 
    <CurrentUserContext.Provider value={
      currentUser
    }>
      <div className="page">
        <Header 
          loggedIn={loggedIn}
          handleLoginToFalse={handleLoginToFalse}
          userData={userData}
        />
          <Switch>
            <ProtectedRoute exact
              path="/" 
              loggedIn={loggedIn}
              onEditAvatar = {handleEditAvatar}
              onEditProfile = {handleEditProfileClick}
              onAddPlace = {handleAddPlaceClick}  
              onCardClick = {handleCardClick}
              onClose = {closeAllPopups}
              isEditProfilePopupOpen = {isEditProfilePopupOpen}
              isAddPlacePopupOpen = {isAddPlacePopupOpen}
              isEditAvatarPopupOpen = {isEditAvatarPopupOpen}
              selectedCard = {selectedCard}
              cards = {cards}
              onDeleteCards = {deleteCard}
              onUpdateUser = {handleUserUpdate}
              onUpdateAvatar = {handleAvatarUpdate}
              onCardLike = {handleCardLike}
              onUpdateCards = {handleCardsUpdate}
              component={Main}
            />
            <Route path="/sign-in">
              <Login 
                handleLogin={handleLogin} 
                tokenCheck={tokenCheck} 
                handleNotificationOpen={handleNotificationOpen}
                handleSuccesToTrue={handleSuccesToTrue}
                handleSuccesToFalse={handleSuccesToFalse}
                handleLoginSite={handleLoginSite}
                //setData={setData}
                //data={data}
              />
            </Route>
            <Route path="/sign-up">
              <Register 
                handleNotificationOpen={handleNotificationOpen}
                handleSuccesToTrue={handleSuccesToTrue}
                handleSuccesToFalse={handleSuccesToFalse}
                handleRegisterSite={handleRegisterSite}
              />
            </Route>
            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>
        <NotificationPopup 
          success = {success}
          isOpen = {isNotificationPopupOpen} 
          onClose = {closeAllPopups}  
        />
        {loggedIn ? <Footer /> : ''}   
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
