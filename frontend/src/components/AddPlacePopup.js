import React from 'react';

function AddPlacePopup(props) {
    const name = React.useRef();
    const link = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        
        props.onSubmit(name.current.value, link.current.value);

    }

    return (
        <section className={`popup popup_new ${props.isOpen ? `popup_open` : ``}`}>
            <div className={`popup__edit popup__edit_newPlace`}>
                <form noValidate name="formChange" className={`form form_new`} action="#" method="post">
                    <h2 className={`form__title ${props.agree}`}>Новое место</h2>
                    <input id="name-input" name="inputChangeName" required className="form__input form__input_el_name" type="text" minLength="2" maxLength="40" placeholder="Название" ref={name} />
                    <span id="name-input-error" className="form__input-error form__input-error_el_name"></span>
                    <input id="job-input" name="inputChangeJob" required className="form__input form__input_el_spec" type="text" minLength="2" maxLength="200" placeholder="Ссылка на картинку"  ref={link}/>
                    <span id="job-input-error" className="form__input-error form__input-error_el_spec"></span>
                    <button name="buttonChangeSave" className={`form__button`} onClick={handleSubmit} aria-label={``}>Создать</button>
                </form>
                <button onClick={props.onClose} name="buttonChangeClose" type="button" className="popup__close"></button>
            </div>
        </section>
    );
}

export default AddPlacePopup;