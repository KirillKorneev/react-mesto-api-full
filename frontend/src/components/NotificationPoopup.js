import React from 'react';
import Success from '../images/Union.svg';
import Failure from '../images/Union1.svg';

function NotificationPopup(props) {

    const Union = props.success ? Success : Failure;

    const successText = 'Вы успешно зарегистрировались!';
    const failtureText = 'Что-то пошло не так! Попробуйте ещё раз.'

    return (
        <section className={`popup popup_new ${props.isOpen ? `popup_open` : ``}`}>
            <div className={`popup__edit`}>
                <img className="popup__not" src={`${Union}`} alt="альтернативный текст" />
                <p className="popup__notInfo">{props.success ? successText : failtureText}</p>
                <button onClick={props.onClose} name="buttonChangeClose" type="button" className="popup__close"></button>
            </div>
        </section>
    );
}

export {NotificationPopup};