import React from "react";
import { Button } from 'react-bootstrap';

const handleSearchAlert = (searchParams) => {
  let disclaimer =  require('./../TesterFiles/Disclaimers.json')
  alert(`${disclaimer.Diag}`)
}

const Diagnostics = () => { 
  return (
      <div>
        <div className="index_body">
          <section className="section" >
          
            <div className="box-main" >
              <div className="firstHalf">
                <h1 className="text-big">
                  Diagnostics &emsp;
                  <div>
                    <input type="text" name="search" id="search" placeholder="(Ex: Car misfire)"/>
                    <Button className="btn btn-sm btn-group"  type="search" style={{margin:"20px"}} onClick={(e) => (handleSearchAlert(e))}>Search</Button>
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
  );
};

export default Diagnostics;
