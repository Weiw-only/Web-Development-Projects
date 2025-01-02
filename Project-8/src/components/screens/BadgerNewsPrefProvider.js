import React, {useState, createContext, useContext} from "react";

// used online external tool
export const NewsPrefContext = createContext({prefs:{}, setPrefs:()=>{}});

// lecture demo
export const BadgerNewsPrefProvider = ({p}) => {
    const [prefs, setPrefs] = useState({});

    return (
        <NewsPrefContext.Provider value={{prefs,setPrefs}}>
            {p}
        </NewsPrefContext.Provider>
    );
};

export default BadgerNewsPrefProvider;

