import { axiosInstance } from "./axios"

export const signup = async (signUpData)=>{
      const response = await axiosInstance.post("/auth/signup", signUpData)
      return response.data
}