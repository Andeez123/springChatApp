import { useState } from "react"


export const ChatRoom = () => {
    const [userData, setUserData] = useState({
        username: "",
        receivername: "",
        connected: false,
        message: ""
    })

    const registerUser = () => {}

    return (
        <div>
            {userData.connected ? 
                <div></div> :
                <div>
                    <input
                        placeholder="Enter the username"
                        value={userData.username}
                        onChange={(event) => { setUserData({ ...userData, "username": event.target })}}
                    >
                    </input>
                    <button type="button" onClick={registerUser}> Connect </button>
                </div>}
        </div>
    )
}