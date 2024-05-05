'use client'

import React, { useState, useEffect } from 'react';

const BACKEND_PORT = 8080;
const ENV_SERVER_A_URL = process.env.NEXT_PUBLIC_APP_SERVER_A_URL;
const ORDER_URL = ENV_SERVER_A_URL ? ENV_SERVER_A_URL + "/v1/order" : "http://localhost:" + BACKEND_PORT + "/v1/order";

export default function OrderGetter() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [poll, setPoll] = useState(false);
    const [flashGet, setFlashGet] = useState(false);
    const [flashPoll, setFlashPoll] = useState(false);

    const fetchOrder = () => {
        fetch(ORDER_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `HTTP error, status code: ${response.status}`
                    );
                }
                return response.json();
            })
            .then((responseData) => {
                setError(null);
                setData(responseData);
            })
            .catch((err) => {
                setError(err.message);
                setData([]);
            });
    };

    useEffect(() => {
        if (poll) {
            const interval = setInterval(() => {
                setFlashPoll(true);
                setTimeout(() => setFlashPoll(false), 500);
                fetchOrder();
            }, 1000);

            // When component unmounts
            return () => clearInterval(interval);
        }
    }, [poll]);

    const getButtonClick = () => {
        setFlashGet(true);
        setTimeout(() => setFlashGet(false), 500);
        fetchOrder();
    }

    return (
        <div className="orderGetter">
            <h1>Orders in queue</h1>

            <div className='data'>
                <div className='buttonContainer'>
                    <button className={flashGet ? 'flash' : ''} onClick={getButtonClick}>Get Orders</button>
                    <button className={flashPoll ? 'flash' : ''} onClick={() => setPoll(!poll)}>
                        {poll ? 'Stop polling' : 'Start polling'}
                    </button>
                </div>

                {error && (<div className='flex justify-center pb-5'>{`Problem fetching orders: ${error}`}</div>)}

                {data && (
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>SandwichId</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>{
                            data.map(({ id, sandwichId, status }: any) => (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{sandwichId}</td>
                                    <td>{status}</td>
                                </tr>
                            ))
                        }</tbody>
                    </table>
                )}
            </div>
        </div>

    )
}
