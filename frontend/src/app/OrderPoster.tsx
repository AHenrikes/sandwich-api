'use client'

import { useState, useEffect } from 'react';

const BACKEND_PORT = 8080;
const ENV_SERVER_A_URL = process.env.NEXT_PUBLIC_APP_SERVER_A_URL;
const ORDER_URL = ENV_SERVER_A_URL ? ENV_SERVER_A_URL + "/v1/order" : "http://localhost:" + BACKEND_PORT + "/v1/order";

const OrderPoster = (props) => {
    const selectedItem = props.selectedItem;
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const [showOrder, setShowOrder] = useState(false);
    const [selectedSandwichId, setSelectedSandwichId] = useState("");
    const [selectedSandwichName, setSelectedSandwichName] = useState("");

    // Update Sandwich info when the selected sandwich from the propagated props changes
    useEffect(() => {
        setSelectedSandwichId(selectedItem?.id);
        setSelectedSandwichName(selectedItem?.name);
    }, [selectedItem]);

    const handleButtonClick = () => {
        setData(null);
        setError(null);

        const order = {
            "sandwichId": parseInt(selectedSandwichId),
            "status": "ordered"
        }

        fetch(ORDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order) // Order object as the required parameter in the request body
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Failed to send order and failed to read error message');
                    });
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                console.log(data);

                // Show the order (response from API) for 4 seconds
                setShowOrder(true);
                setTimeout(() => setShowOrder(false), 4000);
                setSelectedSandwichName("");
                setSelectedSandwichId("");
            })
            .catch(error => {
                setError(error)
                console.error(error);
                setData(null);
            });
    };

    return (
        <div className='orderPoster'>
            <span>
                {showOrder && data ? (
                    <div className='status'>
                        {data?.status}
                    </div>
                ) : (
                    <div className='sandwich'>
                        {selectedSandwichName}
                    </div>
                )}
            </span>

            {error && (<div>{`Problem sending last order: ${error}`}</div>)}
            <button id='sndBtn' onClick={handleButtonClick} disabled={!selectedSandwichId}>Send Order</button>
        </div>
    );
};

export default OrderPoster;