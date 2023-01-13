import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSignupUserMutation } from "../services/appApi";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import socialize from "../assets/socialize.png"

function Signup() {
    const [email, setEmail]  = useState(" ");
    const [ password, setPassword ] = useState(" ");
    const [ name, setName ] = useState(" ");
    const [signupUser, {isLoading, error}]=useSignupUserMutation();
    const navigate= useNavigate();
    //img upload state
    const [image, setImage]= useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    


    function validateImg(e) {
      const file = e.target.files[0];
      if (file.size >= 100485) {
        return alert("Max file size is 1mb");
      } else {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
    async function uploadImage(){
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'chat-app');
        try{
            setUploadingImg(true);
            let res = await fetch(
              "https://api.cloudinary.com/v1_1/dcltnqs8p/image/upload",
              {
                method: "post",
                body: data,
              }
            );
            const urlData = await res.json();
            setUploadingImg(false);
            return urlData.url;  
        }
        catch(error){
            setUploadingImg(false);
            console.log(error);
        }
    }
       async function handleSignup(e) {
     e.preventDefault();
          if (!image) return alert("Please upload your profile picture");
          const url = await uploadImage(image);
          console.log(url);
          // signup the user
          signupUser({ name, email, password, picture: url }).then(
            ({ data }) => {
              if (data) {
                console.log(data);
                navigate("/chat");
              }
            }
          );
   }

  return (
    <Container className="Signup__bg">
      <Row>
        <Col
          md={20}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center">Create account</h1>
            <div className="signup-profile-pic__container">
              <img src={imagePreview || socialize} className="signup-profile-pic" />
              <label htmlFor="image-upload" className="image-upload-label">
                <i
                  className="fas fa-circle-plus"
                  style={{
                    color: "green",
                    position: "relative",
                    bottom: "25px",
                    left: "8px",
                    zIndex: "99",
                    backgroundColor: "white",
                    borderRadius: "20px",
                  }}
                ></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={validateImg}
              />
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicCheckbox"
            ></Form.Group>
            <Button variant="primary" type="submit">
              {uploadingImg ? 'Signing you up ...':'Signup'}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        {/* <Col md={5} className="Signup__bg"></Col> */}
      </Row>
    </Container>
  );
}

export default Signup;
