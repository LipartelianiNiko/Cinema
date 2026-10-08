import "./sessionsListCard.css"

function SessionListCard(){
    return(
        <div className="card-frame">
            <div className="card-contents">
                <div className="card-top">
                    <div className="time">12:00</div>
                    <div className="sessions-list-format-badge">format</div>
            
                </div>
                
                <div className="card-bottom">

                    <div className="card-bottom-detils">
                        <div className="subtitles">english+original</div>
                        <div className="location">Location | hall</div>
                    </div>
                    <div className="card-bottom-tickets-price">
                        <div className="tickets-left">50 left</div>
                        <div className="price">22gel</div>
                    </div>

                </div>
            
            </div>
        </div>
    )

}

export default SessionListCard