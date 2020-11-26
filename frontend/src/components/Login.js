import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login(props) {
    const history = useHistory();

    function handleChange(e) {
        const {name, value} = e.target;
        props.setData((prevData) =>( {
            ...prevData,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const { email, password } = props.data;

        if (!email || !password){
            return;
        }

        props.handleLoginSite(email, password);

    }

    return (
        <main className="content">
            <section className="auth">
                <form noValidate onSubmit={handleSubmit} name="formAuth" className="authform" action="#" method="post">
                    <h2 className="authform__title">Вход</h2>
                    <input onChange={handleChange} value={props.data.email} id="email-input" name="email" required className="authform__input authform__input_el_email" type="email" minLength="2" maxLength="200" placeholder="Email"/>
                    <input onChange={handleChange} value={props.data.password} id="pass-input" name="password" required className="authform__input authform__input_el_pass" type="password" minLength="2" maxLength="200" placeholder="Пароль"/>
                    <button name="buttonAuth" className="authform__button">Войти</button>
                </form>
                <p className="auth__login" >
                </p>
            </section>
        </main>
    );
}

export {Login};