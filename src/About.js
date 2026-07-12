import React from 'react';
import {Col, Card} from 'react-bootstrap';
import './css/about.css';
const About = () => (
    <div className = "about-section first-container bg-img-full">
      <Col xl={4} lg={6} md={7} id="portrait" className="d-none d-md-block">
        <img src="https://u.cubeupload.com/kaleighllama/portrait.png" alt="a pictur of nectar"/>
      </Col>
      <Col lg={4} md={5} sm={12} className="offset-lg-1 offset-xl-3 offset-0 mt-0 mt-md-0 mt-2" id ="about-text">
        <Card >
          <Card.Header>
            <h1>About Me</h1>
          </Card.Header>
          <Card.Body id="about-body">
            <p>Hey! My name is Kaleigh and I love llamas, animals, nature, and color. I was trained in fine arts at FIT before I left for the desert and farm life in S Utah - where I met my best friend Mac, a McNab Border Collie Aussie who shows up in a lot of my work. That chapter led me to Bend, OR, where I've been studying and practicing veterinary medicine.</p>

            <p>My art is inspired by the world around me and the journey that brought me here. My goal is to share it with you!</p>

            <p>Catch me at local art markets - find the dates on my <a href="https://www.instagram.com/kaleigh.llama/" >Instagram</a> - and check out my prints <a href="https://www.etsy.com/shop/KaleighLlama">Here</a> </p>
          </Card.Body>
        </Card> 
      </Col>

    </div>

);

export default About;