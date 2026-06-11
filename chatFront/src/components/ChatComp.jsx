import { useEffect, useState } from "react"
import {connect} from '../services/chatSocket'


const ChatComp = () => {
    const [userID, setID] = useState('')

    useEffect(() => {
        connect()
    }, [])

    return (
        <div>
            <h1>Test</h1>
        </div>
    )
}

export default ChatComp