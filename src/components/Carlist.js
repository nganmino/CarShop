import React, { useState, useEffect } from "react";
import AddCar from "./AddCar";

import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css"; //change from alpine to material

import Snackbar from "@mui/material/Snackbar";

function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    fetch("http://carrestapi.herokuapp.com/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  const deleteCar = (url) => {
    if (window.confirm("Are you sure?")) {
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setOpen(true);
            fetchCars();
          } else {
            alert("Something went wrong");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const addCar = (car) => {
    fetch("http://carrestapi.herokuapp.com/cars/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((response) => fetchCars())
      .catch((err) => console.error(err));
  };

  const columns = [
    { field: "brand", sortable: true, filter: true },
    { field: "model", sortable: true, filter: true },
    { field: "color", sortable: true, filter: true },
    { field: "fuel", width: 100, sortable: true, filter: true },
    { field: "year", width: 100, sortable: true, filter: true },
    { field: "price", width: 100, sortable: true, filter: true },
    {
      field: "_links.self.href",
      cellRendererFramework: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => deleteCar(params.value)}
        >
          Delete
        </Button>
      ), //add delete button
    },
  ];

  return (
    <div>
      <AddCar addCar={addCar} />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: "90%", margin: "auto" }}
      >
        {/* change from alpine to material */}
        <AgGridReact
          rowData={cars}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          suppressCellSelection={true}
        />
      </div>

      <Snackbar
        open={open}
        onClose={handleClose}
        message="Car deleted"
        autoHideDuration={3000}
      />
    </div>
  );
}

export default Carlist;
