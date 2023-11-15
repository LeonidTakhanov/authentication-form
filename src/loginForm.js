import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "./style.css"; 

const LoginForm = () => {
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const user = await response.json();

      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authenticated: true,
        }),
      });

      alert(`Login successful! Welcome, ${user.email}`);
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors({ auth: "Invalid email or password" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        const errors = {};

        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }

        if (!values.password) {
          errors.password = "Required";
        }

        return errors;
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="email">Email</label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component="div" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Field type="password" id="password" name="password" />
          <ErrorMessage name="password" component="div" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <ErrorMessage name="auth" component="div" className="auth-error" />
      </Form>
    </Formik>
  );
};

export default LoginForm;
