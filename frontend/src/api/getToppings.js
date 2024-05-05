export function getToppings() {
    const ENV_SERVER_A_URL = process.env.NEXT_PUBLIC_APP_SERVER_A_URL;
    const TOPPINGS_URL = (ENV_SERVER_A_URL ? ENV_SERVER_A_URL : "http://localhost:8080") + "/v1/toppings/";

    return fetch(TOPPINGS_URL)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return [];
            }
        })
        .catch(error => {
            console.log("error", error);
            return error;
        });
}