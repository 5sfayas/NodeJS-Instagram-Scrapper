import React, { useState } from "react";
import './HomePage.css';

import { AiFillInfoCircle } from "react-icons/ai";
import { CgCrown } from "react-icons/cg";
import { BsFillPersonCheckFill } from "react-icons/bs";



const Homepage = props => {
    const [username, setUsername] = useState("");

    const onChange = ({ target: { value }}) =>{
        setUsername(value);
    };

    const onClick = () =>{
        fetch(`/api/getData/${username}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });
        console.log(username);
        alert("submtied")
    }

    return (
        <div className="HomePage">
            <div className="TopSection">
                <div className="viewInventory__topInput">
                <input value={username} placeholder="Username..." onChange={onChange} />
                <button onClick={onClick}> Submit </button>
                </div>            
            </div>
            <div className="Middle_Section">
                <div className="InputUserName">
                    Type in your instagam username to Get Started
                    </div>
                <div className="InputExplained">
                    We'll show you who unfollewed you and who you're not following
                </div>
            </div>
            <div className="DiscoverBox">
                <div className="DiscoverBox_Icon">
                <div className="DiscoverBox1">
                    <AiFillInfoCircle />               
                    </div>
                <div className="DiscoverBox2">
                    <BsFillPersonCheckFill />
                        
                    </div>
                <div className="DiscoverBox3">
                        <CgCrown />
                    </div>
                </div>
                <div className="DiscoverBox_Text">
                    <div className="DiscoverBoxT1">                                        
                        Check Who Unfollowed You
                    </div>
                    <div className="DiscoverBoxT2">                    
                            Find Who you are'nt Following 
                        </div>
                    <div className="DiscoverBoxT3">
                        Discover Who to Follow
                        </div>
                </div>
            </div>
            <div className="UnderConstruction">
                    This is under construction - to View Result of Scrapping use Browser Console
                    </div>
        </div>
    );
};

export default Homepage;