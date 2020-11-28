import React from 'react';

class ImagePopup extends React.Component {
    //!this.props.card ? `popup popup_photo popup_open` : `popup popup_photo`
    render() {
        return (
            <section className={`popup ${Object.keys(this.props.card).length > 0 ? "popup_open" : ""}`}>
                <div className="pop-image">
                    <div className="pop-image__container">
                        <img className="pop-image__image" src={this.props.card.link} alt={`${this.props.card.name}`} />
                        <p className="pop-image__about">{this.props.card.name}</p>
                        <button type="button" onClick={this.props.onClose} className="popup__close pop-image__close"></button>
                    </div>
                </div>
            </section>
        );
    }
}

export default ImagePopup;