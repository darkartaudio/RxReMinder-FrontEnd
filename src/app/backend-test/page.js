'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';
import setAuthToken from '@/app/utils/setAuthToken';
import handleLogout from '@/app/utils/handleLogout';

import 'src/app/css/logged-in.css';

export default function Test() {
    const router = useRouter();
    const [date, setDate] = useState('');
	const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

    if (typeof window !== 'undefined') {
        const expirationTime = new Date(localStorage.getItem('expiration') * 1000);
        let currentTime = Date.now();

        if (currentTime >= expirationTime) {
            handleLogout();
            router.push('/login');
        }
    }

    useEffect(() => {
        setAuthToken(localStorage.getItem('jwtToken'));
        if (localStorage.getItem('jwtToken')) {
            axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/email/${localStorage.getItem('email')}`)
                .then((response) => {
                    let userData = jwtDecode(localStorage.getItem('jwtToken'));
                    if (userData.email === localStorage.getItem('email')) {
                        setData(response.data.users[0]);
                        setLoading(false);
                    } else {
                        router.push('/login');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    router.push('/login');
                });
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleDate = (e) => {
        setDate(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/prescriptions/user`)
            .then(response => {
                let prescriptions = response.data;
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="time" name="date" value={date} onChange={handleDate} />
            <button type="submit">Submit</button>
        </form>
    );
}