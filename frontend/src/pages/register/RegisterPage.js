import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import FormGroup from "./FormGroup";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./style.scss";
import Button from "react-bootstrap/Button";

import PublicLayout from "../../layouts/PublicLayout";
import { useEffect } from "react";
import PageLoader from "../../components/loader";
import { getAllCountries } from "../../api/countries";

const { Option } = components;
const IconOption = (props) => (
  <Option {...props}>Ikonhär -{props.data.label}</Option>
);

const RegisterPage = () => {
  const [isloading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");

  const [countries, setCountries] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  /*
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };*/

  const handleRegistration = () => {
    console.log("clicked");
  };

  useEffect(() => {
    const fetchCountries = async () => {
      let response = await getAllCountries();
      let { data: savedCountries } = response.data;

      savedCountries = savedCountries.map((obj) => {
        return {
          label: obj.name,
          value: obj.name,
          feeMultiplier: obj.feeMultiplier,
        };
      });

      setCountries(savedCountries);
      setIsLoading(false);
    };

    fetchCountries();
  }, []);

  return (
    <PublicLayout>
      {isloading ? (
        <PageLoader />
      ) : (
        <div className="login">
          <Form.Group>
            <Form.Label>Enter en Email</Form.Label>
            <Form.Control
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              type="email"
              placeholder="Enter an email.."
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              type="password"
              placeholder="Enter a password..."
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Firstname</Form.Label>
            <Form.Control
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              type="text"
              placeholder="Enter firstname..."
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              type="text"
              placeholder="Enter lastname..."
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Zipcode</Form.Label>
            <Form.Control
              onChange={(e) => {
                setZipCode(e.target.value);
              }}
              value={zipCode}
              type="text"
              placeholder="Enter zipcode..."
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contact number</Form.Label>
            <Form.Control
              onChange={(e) => {
                setContactNumber(e.target.value);
              }}
              value={contactNumber}
              type="text"
              placeholder="Enter contact number..."
            />
          </Form.Group>
          <DatePicker
            selected={dateOfBirth}
            showYearDropdown
            maxDate={new Date()}
            placeholderText="MM/DD/YYYY"
            onChange={(date) => setDateOfBirth(date)}
            className="date-picker"
          />

          <Select
            placeholder={"Select country"}
            options={countries}
            components={{ Option: IconOption }}
            onChange={(e) => {
              setCountry(e.value);
            }}
          />
          <Button onClick={handleRegistration} variant="primary" type="submit">
            Submit
          </Button>
          {country}
        </div>
      )}
    </PublicLayout>
  );
};

export default RegisterPage;
