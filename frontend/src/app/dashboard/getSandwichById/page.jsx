'use client'

import React, { useState } from 'react';

const BACKEND_PORT = 8080;
const ENV_SERVER_A_URL = process.env.NEXT_PUBLIC_APP_SERVER_A_URL;
const SANDWICH_URL = ENV_SERVER_A_URL ? ENV_SERVER_A_URL + "/v1/sandwich/" : "http://localhost:" + BACKEND_PORT + "/v1/sandwich/";

const SandwichByIdGetter = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sandwichId, setSandwichId] = useState("");
    const [flashPost, setFlashPost] = useState(false);

    const handleButtonClick = () => {
        setFlashPost(true);
        setTimeout(() => setFlashPost(false), 500);
        setData(null);
        setError(null);

        if(sandwichId === "") return alert('enter sandwich ID');

        setLoading(true);

        fetch(SANDWICH_URL + sandwichId)
            .then(response => {
                // console.log(response.status);
                if (!response.ok) {
                    return response.text().then(text => {
                        return text ? JSON.parse(text) : {};
                    }).then(err => {
                        throw new Error(`${response.status}` +
                            `, ${err.message || '-'}`);
                    });
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(data => {
                setData(data);
                console.log(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error)
                console.error(error);
                setData(null);
                setLoading(false);
            });
    };

    return (
        <div className="SandwichByIdGetter">
            <h1><strong>Sandwich by ID Getter</strong></h1>
            <div>
                <div>
                    <input type="number" value={sandwichId} onChange={e => setSandwichId(e.target.value)} placeholder="Sandwich ID" />
                </div>
                <div>
                    <button className={flashPost ? 'flash' : ''} onClick={handleButtonClick} disabled={loading}>Get Sandwich</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 25px)' }}>
                {loading && <div>Loading...</div>}
                {error && (<div>{`Problem finding sandwich: ${error}`}</div>)}
                {data && (
                    <div>
                        <table>
                            <caption>Sandwich</caption>
                            <thead>
                                <tr>
                                    <th>SandwichId</th>
                                    <th>Name</th>
                                    <th>Toppings</th>
                                    <th>Bread Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.toppings ? data.toppings.map(topping => topping.id).join(', ') : ''}</td>
                                    <td>{data.breadType}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SandwichByIdGetter;