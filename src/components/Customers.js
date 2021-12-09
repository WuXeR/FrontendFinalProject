import React from 'react';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport
} from '@mui/x-data-grid';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Customers = () => {
    const [customers, setCustomers] = React.useState([]);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [deleteDialogState, setDeleteDialogState] = React.useState(false);
    const [addDialogState, setAddDialogState] = React.useState(false);
    const [addDialogData, setAddDialogData] = React.useState({});
    const [addTrainingDialogState, setAddTrainingDialogState] = React.useState(false);
    const [addTrainingDialogData, setAddTrainingDialogData] = React.useState({});
    const [addTrainingDialogCustomer, setAddTrainingDialogCustomer] = React.useState({});

    const fetchCustomers = () => {
        fetch(global.ApiURL + "/api/customers")
        .then(res => res.json())
        .then(data => {
            data.content.forEach((customer, index) => {
                customer.id = index;
            });
            setCustomers(data.content)
            handleSelection([]);
        })
        .catch(err => console.log(err));
    }
    React.useEffect(fetchCustomers, []);

    const handleSelection = (newSelection) => {
        setSelectionModel(newSelection);
    }

    const handleEdit = (event) => {
        var customer = customers[event.id];
        customer[event.field] = event.value;
        fetch(customer.links[0].href, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(() => fetchCustomers())
        .catch(err => console.error(err))
    }

    const columns = [
        { field: 'add_training', headerName: '', flex: 1, disableColumnMenu: true, sortable: false, filterable: false,
            renderCell: (params) => (
                <IconButton color='success' onClick={() => {
                    setAddTrainingDialogCustomer(params.row);
                    setAddTrainingDialogData({});
                    setAddTrainingDialogState(true);
                }}><AddCircleOutlineIcon /></IconButton>
            )
        },
        { field: 'firstname', headerName: 'First Name', flex: 10, editable: true },
        { field: 'lastname', headerName: 'Last Name', flex: 10, editable: true },
        { field: 'streetaddress', headerName: 'Street Address', flex: 10, editable: true },
        { field: 'postcode', headerName: 'Post Code', type: "number", flex: 10, editable: true },
        { field: 'city', headerName: 'City', flex: 10, editable: true },
        { field: 'email', headerName: 'Email', flex: 10, editable: true },
        { field: 'phone', headerName: 'Phone', flex: 10, editable: true }
    ];

    return (
        <>
            <DataGrid
                rows={customers}
                columns={columns}
                style={{marginBottom: 55}}
                components={{
                    Toolbar: () => (
                        <GridToolbarContainer>
                            <Button color="success" onClick={() => {
                                setAddDialogData({});
                                setAddDialogState(true);
                            }}><AddCircleOutlineIcon /> Add</Button>
                            <Button color="error" onClick={() => {
                                if(selectionModel.length > 0)
                                    setDeleteDialogState(true);
                            }}><DeleteOutlineIcon /> Delete</Button>
                            <GridToolbarColumnsButton />
                            <GridToolbarFilterButton />
                            <GridToolbarDensitySelector />
                            {/* <GridToolbarExport /> */}
                        </GridToolbarContainer>
                    ),
                }}
                onSelectionModelChange={handleSelection}
                onCellEditCommit={handleEdit}
                selectionModel={selectionModel}
                checkboxSelection
                disableSelectionOnClick
                autoHeight
            />
            <Dialog open={addDialogState} onClose={() => setAddDialogState(false)}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField label="First Name" variant="outlined" sx={{m:2}} onChange={e => setAddDialogData({...addDialogData, firstname: e.target.value})} />
                    <TextField label="Last Name" variant="outlined" sx={{m:2}} onChange={e => setAddDialogData({...addDialogData, lastname: e.target.value})} />
                    <TextField label="Street Name" variant="outlined" sx={{m:2}} onChange={e => setAddDialogData({...addDialogData, streetaddress: e.target.value})} />
                    <TextField label="Post Code" type="number" variant="outlined" sx={{m:2}} onChange={e => setAddDialogData({...addDialogData, postcode: e.target.value})} />
                    <TextField label="City" variant="outlined" sx={{m:2}} onChange={e => setAddDialogData({...addDialogData, city: e.target.value})} />
                    <TextField label="Email" variant="outlined" sx={{m:2}} onChange={e => setAddDialogData({...addDialogData, email: e.target.value})} />
                    <TextField label="Phone" variant="outlined" sx={{m:2}} onChange={e => setAddDialogData({...addDialogData, phone: e.target.value})} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogState(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setAddDialogState(false);
                        fetch(global.ApiURL + "/api/customers", {
                            method: "post",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(addDialogData)                
                        })
                        .then(() => fetchCustomers())
                        .catch(err => console.log(err));
                    }}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addTrainingDialogState} onClose={() => setAddTrainingDialogState(false)}>
                <DialogTitle>Add New Training For Customer {addTrainingDialogCustomer.firstname} {addTrainingDialogCustomer.lastname}</DialogTitle>
                <DialogContent>
                    <TextField label="Date" type="date" variant="outlined" sx={{m:2}} onChange={e => setAddTrainingDialogData({...addTrainingDialogData, date: new Date(e.target.value).toISOString()})} />
                    <TextField label="Duration (min)" type="number" variant="outlined" sx={{m:2}} onChange={e => setAddTrainingDialogData({...addTrainingDialogData, duration: e.target.value})} />
                    <TextField label="Activity" variant="outlined" sx={{m:2}} onChange={e => setAddTrainingDialogData({...addTrainingDialogData, activity: e.target.value})} />
                    <TextField label="Customer" disabled={true} variant="outlined" sx={{m:2}} value={addTrainingDialogCustomer.firstname + ' ' + addTrainingDialogCustomer.lastname}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddTrainingDialogState(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setAddTrainingDialogState(false);
                        addTrainingDialogData.customer = addTrainingDialogCustomer.links[0].href;
                        fetch(global.ApiURL + "/api/trainings", {
                            method: "post",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(addTrainingDialogData)                
                        })
                        .then(() => fetchCustomers())
                        .catch(err => console.log(err));
                    }}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteDialogState} onClose={() => setDeleteDialogState(false)}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {selectionModel.length} customers.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogState(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setDeleteDialogState(false);
                        var promises = [];
                        selectionModel.forEach((i) => {
                            promises.push(fetch(customers[i].links[0].href, {method: "delete"}));
                        });
                        Promise.all(promises)
                            .then(() => {
                                fetchCustomers();
                            })
                    }} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default Customers;