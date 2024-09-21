// frontend/src/components/AddressForm.jsx

import { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { addAddress } from "../services/addressesService";

const AddressForm = ({ addresses, setAddresses, setSelectedAddressId }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setAddressLine1("");
    setAddressLine2("");
    setPostalCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addressData = {
      first_name: firstName,
      last_name: lastName,
      address_line1: addressLine1,
      address_line2: addressLine2,
      postal_code: postalCode,
    };

    try {
      await addAddress(addressData);
      setAddresses((prevAddresses) => [
        ...prevAddresses,
        { ...addressData, id: Date.now() },
      ]);
      clearForm();
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  return (
    <div className="address-form">
      <p className="mb-3">
        <strong>Add New Address</strong>
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mb-2"
          />
        </Form.Group>
        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mb-2"
          />
        </Form.Group>
        <Form.Group controlId="formAddressLine1">
          <Form.Label>Address Line 1</Form.Label>
          <Form.Control
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
            className="mb-2"
          />
        </Form.Group>
        <Form.Group controlId="formAddressLine2">
          <Form.Label>Address Line 2</Form.Label>
          <Form.Control
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="mb-2"
          />
        </Form.Group>
        <Form.Group controlId="formPostalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className="mb-2"
          />
        </Form.Group>
        <Button className="button_custom mt-3" variant="primary" type="submit">
          Add Address
        </Button>
      </Form>

      <p className="mt-4">
        <strong>Select Shipping Address:</strong>
      </p>
      <ListGroup>
        {addresses.map((address) => (
          <ListGroup.Item
            key={address.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Form.Check
              type="radio"
              label={
                <>
                  <div>
                    <strong>{`${address.first_name} ${address.last_name}`}</strong>
                  </div>
                  <div>{address.address_line1}</div>
                  {address.address_line2 && <div>{address.address_line2}</div>}
                  <div>{address.postal_code}</div>
                </>
              }
              name="addressSelect"
              id={`address-${address.id}`}
              onChange={() => setSelectedAddressId(address.id)}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default AddressForm;
