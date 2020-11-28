import React from 'react';


function PopupWithForm(props) {
    return (
        <section className={`popup popup_${props.name} ${props.isOpen ? `popup_open` : ``}`}>
            <div className={`popup__edit popup__edit_${props.type}`}>
                <form noValidate name="formChange" className={`form form_${props.formType}`} action="#" method="post">
                    <h2 className={`form__title ${props.agree}`}>{props.formTitle}</h2>
                    {props.children}
                    <button name="buttonChangeSave" className={`form__button ${props.typeButton}`} aria-label={`${props.typeButton}`}>{props.buttonName}</button>
                </form>
                <button onClick={props.onClose} name="buttonChangeClose" type="button" className="popup__close"></button>
            </div>
        </section>
    );
}

export default PopupWithForm;