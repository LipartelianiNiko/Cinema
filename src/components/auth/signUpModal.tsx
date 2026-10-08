import "./signUpModal.css"

type SignUpModalProps = {
    onClose: () => void;
    onLogin: () => void;
};

function SignUpModal({ onClose, onLogin }: SignUpModalProps) {

    return(
    <>
    <div className="modal-overlay"
        onClick={(e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
    }}
    >


    <div className="sign-up-modal-frame">

        <div className="header">
            <div className="title-welcome-frame">
                <h2 className="sign-up-header">Sign up</h2>
                <p className="welcome">Welcome to Kino XII</p>
            </div>

            <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="form-frame">
            <div className="avatar-upload-frame">
                <div className="upload-box"></div>

                <div className="avatar-lables">
                    <div className="upload-avatar">Upload Avatar (optional)</div>
                    <div className="file-formats">JPG, PNG or WEBP</div>
                </div>
            </div>
            <div className="form">
                <div className="input-frame">
                    <div className="input-header">Username</div>
                    <input className="username-email-input" placeholder="User" type="text"></input>
                </div>

                <div className="input-frame">
                    <div className="input-header">Email</div>
                    <input  className="username-email-input"placeholder="example@gmail.com" type="email"></input>
                </div>

                <div className="password-frame">
                    <div className="password-left">
                        <div className="password-input-header">password</div>
                        <input className="password-input" placeholder="••••••••" type="password"></input>
                    </div>

                    <div className="password-right">
                        <div className="password-input-header">Confirm password</div>
                        <input className="password-confirm-input" placeholder="••••••••" type="password"></input>
                    </div>


                </div>

            </div>

            <div className="btn-frame">
                <button className="sign-up-btn">Sign Up</button>
                <div className="footer">
                    <p className="already-have-account">Already have an account?</p>
                    <p className="log-in-already" onClick={onLogin}>Log in</p>

                </div>
            </div>
        </div>
    </div>
    </div>
    </>
    )

}

export default SignUpModal