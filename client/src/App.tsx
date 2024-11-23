import React, {useContext, useEffect} from 'react';
import styles from './App.module.css'
import SignInForm from "./components/AuthForm/AuthForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import User from "./components/User/User";

function App() {
    const {store} = useContext(Context)
    useEffect(() => {
        if (localStorage.access) {
            store.checkAuth()
            store.getUsers()
        }
    }, [store.isAuth])

    return !store.isAuth
        ? (
            <div className={styles.App}>
                <SignInForm/>
            </div>
        )
        : (<div className={styles.App__user}>{store.user && (
            <User users={store.users || []} user={store.user} signOut={store.signOut}/>)}
        </div>)
}

export default observer(App);
