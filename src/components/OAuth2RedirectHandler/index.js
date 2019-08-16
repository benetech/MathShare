import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { setUserProfile } from '../../redux/userProfile/actions';

const getUrlParameter = (name) => {
    const sanitizedName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${sanitizedName}=([^&#]*)`);

    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const OAuth2RedirectHandler = (props) => {
    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    if (token || error) {
        const url = window.location.origin + window.location.pathname + window.location.hash;
        if (typeof (window.history.pushState) !== 'undefined') {
            const obj = { Page: '', Url: url };
            window.history.pushState(obj, obj.Page, obj.Url);
            const { user } = jwtDecode(token);
            const { email, name, picture } = user;
            props.setUserProfile(email, name, picture, 'google');
        } else {
            window.location.href = url;
            // alert("Browser does not support HTML5.");
        }
    }

    if (token) {
        localStorage.setItem('access_token', token);
        return (
            <Redirect to={{
                pathname: '/app',
                state: { from: props.location },
                search: '',
            }}
            />
        );
    } if (error) {
        return (
            <Redirect to={{
                pathname: '/signIn',
                state: {
                    from: props.location,
                    error,
                },
                search: '',
            }}
            />
        );
    }
    return null;
};

export default connect(
    () => ({}),
    {
        setUserProfile,
    },
)(OAuth2RedirectHandler);
