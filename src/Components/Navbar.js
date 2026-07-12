import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AiFillInstagram, AiFillFacebook, AiFillYoutube } from 'react-icons/ai';
import Logo from '../images/alpaca-svgrepo-com.svg';

const Navigation = () => (

    <Navbar collapseOnSelect expand="lg" className="primary-color p-3" variant='dark'>
    <Navbar.Brand>
        <Link to="/" className="nav-link">
            <img src={Logo} width="70" height="70" alt="Kaleigh Llama"/>
        </Link>
    </Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
        <Nav.Item>
            <HashLink to="/#art" className="nav-link">Art</HashLink>
        </Nav.Item>
        <Nav.Item>
            <Link to="/about" className="nav-link">About Me</Link>
        </Nav.Item>   
        <Nav.Item>
            <Link to="/contact" className="nav-link">Contact</Link>
        </Nav.Item>
        <Nav.Item>
            <a href="https://www.etsy.com/shop/KaleighLlama" className="nav-link">Shop</a>
        </Nav.Item>
    </Nav>
    <Nav>
        <Nav.Item>
            <a href="https://www.instagram.com/kaleigh.llama/" className="nav-link"><AiFillInstagram size={30}/></a>
        </Nav.Item>
        <Nav.Item>
            <a href="https://www.facebook.com/kale.acevedo.3" className="nav-link"><AiFillFacebook size={30}/></a>
        </Nav.Item>
        <Nav.Item>
            <a href="https://www.youtube.com/channel/UCquh_XpItd3LPjVvvw_xFYw" className="nav-link"><AiFillYoutube size={30}/></a>
        </Nav.Item>
    </Nav>
  </Navbar.Collapse>
</Navbar>

);

export default Navigation;