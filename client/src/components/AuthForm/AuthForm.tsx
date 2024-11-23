import React, {FC, useContext, useState} from 'react';
import {Context} from "../../index";
import styles from './AuthForm.module.css'
import {observer} from "mobx-react-lite";

const AuthForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);

    return (
        <div className={styles.AuthForm__container}>
            <h1>Sign in or sign up</h1>
            <div className={styles.AuthForm__items}>
                <div className={styles.input__container}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                        name="email"
                        value={email}
                        id="email"
                        placeholder={'e.g. example@mail.com'}
                    />
                </div>
                <div className={styles.input__container}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        name="password"
                        id="password"
                        placeholder={'Type here...'}
                        min={2}
                    />
                </div>
            </div>

            <button className={styles.button} onClick={() => store.signIn(email, password)}>Sign in</button>
            <button className={styles.button} onClick={() => store.signUp(email, password)}>Sign up</button>
        </div>

    );
};

export default observer(AuthForm);
