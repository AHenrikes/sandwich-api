'use client'

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { getToppings } from '../../api/getToppings';
import { determineApiKey } from '../../api/determineApiKey';

const BACKEND_PORT = 8080;
const ENV_SERVER_A_URL = process.env.NEXT_PUBLIC_APP_SERVER_A_URL;
const SANDWICH_URL = ENV_SERVER_A_URL ? ENV_SERVER_A_URL + "/v1/sandwich/" : "http://localhost:" + BACKEND_PORT + "/v1/sandwich/";

const SandwichUpdater = () => {

    // Determine API key based on role
    const { user } = useUser();
    const apikey = determineApiKey(user);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allToppings, setAllToppings] = useState(null);
    const [sandwichId, setSandwichId] = useState("");
    const [sandwichName, setSandwichName] = useState("");
    const [toppings, setToppings] = useState([]);
    const [breadType, setBreadType] = useState("oat");
    const [flashPost, setFlashPost] = useState(false);

    // Get all toppings from backend when the component is mounted
    useEffect(() => {
        getToppings().then(data => setAllToppings(data));
    }, []);

    const handleToppingsChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => ({
            id: parseInt(option.value),
            name: option.text
        }));
        setToppings(selectedOptions);
    };

    const handleButtonClick = () => {
        setFlashPost(true);
        setTimeout(() => setFlashPost(false), 500);
        setData(null);
        setError(null);

        switch (true) {
            case sandwichId === "":
               return alert('empty id');
            case sandwichName === "":
               return alert('empty name');
            case toppings.length < 1:
                return alert('select toppings');
        }

        setLoading(true);

        const sandwich = {
            "sandwichId": parseInt(sandwichId),
            "name": sandwichName,
            "toppings": toppings,
            "breadType": breadType
        };

        fetch(SANDWICH_URL + sandwichId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api_key': apikey
            },
            body: JSON.stringify(sandwich) // Sandwich object as the required parameter in the request body
        })
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
        <div className="SandwichUpdater">
            <h1>Sandwich Updater</h1>
            <div>
                <input type="number" value={sandwichId} onChange={e => setSandwichId(e.target.value)} placeholder="Sandwich ID" />
                <input type="text" value={sandwichName} onChange={e => setSandwichName(e.target.value)} placeholder="Sandwich Name" />
                <select multiple={true} value={toppings.map(topping => topping.id)} onChange={handleToppingsChange}>
                    {/* Check that allToppings has been fetched, and only then map them to the menu options */}
                    {allToppings && allToppings.map((topping) => (
                        <option key={topping.id} value={topping.id}>{topping.name}</option>
                    ))}
                </select>
                <select value={breadType} onChange={e => setBreadType(e.target.value)}>
                    <option value="oat">Oat</option>
                    <option value="rye">Rye</option>
                    <option value="wheat">Wheat</option>
                </select>
                <button className={flashPost ? 'flash' : ''} onClick={handleButtonClick} disabled={loading}>Update Sandwich</button>
            </div>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 25px)' }}>
                {loading && <div>Loading...</div>}
                {error && (<div>{`Problem updating sandwich: ${error}`}</div>)}
                {data && (
                    <div>
                        <table>
                            <caption>Sandwich updated</caption>
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
                                    <td>{data.toppings ? data.toppings.map(topping => topping.toppingId).join(', ') : ''}</td>
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

export default SandwichUpdater;