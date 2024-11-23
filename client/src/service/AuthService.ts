import axiosInstance from "../http";
import {AxiosResponse} from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {IUser} from "../models/IUser";


export default class AuthService{
    static async getUsers(): Promise<AxiosResponse>{
        return axiosInstance.get<IUser[]>('/users')
    }

    static async signOutUser(): Promise<string>{
        return axiosInstance.post('/sign-out')
    }
    static async signInUser(email: string, password: string): Promise<AxiosResponse>{
        return axiosInstance.post<AuthResponse>('/sign-in', {email, password})
    }

}