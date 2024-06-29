import React, { createContext, useEffect, useState } from "react";
import { ServerUrl } from "../ServerUrl/ServerUrl";

export const SharedData = createContext();

const SharedContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (email, password) => {
        setLoading(true);
        return fetch(`${ServerUrl}/auth/login`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
    };

    const register = (fullName, email, password) => {
        setLoading(true);
        return fetch(`${ServerUrl}/auth/register`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ fullName, email, password }),
        });
    };

    useEffect(() => {
        setLoading(true);
        const subscriber = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${ServerUrl}/auth/SubscriberCheck`,
                    {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({}),
                    }
                );
                // console.log(response);
                if(response.status=== 200){
                    const data = await response.json();
                    console.log(data);
                    setUser(data?.user);
                }
                else{
                    setUser(null);
                }
                // const data = await response.json();
                // if (data.user) {
                //     // console.log(data.user);
                //     setUser(data.user);
                // } else {
                //     setUser(null);
                // }
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };
        return () => subscriber();
    }, []);

    const authInfo = { user, setUser, loading, setLoading, login, register };
    return (
        <div>
            <SharedData.Provider value={authInfo}>
                {children}
            </SharedData.Provider>
        </div>
    );
};

export default SharedContext;
