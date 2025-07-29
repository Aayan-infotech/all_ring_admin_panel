import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { login } from "../../services/auth";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
  setError("");
  setLoading(true);

  try {
    const response = await axios.post(
      "http://54.205.149.77:5010/api/admin/auth/login", 
      data
    );

    console.log("Login Success. Token:", response.data.webAccessToken);
    
   
    login(response.data.webAccessToken);
    if (response.data.email) {
      localStorage.setItem('userEmail', response.data.email);
    }
    
    console.log("Navigating to dashboard...");
    navigate("/dashboard");
  } catch (err) {
    setError(
      err.response?.data?.message || "Invalid credentials or server error"
    );
  } finally {
    setLoading(false);
  }
};
  return (
<Container
  fluid
  className="login-container p-0"
  style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)`,
  }}
>

      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <Card
            className="login-card shadow"
            style={{
              border: "none",
              borderRadius: "15px",
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Card.Body style={{ padding: "2rem" }}>
              <div className="text-center mb-4">
                <h2 style={{ color: "var(--secondary)", fontWeight: "300" }}>
                  Welcome to
                </h2>
                <h1
                  style={{
                    color: "var(--primary)",
                    fontWeight: "700",
                    fontSize: "2rem",
                  }}
                >
                  All Back to Rings App
                </h1>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    style={{
                      borderRadius: "8px",
                      padding: "12px 15px",
                      border: "2px solid var(--accent)",
                    }}
                  />
                  {errors.username && (
                    <small className="text-danger">
                      {errors.username.message}
                    </small>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    style={{
                      borderRadius: "8px",
                      padding: "12px 15px",
                      border: "2px solid var(--accent)",
                    }}
                  />
                  {errors.password && (
                    <small className="text-danger">
                      {errors.password.message}
                    </small>
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{
                    backgroundColor: "var(--primary)",
                    border: "none",
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "white",
                  }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
