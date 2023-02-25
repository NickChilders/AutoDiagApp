import React from "react";
import { Button } from 'react-bootstrap';

const Forums = () => {
  return (
      <div>
        <div className="index_body">
          <section className="section" >
          
            <div className="box-main" >
              <div className="firstHalf">
                <h1 className="text-big">
                  Forums &emsp;
                  <div>
                    <input type="text" name="search" id="search" placeholder="Upgrades"/>
                    <Button className="btn btn-sm"  type="search" style={{margin:"20px"}} >Search Forums</Button>
                  </div>
                </h1>
              </div>
            </div>
          </section>
        
          <section className="section" >
            <div className="box-main" >
              <div className="secondHalf">
                <p className="text-small">
                  Talk among others that have the same car as you.
                </p>
              </div>
            </div>
          </section>
        </div>

      </div>
  );
};

export default Forums;
