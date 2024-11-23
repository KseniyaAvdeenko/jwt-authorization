import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../service/AuthService";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import axiosInstance, {BASE_URL} from "../http";

export default class Store {
    users: IUser[]|null = null;
    user: IUser | null = null;
    isAuth: Boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: Boolean) {
        this.isAuth = bool
    }

    setUser(user: IUser | null) {
        this.user = user
    }

    setUsers(users:IUser[]){
        this.users = users
    }

    async signIn(email: string, password: string) {
        try {
            const response = await AuthService.signInUser(email, password)
            console.log(response.data)
            localStorage.setItem('access', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (err) {
            this.setAuth(false)
            console.log(err)
        }
    }

    async signUp(email: string, password: string) {
        try {
            const response = await axios.post<AuthResponse>(BASE_URL +'/sign-up', {email, password})
            console.log(response.data)
            this.setAuth(false);
        } catch (err) {
            console.log(err)
        }
    }

    async signOut() {
        try {
            const response = await AuthService.signOutUser()
            console.log(response)
            localStorage.removeItem('access');
            this.setUser(null)
            this.setAuth(false);
        } catch (err) {
            console.log(err)
        }
    }

    async checkAuth() {
        try {
            const response = await axios.get<AuthResponse>(BASE_URL + '/refresh', {withCredentials: true})
            console.log(response)
            localStorage.setItem('access', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (err) {
            this.setAuth(false)
            console.log(err)
        }
    }
    async getUsers() {
        try {
            const response = await AuthService.getUsers()
            this.setUsers(response.data)
        } catch (err) {
            console.log(err)
        }
    }
}