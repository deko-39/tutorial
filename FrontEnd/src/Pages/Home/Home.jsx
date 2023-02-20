import React from "react";

import { Button } from "antd";
import { Link } from "react-router-dom";

import classNames from 'classnames/bind';
import styles from './home.module.scss';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx("container")}>
            <div className={cx("homepage")}>
                <h1>HomePage</h1>
                <Button type="primary"><Link to={'/login'}>Sign In</Link></Button>
                <Button type="primary"><Link to={'/register'}>Sign Up</Link></Button>
            </div>
        </div>
    )
}

export default Home;