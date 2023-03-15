import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cel from "../images/CEL.png";
import maint from "../images/Maint.png";
import forums from "../images/Forums.png";
import { UserContext } from './userContext';

const MainPage = () => {
    const { user } = useContext(UserContext);

    const checkSignIn = ({ user }) => {
        if (!user) {
            return (
                [
                    <section className="section1" key="section0">
                        <div className="box-main">
                            <div className="firstHalf"></div>
                            <h1 className="text-big" style={{ marginTop: "20px" }}>Welcome to AutoDiag!</h1>
                        </div>
                        <div>Please &nbsp;
                            <NavLink eventkey="0" as={Link} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}>Sign In</NavLink>
                            &nbsp; or &nbsp;
                            <NavLink eventkey="1" as={Link} to={`${process.env.PUBLIC_URL}/register`} href={`${process.env.PUBLIC_URL}/register`}>
                                Register 
                            </NavLink>
                            &nbsp; To Continue.
                        </div>
                        <div className="box-main">
                            <div className="secondHalf">
                                <h1 className="text-big" id="program" style={{ marginTop: "100px" }}>My Car</h1>
                                <div></div>
                                <p className="text-small">
                                    Track everything for your car. Year, Make, Model, Miles, MPG, etc.<br/>
                                    All information needed to keep you and your car safe.
                                    No more sifting through endless searches.
                                </p>
                            </div>
                        </div>
                    </section>
                ]
            )
        }
        else {
            return (
                [
                    <section className="section1" key="section1">
                        <div className="box-main">
                            <div className="firstHalf">
                                <h1 className="text-big" style={{ marginTop: "20px" }}>Welcome to AutoDiag {` ${user.username}`}!</h1>
                                <p className="text-small">Diagnose your car with confidence.</p>
                                <Link to={`${process.env.PUBLIC_URL}/diagnostics`}><img src={cel} width="auto" height="90" alt="diagnostics link" /></Link>
                            </div>
                        </div>
                        <div className="box-main">
                            <div className="secondHalf">
                                <h1 className="text-big" id="program" style={{ marginTop: "100px" }}>Maintenance</h1>
                                <p className="text-small">No need to worry about finding the correct information. All necessary maintenance for YOUR car.</p>
                                <Link to={`${process.env.PUBLIC_URL}/maintenance`}><img src={maint} width="auto" height="125" alt="maintenance link" /></Link>
                            </div>
                        </div>
                        <div className="box-main">
                            <div className="secondHalf">
                                <h1 className="text-big" id="program" style={{ marginTop: "100px" }}>Message Board</h1>
                                <p className="text-small">Browse the forums for everything related to YOUR car's year, make, and model.</p>
                                <Link to={`${process.env.PUBLIC_URL}/forums`}><img src={forums} width="auto" height="200" alt="forums link" /></Link>
                            </div>
                        </div>
                        <div className="box-main">
                            <div className="secondHalf">
                                <h1 className="text-big" id="program" style={{ marginTop: "100px" }}>
                                    My Car:
                                </h1>
                                <p className="text-small">
                                    Make: {user.vehicleMake},<br/> 
                                    Model: {user.vehicleModel}, <br/>
                                    Series: {user.vehicleSeries}
                                </p>
                            </div>
                        </div>
                    </section>
                ]
            )
        }
    }

    return (
        checkSignIn({ user })
    );
};

export default MainPage;