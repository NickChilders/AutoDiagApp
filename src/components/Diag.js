import React, { useContext } from "react";
import { Link, NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { UserContext } from './userContext';

const handleSearchAlert = (searchParams) => {
  let disclaimer = require('./../TesterFiles/Disclaimers.json')
  alert(`${disclaimer.Diag}`)
}

const Diagnostics = () => {
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
                    Diagnostics &emsp;
                  </h1>
                </div>
              </div>
            </section>
            <div className="box-main" >
              <div className="secondHalf">
                <p className="text-small">
                  You no longer need to be an expert to properly diagnose your car with confidence.
                </p>
                <p>
                  Please &nbsp;
                  <NavLink eventkey="0" as={Link} to={`${process.env.PUBLIC_URL}/login`} href={`${process.env.PUBLIC_URL}/login`}>Sign In</NavLink>
                  &nbsp; or &nbsp;
                  <NavLink eventkey="1" as={Link} to={`${process.env.PUBLIC_URL}/register`} href={`${process.env.PUBLIC_URL}/register`}>Register</NavLink>
                  &nbsp; To Continue.
                </p>
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
                    Diagnostics &emsp;
                    <div>
                      <input type="text" name="search" id="search" placeholder="(Ex: Car misfire)" />
                      <Button className="btn btn-sm btn-group" type="search" style={{ margin: "20px" }} onClick={(e) => (handleSearchAlert(e))}>Search</Button>
                    </div>
                  </h1>
                </div>
              </div>
            </section>
            <section className="section" >
              <div className="box-main" >
                <div className="secondHalf">
                  <p className="text-small">
                    You no longer need to be an expert to properly diagnose your car with confidence.
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

export default Diagnostics;
