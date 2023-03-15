import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './userContext';


const AccountInfo = () => {
    const { user } = useContext(UserContext);
    const [imgUrl, setImgUrl] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [series, setSeries] = useState('');

    const fetchUserData = async (userDataUrl) => {
        try {
            const response = await fetch(userDataUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setImgUrl(data.vehicleImgUrl);
            setMake(data.vehicleMake);
            setModel(data.vehicleModel);
            setSeries(data.vehicleSeries);
            localStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }

    useEffect(() => {
        const loadUserData = () => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                setImgUrl(userData.vehicleImgUrl);
                setMake(userData.vehicleMake);
                setModel(userData.vehicleModel);
                setSeries(userData.vehicleSeries);
            }
            const token = userData?.token;
            if (token && !userData) {
                const userDataUrl = `http://localhost:3001/users/${token}`;
                fetchUserData(userDataUrl);
            }
        };
        loadUserData();
    }, []);

    useEffect(() => {
        const getImg = async (userData) => {
            if(userData){
                try {
                    const token = userData?.token;
                    localStorage.setItem('token', token); // persist user's token in localStorage
                    const response = await fetch(`http://localhost:3001/users/${userData.token}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setImgUrl(data.vehicleImgUrl);
                    setMake(data.vehicleMake);
                    setModel(data.vehicleModel);
                    setSeries(data.vehicleSeries);
                    localStorage.setItem('userData', JSON.stringify(data));
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }
        };
        getImg(user);
    }, [user]);

    return (
        <div>
            <div className="index_body">
                <section className="section" >
                    <div className="box-main" >
                        <div className="firstHalf">
                            <h1 className="text-big">
                                <div>{user && user.username} Account Information &emsp;</div>
                            </h1>
                        </div>
                    </div>
                </section>
                <div className='box-main'>
                    <img src={imgUrl} width="auto" height="300" alt="users car" />
                </div>
                <section className="section" style={{ display: "flex" }}>
                    <div className="box-main" >
                        <div className="secondHalf">
                            <h2 className="text-lessBig">
                                Vehicle VIN: {user && user.vehicleVIN}
                            </h2>
                        </div>
                    </div>
                </section>

                <section className="section" >
                    <div className="box-main" >
                        <div className="secondHalf">
                            <h2 className="text-lessBig">
                                Vehicle Make: {`${make}`}
                            </h2>
                        </div>
                    </div>
                </section>

                <section className="section" >
                    <div className="box-main" >
                        <div className="secondHalf">
                            <h2 className="text-lessBig">
                                Vehicle Model: {`${model}`}
                            </h2>
                        </div>
                    </div>
                </section>

                <section className="section" >
                    <div className="box-main" >
                        <div className="secondHalf">
                            <h2 className="text-lessBig">
                                Vehicle Series: {`${series}`}
                            </h2>
                        </div>
                    </div>
                </section>

                <section className="section" >
                    <div className="box-main" >
                        <div className="secondHalf">
                            <h2 className="text-lessBig">
                                Vehicle Year: {user && user.vehicleYear}
                            </h2>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AccountInfo;
