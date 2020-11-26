import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

function Register(props) {

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const history = useHistory();

    function handleChange(e) {
        const {name, value} = e.target;
        setData((prevData) =>( {
            ...prevData,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const { email, password } = data;
        props.handleRegisterSite(email, password);
    }

    return (
        <main className="content">
            <section className="auth">
                <form noValidate onSubmit={handleSubmit} name="formAuth" className="authform" action="#" method="post">
                    <h2 className="authform__title">Регистрация</h2>
                    <input id="email-input" onChange={handleChange} value={data.email} name="email" className="authform__input authform__input_el_email" type="email" placeholder="Email"/>
                    <input id="pass-input" onChange={handleChange} value={data.password} name="password" className="authform__input authform__input_el_pass" type="password" placeholder="Пароль"/>
                    <button name="buttonAuth" className="authform__button">Зарегистироваться</button>
                </form>
                <p className="auth__login" >
                <Link to="/sign-in" className="auth__link">Уже зарегистрированы? Войти</Link>
                </p>
            </section>
        </main>
    );
}

export {Register};