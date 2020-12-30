import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";

import "./style.scss";
import PublicLayout from "../../layouts/PublicLayout";

import { useAuth } from "../../context/auth";
import { ADMIN, GUEST, USER } from "../../utils/roles";
import { AuthErrorHandling } from "../../utils/authErrors";
import firebase from "../../context/firebase";

import { createUser, updateUser } from "../../api/user";
import { getAllCountries } from "../../api/countries";

import PageLoader from "../../components/loader";
import RegisterForm from "./components/RegisterForm";
import Enroll2FA from "./components/Enroll2FA";
import { createShipment } from "../../api/shipments";

const handleQuery = (search) => {
  const query = queryString.parse(search);

  if (query.receiver != null && query.id != null && query.email != null) {
    return query;
  }

  return null;
};

const RegisterPage = ({ history, location }) => {
  const [isloading, setIsLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { user, register, reloadUser, deleteUser, getUserToken } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const [guestEmail, setGuestEmail] = useState("");
  const claimShipment = useRef(null);

  if (claimShipment.current == null) {
    claimShipment.current = handleQuery(location.search);
  }

  const formData = useRef({});

  const handleRegistration = async (data) => {
    formData.current = data;
    if (!formData.current.email) {
      formData.current.email = guestEmail;
    }

    try {
      await register(formData.current.email, formData.current.password);

      alert(
        "You need to enroll with 2-factor authentication! Verify your email before adding your number."
      );

      setShowModal(true);
    } catch (error) {
      console.log(error);
      const errorHandler = AuthErrorHandling[error.code];

      if (errorHandler != null) {
        setErrorMessage(errorHandler.response);
      }
    }
  };

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

  const onSuccess = async () => {
    console.log(guestEmail, claimShipment.current);

    try {
      if (guestEmail && claimShipment.current) {
        const token = await getUserToken();
        formData.current.role = USER;
        await updateUser(
          { ...formData.current },
          claimShipment.current.id,
          token
        );
        await reloadUser();

        return;
      }
    } catch (error) {
      if (error.response.status === 404) {
        console.log("User not found, proceed to create user instead.");
      }
    }

    try {
      await createUser({ ...formData.current });
      await reloadUser();
    } catch (error) {
      // deleteUser();
      if (error.response.status === 404) {
        console.log(
          "User already exits? handle! means the provided accountid is wrong..."
        );
      }
    }
  };

  const addShipment = async () => {
    if (showModal === false) {
      setIsLoading(true);
    }

    try {
      const token = await getUserToken();
      const newShipment = {
        receiver: claimShipment.current.receiver,
        weight: claimShipment.current.weight,
        boxColour: claimShipment.current.box_color,
        destinationCountry: claimShipment.current.des_country,
        sourceCountry: claimShipment.current.src_country,
        shipmentStatus: "IN_TRANSIT",
      };
      const shipment = await createShipment(newShipment, token);
      alert(
        "Shipment claimed! This should now redirect the handleShipments page(when its done) and highlight the created shipment through state.claimShipment"
      );

      const { data } = shipment.data;
      console.log(data);

      // redirect to appropriate route and have a toast here "your shipment was successfully added!" with highlighting the shipment

      history.push({
        pathname: "/admin-dashboard/country", // CHANGE THIS! redirect to users shipment page and also add the claimShipment in that page.
        state: { claimShipment: data.id },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRouting = async () => {
    console.log(user);
    if (user === false) {
      fetchCountries();
      return;
    }

    if (user && user.role === USER && claimShipment.current) {
      if (user.email === claimShipment.current.email) {
        await addShipment();

        return;
      } else {
        history.push("/add-shipment");
        return;
      }
    }

    // claimShipment exists in query
    if (claimShipment.current) {
      setGuestEmail(claimShipment.current.email);
      // return;
    }

    if (user && user.role === ADMIN) {
      history.push("/admin-dashboard");
    }

    if (user && user.role === USER) {
      history.push("/add-shipment");
    }
  };

  useEffect(() => {
    // Not logged in at all
    handleRouting();
  }, [user, history]);

  // If user is null it means we are still fetching him/her
  // Therefore, show a loading spinner.
  if (user === null || isloading) {
    return <PageLoader />;
  }

  return (
    <PublicLayout>
      {showModal && (
        <Enroll2FA
          onSuccess={onSuccess}
          initialNumber={formData.current.contactNumber}
          firebase={firebase}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}

      <RegisterForm
        guestEmail={guestEmail}
        handleRegistration={handleRegistration}
        countries={countries}
        errorMessage={errorMessage}
        closeAlert={() => {
          setErrorMessage(false);
        }}
      />
    </PublicLayout>
  );
};

export default RegisterPage;
