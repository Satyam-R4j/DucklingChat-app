import { StreamChat, promoteChannel  } from "stream-chat";
import "dotenv/config"

const apiKey = process.env.STEAM_API_KEY
const apiSecret = process.env.STEAM_API_SECRET

if(!apiKey || !apiSecret)
{
    console.error("Steam api or secret missing")
}

const streamChat  = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData)=>{
    try {
        await streamChat.upsertUser(userData)
        return userData
    } catch (error) {
        console.error("Error upserting Stream user:", error)
    }
}

export const generateStreamToken = (userId) =>{
    
}