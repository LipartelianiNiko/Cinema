import "./signUpModal.css"

type LoginModalProps = {
    onClose: () => void;
    onSignUp: () => void;
};


function LoginModal({ onClose, onSignUp }: LoginModalProps) {
    return(
    <div className="modal-overlay"
        onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
    }}
    >

    <div className="log-in-modal-frame">

        <div className="header">
            <div className="title-welcome-frame">
                <h2 className="sign-up-header">Log in</h2>
                <p className="welcome">Welcome to Kino XII</p>
            </div>

            <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="form-frame">
            <div className="form">
                <div className="input-frame">
                    <div className="input-header">Username</div>
                    <input className="username-email-input" placeholder="User" type="text"></input>
                </div>

                <div className="input-frame">
                    <div className="input-header">Username</div>
                    <input className="username-email-input" placeholder="••••••••" type="password"></input>
                </div>


                </div>

            </div>

            <div className="btn-frame">
                <button className="sign-up-btn">Sign Up</button>
                <div className="footer">
                    <p className="already-have-account">Don't have account?</p>
                    <p className="log-in-already" onClick={onSignUp}>Sign up</p>

                </div>
            </div>
        </div>
    </div>
    )

}

export default LoginModal;