import React, {Component} from 'react';
import { Form, Button, Row, Col, FormGroup } from 'react-bootstrap';

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
const EMAILJS_SERVICE_ID = 'service_jkx0s4s'
const EMAILJS_TEMPLATE_ID = 'template_pkunsbo'
const EMAILJS_PUBLIC_KEY = 'mqoDugN3shcQ_HH36'

class Contact extends Component {
    state = {
        name: '',
        email: '',
        contactReason: '',
        message: '',
        backgroundImage: this.getBackgroundImage(null),
        placeholder: 'Enter message here',
        status: null
    }
    handleSubmit(e) {
        e.preventDefault()
        const { name, email, contactReason, message } = this.state
        let templateParams = {
        from_name: name,
        reply_to: email,
        to_name: 'ohull1@binghamton.edu',
        contact_reason: contactReason,
        message: message,
        }
        this.setState({ status: 'sending' })
        fetch(EMAILJS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: templateParams,
            }),
        }).then((response) => {
            if (!response.ok) {
                return response.text().then((text) => {
                    throw new Error(text || `HTTP ${response.status}`)
                })
            }
            this.resetForm()
            this.setState({ status: 'success' })
        }).catch((err) => {
            console.error('EmailJS send failed:', err)
            this.setState({ status: 'error' })
        })
    }
    resetForm() {
        this.setState({
        name: '',
        email: '',
        contactReason: '',
        message: '',
        })
    }
    handleChange = (param, e) => {
        this.setState({ [param]: e.target.value })
    }

    setBackground = (param, e) => {
        this.handleChange(param, e);
        this.setState({backgroundImage : this.getBackgroundImage(e.target.value),
                        placeholder: this.getPlaceholder(e.target.value)})
    }

    getBackgroundImage(value){
        switch(value){
            case 'Paint Ur Pup':
                return 'https://u.cubeupload.com/kaleighllama/pypbg.jpg';
            case 'Request Painting':
                return 'https://u.cubeupload.com/kaleighllama/requestpaintingbg.jpg';
            default: 
                return 'https://u.cubeupload.com/kaleighllama/llama.jpg';
        } 
    }
    getPlaceholder(value){
        switch(value){
            case 'Paint Ur Pup':
            case 'Custom Painting':
                return 'Include a link to the image you want painted if possible';
            default: 
                return 'Enter message here';
        } 
    }

    render() {
        return(

        <Form  onSubmit={this.handleSubmit.bind(this)}>

            <div className="first-container bg-img-full contact-container" style={{backgroundImage : `url(${this.state.backgroundImage})`}}>

                        <Col className="primary-color rounded my-auto offset-md-2 offset-lg-3 p-3 p-md-5 opacity-4 contact-card" sm={12} md={8} lg={6}>
                        <h1 className="mb-4">Contact</h1>

                            <FormGroup>
                                <Row>
                                    <Col sm={6} className="mt-2">
                                    <Form.Control   
                                        type="text"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleChange.bind(this, 'name')}
                                        placeholder="Name"
                                    />
                                    </Col>
                                    <Col sm={6} className="mt-2">
                                    <Form.Control 
                                        type="email" 
                                        name="email"
                                        placeholder="Email" 
                                        value={this.state.email}
                                        onChange={this.handleChange.bind(this, 'email')}/>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Form.Control 
                                    as="select"
                                    name="contactReason"
                                    className="text-primary"
                                    value={this.state.contactReason}
                                    onChange={this.setBackground.bind(this, 'contactReason')}
                                >
                                    <option>Reason For Contacting</option>
                                    <option>Custom Painting</option>
                                    <option>Paint Ur Pup</option>
                                    <option>Other</option>
                                </Form.Control>
                            </FormGroup>
                            <FormGroup>
                                <Form.Control 
                                    rows={6} 
                                    as="textarea" 
                                    placeholder={this.state.placeholder} 
                                    name="message"
                                    value={this.state.message}
                                    onChange={this.handleChange.bind(this, 'message')}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button variant="primary" type="submit" id="send-email-button" disabled={this.state.status === 'sending'}>
                                    {this.state.status === 'sending' ? 'Sending...' : 'Submit'}
                                </Button>
                                {this.state.status === 'success' &&
                                    <div className="mt-2 text-success">Message sent — thank you!</div>}
                                {this.state.status === 'error' &&
                                    <div className="mt-2 text-danger">Sorry, something went wrong. Please try again or email directly.</div>}
                            </FormGroup>
                        </Col>

            </div>
            </Form>

        );
    };
}
  
export default Contact;