import React from "react";
import { Button } from 'react-bootstrap';

const Maintenance = () => {
  return (
      <div>
        <div className="index_body">
          <section className="section" >
          
            <div className="box-main" >
              <div className="firstHalf">
                <h1 className="text-big">
                  Maintenance &emsp;
                  <div>
                    <input type="text" name="search" id="search" placeholder="(Ex: Oil Change)"/>
                    <Button className="btn btn-sm"  type="search" style={{margin:"20px"}} >Search</Button>
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
  );
};

export default Maintenance;
