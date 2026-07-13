import React from 'react';
import { Col, Card, Container, Row } from 'react-bootstrap';
import { ColumnsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/columns.css';
import { netlifyImageUrl } from './utils/netlifyImage';
import galleries from './data/galleries.json';

const Art = () => (
  <Container fluid className="primary-color" id="art">
    <Container className="p-1 p-md-2">
      <Row>
        <Col>
          <h1 className="m-3">Art</h1>
        </Col>
      </Row>
      {galleries.map((gallery, i) => (
        <Row key={gallery.slug} className={i < galleries.length - 1 ? 'mb-4' : ''}>
          <Col sm={12}>
            <Card>
              <Card.Header>
                <h2>{gallery.name}</h2>
                {gallery.description && <p className="lead">{gallery.description}</p>}
              </Card.Header>
              <Card.Body>
                <ColumnsPhotoAlbum
                  photos={gallery.images.map(img => ({
                    src: netlifyImageUrl(img.src, { w: 800 }),
                    width: img.width,
                    height: img.height,
                    alt: img.alt,
                  }))}
                  columns={gallery.columns}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  </Container>
);

export default Art;
