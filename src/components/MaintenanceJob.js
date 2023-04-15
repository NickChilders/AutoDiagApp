import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { UserContext } from './userContext';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const MaintenanceJob = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [header, setHeader] = useState('');
  const [steps, setSteps] = useState([]);
  const [author, setAuthor] = useState('')
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/maintenance/job/${id}`);
        const data = await response.json()
        setHeader(data.heading);
        setSteps(data.steps);
        setAuthor(data.author);
        setDate(data.date);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJob();
  }, [id]);

  if (!steps && !header && !author) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section>
        <div className='box-main'>
          <h1><u>{header}</u></h1>
        </div>
        <p>Author: {author}</p>
        <p style={{ fontSize: 11 }}>Posted on: {Date(date)}</p>
      </section>

      <hr />
      <ListGroup>
        {steps.map((step, index) => (
          <ListGroupItem key={index}>
            {step.description}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default MaintenanceJob;