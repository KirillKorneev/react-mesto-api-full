import React from 'react';
import {CurrentUserContext} from '../contexts/currentUserContext.js';

function EditProfilePopup(props) {
    const currentUser = React.useContext(CurrentUserContext);

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser]); 

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onSubmit(name, description);
    }

    return (
        <section className={`popup popup_info ${props.isOpen ? `popup_open` : ``}`}>
            <div className={`popup__edit popup__edit_changeName`}>
                <form noValidate name="formChange" className={`form form_change`} action="#" method="post">
                    <h2 className={`form__title`}>Редактировать профиль</h2>
                    <input id="name-input" name="inputChangeName" required className="form__input form__input_el_name" type="text" minLength="2" maxLength="40" placeholder="Введите имя" value={name} onChange={handleChangeName}/>
                    <span id="name-input-error" className="form__input-error form__input-error_el_name"></span>
                    <input id="job-input" name="inputChangeJob" required className="form__input form__input_el_spec" type="text" minLength="2" maxLength="200" placeholder="Специализация" value={description} onChange={handleChangeDescription}/>
                    <span id="job-input-error" className="form__input-error form__input-error_el_spec"></span>
                    <button name="buttonChangeSave" className={`form__button`} onClick={handleSubmit} aria-label={`save`}>Сохранить</button>
                </form>
                <button onClick={props.onClose} name="buttonChangeClose" type="button" className="popup__close"></button>
            </div>
        </section>
    );
}

export default EditProfilePopup;