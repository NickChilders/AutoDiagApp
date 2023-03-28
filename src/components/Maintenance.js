import React, { useContext } from "react";
import { Link, NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { UserContext } from './userContext';

const Maintenance = () => {
  const { user } = useContext(UserContext);

  const checkSignIn = ({ user }) => {
    if (!user) {
      return (
        <div>
          <div className="index_body">
            <section className="section" >
              <div className="box-main" >
                <div className="firstHalf">
                  <h1 className="text-big">
                    Maintenance &emsp;
                  </h1>
                </div>
              </div>
            </section>
              <div className="box-main" >
                <div className="secondHalf">
                  <p className="text-small">
                    You no longer need to be an expert to know how to perform your car maintenance.
                  </p>
                  <div className="box-main">
                    Please &nbsp;
                    <NavLink eventkey="0" as={Link} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}>Sign In</NavLink>
                    &nbsp; or &nbsp;
                    <NavLink eventkey="1" as={Link} to={`${process.env.PUBLIC_URL}/register`} href={`${process.env.PUBLIC_URL}/register`}>Register</NavLink>
                    &nbsp; To Continue.
                  </div>
                </div>
              </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="index_body">
            <section className="section" >
              <div className="box-main" >
                <div className="firstHalf">
                  <h1 className="text-big">
                    Maintenance &emsp;
                    <div>
                      <input type="text" name="search" id="search" placeholder="(Ex: Oil Change)" />
                      <Button className="btn btn-sm" type="search" style={{ margin: "20px" }} >Search</Button>
                    </div>
                  </h1>
                </div>
              </div>
            </section>
            <section className="section" >
              <div className="box-main" >
                <div className="secondHalf">
                  <p className="text-small">
                    You no longer need to be an expert to know how to perform your car maintenance.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )
    }
  }
  return (
    checkSignIn({ user })
  );
};

export default Maintenance;
