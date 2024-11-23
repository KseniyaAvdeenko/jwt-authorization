import React, {FC, useContext, useEffect} from 'react';
import {IUser} from "../../models/IUser";
import styles from './User.module.css'
import {Context} from "../../index";

interface IUserProps {
    user: IUser;
    users: IUser[]
    signOut: Function
}

const User: FC<IUserProps> = ({user, signOut, users}) => {

    return (
        <>
            <header className={styles.header}>
                <div className={styles.header__auth}>
                    <div className={styles.user}>
                        {user.email}
                        {user.isActivated ? '': 'Your email is not confirmed!!'}
                    </div>
                    <button className={styles.button} onClick={() => signOut()}>Sign out</button>
                </div>
            </header>

            <main className={styles.main}>
                <h2>All users: </h2>
                <ul>
                     {users && users.map(user=>(
                    <li key={user.email}>
                        {user.email} Activation: {user.isActivated ?'Yes':'No'}
                    </li>
                ))}
                </ul>
            </main>
        </>
    );
};

export default User;
