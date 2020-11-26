import React from 'react';
import { Link, Route, useHistory } from 'react-router-dom';
import { removeToken } from '../utils/token.js';

function Header(props) {

  const history = useHistory();

  function signOut(){
    removeToken();
    props.handleLoginToFalse();
    history.push('/sign-up');
  }

  function toggleActivNav() {
    document.querySelector('.header__navbar').classList.toggle('header__navbar_active')
    document.querySelector('.header').classList.toggle('header_active');
  }

  return (
    <>
    <div className="header__navbar">
        <Route path="/sign-up">
          <Link className="header__button header__button_nav" to="/sign-in">Войти</Link>
        </Route>
        <Route path="/sign-in">
          <Link className="header__button header__button_nav" to="/sign-up">Зарегестрироваться</Link>
        </Route>
        {props.loggedIn ? <p className="header__user header__user_nav">{props.userData.email}</p> : ''}
        {props.loggedIn ? <Link onClick={signOut} className="header__button header__button_nav" to="/sign-up">Выйти</Link> : ''}
    </div>
    <header className="header">
        <div className="header__logo"></div>
        <div className="header__nav">
          <Route path="/sign-up">
            <Link className="header__button" to="/sign-in">Войти</Link>
          </Route>
          <Route path="/sign-in">
            <Link className="header__button" to="/sign-up">Зарегестрироваться</Link>
          </Route>
          {props.loggedIn ? <p className="header__user">{props.userData.email}</p> : ''}
          {props.loggedIn ? <Link onClick={signOut} className="header__button" to="/sign-up">Выйти</Link> : ''}
        </div>
        <div onClick={toggleActivNav} className="header__navBut">
          <div className="header__line"></div>
          <div className="header__line"></div>
          <div className="header__line"></div>
        </div>
    </header>
    
    </>
  );
}

export {Header};