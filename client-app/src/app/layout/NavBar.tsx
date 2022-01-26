import React from 'react';
import { NavLink } from 'react-router-dom';
import {Container, Menu } from 'semantic-ui-react';

export default function NavBar()
{
    return (
        <Menu inverted fixed='top'>
            <Container fluid >
                <Menu.Item as={NavLink} to='/' header>
                    <img src = "/assets/LOGO.png" alt = "logo" style ={{marginRight: 10}} />
                    Home
                </Menu.Item>
                <Menu.Item as={NavLink} to='/jobs' name ='Jobs'/> 
            </ Container >

        </Menu>
    )
}