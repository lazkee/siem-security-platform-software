import axios from "axios";
import dotenv from "dotenv";
import { ILLMChatAPIService, ChatMessage , ChatRole} from "../Domain/Services/ILLMChatAPIService";

dotenv.config();
const API_URL = process.env.API_URL!;
const MODEL_ID = process.env.MODEL_ID!;

export class LLMChatAPIService implements ILLMChatAPIService {
    constructor() {
        if(!API_URL || !MODEL_ID){
            throw new Error("API_URL or MODEL_ID not defined in environment variables");
        }
    }
    async sendPromptToLLM(message: ChatMessage): Promise<string>{
        
        try{
            const res = await axios.post(
                API_URL,
                {
                    model: MODEL_ID,
                    message,
                    temperature:0.1,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer lm-studio",
                    },
                }
            );
            return (
                res.data?.choices?.[0]?.message?.content ??
                "No response from the model."
      );
        } catch(error:any) {
            if(axios.isAxiosError(error)){
                const apiMsg = error.response?.data?.error?.message ??
                error.response?.data?.message;

                return `LLM error: ${apiMsg ?? error.message}`;
            }
            return `Unexpected error: ${error.message}`;
        }
    }

}