'use client'

import React, { useState, useEffect } from 'react';
import OrderPoster from './OrderPoster';
import OrderGetter from './OrderGetter';
import "./page.css";

const BACKEND_PORT = 8080;
const ENV_SERVER_A_URL = process.env.NEXT_PUBLIC_APP_SERVER_A_URL;
const SANDWICH_URL = ENV_SERVER_A_URL ? ENV_SERVER_A_URL + "/v1/sandwich" : "http://localhost:" + BACKEND_PORT + "/v1/sandwich";

function SandwichGetter() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch sandwiches on component mount
    useEffect(() => {
        const fetchSandwiches = () => {
            fetch(SANDWICH_URL)
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
                .then((responseData) => {
                    setError(null);
                    setData(responseData);
                })
                .catch((err) => {
                    setError(err.message);
                    setData(null);
                });
        };

        fetchSandwiches();
    }, []);

    return (
        <section className='homePage'>
            <aside className='pr-5'>
                <OrderGetter />
            </aside>

            <div className="SandwichGetter">
                <div className='sandwichHeader'>
                    <h1><strong>Sandwiches</strong></h1>
                    < OrderPoster selectedItem={selectedItem} />
                </div>
            
                {error && (<div>{`Problem fetching sandwiches: ${error}`}</div>)}
                {data && (
                    <div id='table'>
                        <div id='tbody'>
                            {data.map(value => (
                                <button 
                                    id='tr'
                                    key={value.id}
                                    onClick={() => setSelectedItem(value)}>

                                    <div id='caption'>{value.name}</div>

                                    {/* Display only the names of the toppings and not ids */}
                                    < div id='infoCtn' >
                                        <p className='toppings'>{value.toppings.map(topping => topping.name).join(', ')}</p>
                                        <p className='breadType'>{value.breadType}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section >
    )
}

export default SandwichGetter;
