//import HallCard from "./hallCard";
import type { MovieDetailsResponse } from "../../types/movieDetals";
import { useEffect, useState } from "react";
import { getMovie, getMovieSessions } from "../../services.ts/movieServices";
import { useParams } from "react-router-dom";
import "./moviePage.css"
import "../../services.ts/movieServices"
import type { HallGroup, MovieSession, VenueSessions } from "../../types/movieSessions";
import HallCard from "./hallCard";


function MoviePage(){
    const { slug } = useParams();
 

    const [movie, setMovie] = useState<MovieDetailsResponse | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [venueSessions, setvenueSessions] = useState<VenueSessions[]>([]);

    // Get movie
    useEffect(() => {
        const loadMovie = async () => {
        try {
            const response = await getMovie(slug!);
            setMovie(response);
        } catch (error) {
            console.error("Failed to load movie details:", error);
        }
        };

        loadMovie();
    }, [slug]);

    const defaultDate = movie?.data.availableDates[0] ?? "";
    const dateToFetch = selectedDate || defaultDate;


    // Get venueSession whenever the movie/date changes
    useEffect(() => {
        if (!movie || !dateToFetch) return;

        const loadvenueSession = async () => {
        try {
            const response = await getMovieSessions(
            movie.data.slug,
            dateToFetch
            );

            setvenueSessions(response.data);
        } catch (error) {
            console.error("Failed to load sessions AND VENUES:", error);
        }
        };

        loadvenueSession();
    }, [movie, dateToFetch]);

    function GroupSessionsByHall(sessions :MovieSession[]){
        const halls: HallGroup[] = [];

        sessions.forEach((session)=>{
            const existingHall = halls.find(
                (hall) => hall.hall.id === session.hall.id
            );

            if(existingHall){
                existingHall.sessions.push(session)
            }else{
                halls.push({
                    hall: session.hall,
                    sessions: [session],
                });
            }

        });
        return halls;

    }


    // Early return comes AFTER all hooks
    if (!movie) {
        return <div>Loading...</div>;
    }


    return(
        <div>

            <div className="banner-frame">

                    <div className="banner-img-frame">
                        <img src={movie.data.backdropUrl} className="banner-img"></img>
                    </div>


                    <div className="banner-details-frame">
                        <div className="poster-frame">
                            <img src={movie.data.posterUrl} className="poster-img"></img>
                        </div>

                        <div className="details">
                            <div className="now-playing">
                                <p className="now-playing-text"> NOW PLAYING</p>
                            </div>

                            <div className="banner-name-details-frame">
                                <div className="name-synopsis">
                                    <p className="title">{movie.data.title}</p>
                                    <p className="synopsis"> {movie.data.synopsis}</p>
                                </div>

                                
                                <div className="banner-badges">
                                    <div className="age-rating"><p>{movie.data.ageRating.code}</p></div>
                                    <div className="runtime"><p>{movie.data.runtimeMinutes} min</p></div>
                                    <div className="format"><p>{movie.data.formats[0].name}</p></div>

                                </div>
                            </div>

                            
                        </div>

                    </div>

            </div>

            {/**for sessions, banner ends here */}

            <div className="sessions-frame">
                <div className="sessions-left">

                    <div className="days-frame">
                        <div className="days-header">Sessions</div>
                        <div className="days">
                            {movie.data.availableDates.slice(0, 7).map((date) => (
                                <button className="day" key={date} onClick={() => setSelectedDate(date)}>
                                <span className="day-name">
                                    {new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    }).toUpperCase()}
                                </span>

                                <span className="day-number">
                                    {date.split("-")[2]}
                                </span>
                                </button>
                            ))}

                        </div>

                        </div>


                    <div className="venues">
                        {venueSessions.map((venue) => {
                            const halls = GroupSessionsByHall(venue.sessions);

                            return (
                            <section className="venue" key={venue.venue.id}>
                                <p className="venue-name">{venue.venue.name}</p>

                                <div className="halls">
                                {halls.map((hallGroup) => (
                                        <HallCard hall={hallGroup}></HallCard>
                                ))}
                                </div>
                            </section>
                            );
                            })}
                    </div>
                </div>

        
                <div className="movie-details-frame">
                    <h2>Details</h2>
                    <div className="movie-details">
                        <label className="details-lable">Director</label>
                        <text className="details-text" > {movie.data.director}</text>
                    </div>
                    <div className="movie-details">
                        <label className="details-lable">Main Cast</label>
                        <text className="details-text"> {movie.data.cast}</text>

                    </div>
                    <div className="movie-details">
                        <label className="details-lable">Duration</label>
                        <text className="details-text"> {movie.data.director}</text>
                    </div>
                    <div className="movie-details">
                        <label className="details-lable">Release Date</label>
                        <span className="details-text">   
                            {new Date(`${movie.data.releaseDate}T00:00:00`).toLocaleDateString("en-GB",  {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="movie-details">
                        <label className="details-lable">Formats</label>
                        <span className="details-text">
                            {movie.data.formats.map((format) => format.name).join(", ")}
                        </span>
                    </div>
                    <div className="rating-note">
                        <label className="rating-note-lable">Rating Note</label>
                        <text className="rating-note-text"> {movie.data.ageRating.description}</text>
                    </div>


                </div>
                
            </div>
        </div>
    
    );

}

export default MoviePage;