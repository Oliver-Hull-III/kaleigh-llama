import React, { useState } from 'react';
import { Col, Card, Container, Row } from 'react-bootstrap';
import { ColumnsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/columns.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { netlifyImageUrl } from './utils/netlifyImage';
import galleries from './data/galleries.json';

const Art = () => {
  const [openGallery, setOpenGallery] = useState(null);
  const [index, setIndex] = useState(0);

  return (
    <Container fluid className="primary-color" id="art">
      <Container className="p-1 p-md-2">
        <Row>
          <Col>
            <h1 className="m-3">Art</h1>
          </Col>
        </Row>
        {galleries.map((gallery, i) => {
          const photos = gallery.images.map(img => ({
            src: netlifyImageUrl(img.src, { w: 800 }),
            width: img.width,
            height: img.height,
            alt: img.alt,
          }));
          const slides = gallery.images.map(img => ({
            src: netlifyImageUrl(img.src, { w: 1920 }),
            width: img.width,
            height: img.height,
            alt: img.alt,
          }));

          return (
            <Row key={gallery.slug} className={i < galleries.length - 1 ? 'mb-4' : ''}>
              <Col sm={12}>
                <Card>
                  <Card.Header>
                    <h2>{gallery.name}</h2>
                    {gallery.description && <p className="lead">{gallery.description}</p>}
                  </Card.Header>
                  <Card.Body>
                    <ColumnsPhotoAlbum
                      photos={photos}
                      columns={gallery.columns}
                      onClick={({ index: clickedIndex }) => {
                        setOpenGallery(gallery.slug);
                        setIndex(clickedIndex);
                      }}
                    />
                    <Lightbox
                      styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.8)" } }}
                      open={openGallery === gallery.slug}
                      close={() => setOpenGallery(null)}
                      index={index}
                      slides={slides}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          );
        })}
      </Container>
    </Container>
  );
};

export default Art;
