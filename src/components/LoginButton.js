import React from 'react';
import { Button, IconButton, Menu, MenuItem, ListItemText } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { withAuth } from '@okta/okta-react';

class LoginButton extends React.Component {
    state = {
        authenticated: null,
        user: null,
        menuAnchor: null
    };

    componentDidUpdate() {
        this.checkAuthentication();
    }
    async componentDidCatch() {
        const authenticated = this.props.auth.isAuthenticated();
    }
}