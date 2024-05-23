'use client'

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { determineApiKey } from '../../../api/determineApiKey';
import { getToppings } from '../../../api/getToppings';

const BACKEND_PORT = 8080;
const ENV_SERVER_A_URL = process.env.NEXT_PUBLIC_APP_SERVER_A_URL;
const SANDWICH_URL = ENV_SERVER_A_URL ? ENV_SERVER_A_URL + "/v1/sandwich" : "http://localhost:" + BACKEND_PORT + "/v1/sandwich";

interface Topping {
    id: number;
    name: string;
}

interface Data {
    id: string;
    name: string;
    toppings: Topping[];
    breadType: string;
}

const SandwichPoster = () => {
    const { user } = useUser();
    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [allToppings, setAllToppings] = useState<Topping[] | null>(null);
    const [sandwichName, setSandwichName] = useState("");
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [breadType, setBreadType] = useState("oat");
    const [flashPost, setFlashPost] = useState(false);

    // Determine API key based on role
    const apikey = determineApiKey(user);

    // Get all toppings from backend when the component is mounted
    useEffect(() => {
        getToppings().then(data => setAllToppings(data));
    }, []);

    const handleToppingsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
            case sandwichName === "":
                return alert('empty name');
            case toppings.length < 1:
                return alert('select toppings');
        }

        setLoading(true);

        const sandwich = {
            name: sandwichName,
            toppings: toppings,
            breadType: breadType
        };

        fetch(SANDWICH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api_key': apikey
            },
            body: JSON.stringify(sandwich)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        return text ? JSON.parse(text) : {};
                    }).then(err => {
                        throw new Error(`${response.status}, ${err.message || '-'}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setData(null);
                setLoading(false);
            });
    };

    return (
        <div className="SandwichPoster">
            <h1>Sandwich Poster</h1>

            <div>
                <input
                    type="text"
                    value={sandwichName}
                    onChange={e => setSandwichName(e.target.value)}
                    placeholder="Sandwich Name"
                />

                <select
                    multiple={true}
                    value={toppings.map(topping => topping.id.toString())}
                    onChange={handleToppingsChange}
                >
                    {allToppings?.map(topping => (
                        <option key={topping.id} value={topping.id.toString()}>
                            {topping.name}
                        </option>
                    ))}
                </select>

                <select
                    value={breadType}
                    onChange={e => setBreadType(e.target.value)}
                >
                    <option value="oat">Oat</option>
                    <option value="rye">Rye</option>
                    <option value="wheat">Wheat</option>
                </select>

                <button
                    className={flashPost ? 'flash' : ''}
                    onClick={handleButtonClick}
                    disabled={loading}
                >
                    Add Sandwich
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 25px)' }}>
                {loading && <div>Loading...</div>}
                {error && (<div>{`Problem adding sandwich: ${error.message}`}</div>)}
                {data && (
                    <div>
                        <table>
                            <caption>Sandwich posted</caption>
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
                                    <td>{data.toppings.map(topping => topping.name).join(', ')}</td>
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

export default SandwichPoster;
