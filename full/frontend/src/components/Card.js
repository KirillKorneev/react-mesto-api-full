import React from 'react';
import {CurrentUserContext} from '../contexts/currentUserContext.js';

export default function Card(props) {

    const currentUser = React.useContext(CurrentUserContext);
    let isOwn;
    if (typeof props.card.owner === "string") {
        isOwn = props.card.owner === currentUser._id;
    }
    else {
        isOwn = props.card.owner._id === currentUser._id;
    }
    
    const cardDeleteButtonClassName = (
        `element__delete ${isOwn ? '' : 'element__delete_hidden'}`
    ); 

    const isLiked = props.card.likes.some(i => i === currentUser._id);
    const cardLikeButtonClassName = (`element__like ${isLiked ? 'element__like_black' : ''}`); 

    function handleClick() {
        props.onCardClick(props.card);
    }

    function handleLike() {
        props.onCardLike(props.card);
    }

    function handleDelete() {
        props.onCardDelete(props.card);
    }

    
    return (
        <li className="element">
            <img className="element__photo" src={`${props.card.link}`} onClick={handleClick} alt={`${props.card.name}`} />
            <div className="element__info">
                <h2 className="element__name">{props.card.name}</h2>
                <div className="element__data">
                    <button type="button" className= {cardLikeButtonClassName} onClick={handleLike} aria-label="Лайк"></button>
                    <p className="element__counter">{`${props.card.likes.length}`}</p>
                </div>
            </div>
            <button type="button" className={cardDeleteButtonClassName} onClick={handleDelete} aria-label="Удалить"></button>
        </li> 
        );
}