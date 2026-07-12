import React from 'react'; 
import { Col, Card, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ColumnsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/columns.css';
import {netlifyImageUrl} from "./utils/netlifyImage";


const paintYourPup = [
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_1x1_1.jpg', { w: 800 }),
      width: 3,
      height: 3
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_4x3_3.jpg', { w: 800 }),
      width: 3,
      height: 4
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_7x5_3.jpg', { w: 800 }),
      width: 5,
      height: 7
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_4x3_4.jpg', { w: 800 }),
      width: 3,
      height: 4
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_10x8_4.jpg', { w: 800 }),
      width: 8,
      height: 10
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_3x2_1.jpg', { w: 800 }),
      width: 3,
      height: 2
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_10x8_3.jpg', { w: 800 }),
      width: 8,
      height: 10
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_3x2_2.jpg', { w: 800 }),
      width: 2,
      height: 3
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_7x5_2.jpg', { w: 800 }),
      width: 5,
      height: 7
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_7x5_1.jpg', { w: 800 }),
      width: 7,
      height: 5
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_10x8_1.jpg', { w: 800 }),
      width: 8,
      height: 10
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_10x8_2.jpg', { w: 800 }),
      width: 8,
      height: 10
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_3x2_3.jpg', { w: 800 }),
      width: 2,
      height: 3
    },
    {
      src: netlifyImageUrl('images/paintyourpup/pyp_4x3_1.jpg', { w: 800 }),
      width: 3,
      height: 4
    },
    {
      src: netlifyImageUrl('/images/paintyourpup/pyp_4x3_2.jpg', { w: 800 }),
      width: 3,
      height: 4
    }

  ];

  const songsForFriends = [
      {
        src: 'images/songs4bffs/s4f_1.jpg',
        width: 1,
        height: 1
      },
      {
        src: 'images/songs4bffs/s4f_2.jpg',
        width: 1,
        height: 1
      },
      {
        src: 'images/songs4bffs/s4f_3.jpg',
        width: 1,
        height: 1
      },
      {
        src: 'images/songs4bffs/s4f_4.jpg',
        width: 1,
        height: 1
      }
    ];

const Art = () => (

    <Container fluid className="primary-color" id="art">

        <Container className="p-1 p-md-2">
        <Row>
            <Col>
            <h1 className="m-3">Art</h1>
            </Col> 
        </Row>
        <Row  className="mb-4"> 
            <Col sm={12}>
            <Card> 
                <Card.Header>
                <h2>Paint ur Pup</h2>
                <p className="lead">This is a series of commissions I've been doing for owners of the animals I take care of, as well as my friends and family. You can request one <Link to="/contact">here</Link></p>
                </Card.Header>
                <Card.Body>
                <ColumnsPhotoAlbum photos={paintYourPup} columns={3} />
                </Card.Body>
            </Card>
            </Col>
        </Row>        
        <Row> 
            <Col sm={12}>
            <Card> 
                <Card.Header> 
                <h2>Songs for BFFs</h2>
                <p className="lead">For each of these works, I had a friend choose a song and I used it as inspiration.</p>
                </Card.Header>
                <Card.Body>
                <ColumnsPhotoAlbum photos={songsForFriends} columns={2} />
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>


    </Container>
);


export default Art;