import React from 'react';

function EditAvatarPopup(props) {
    const avatar = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        console.log(avatar.current.value);
        props.onSubmit(avatar.current.value);

    }

    return (
        <section className={`popup popup_updatePhoto ${props.isOpen ? `popup_open` : ``}`}>
            <div className={`popup__edit popup__edit_update`}>
                <form noValidate name="formChange" className={`form form_update`} action="#" method="post">
                    <h2 className={`form__title ${props.agree}`}>Обновить аватар</h2>
                    <input id="job-input" name="inputChangeJob" ref={avatar} required className="form__input form__input_el_spec" type="text" minLength="2" maxLength="200" placeholder="Ссылка"/>
                    <span id="job-input-error" className="form__input-error form__input-error_el_spec"></span>
                    <button name="buttonChangeSave" className={`form__button`} onClick={handleSubmit} aria-label={`update`}>Сохранить</button>
                </form>
                <button onClick={props.onClose} name="buttonChangeClose" type="button" className="popup__close"></button>
            </div>
        </section>
    );
}

export default EditAvatarPopup;