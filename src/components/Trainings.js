import React from 'react';
import { format } from 'date-fns';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector
} from '@mui/x-data-grid';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const Trainings = () => {
    const [trainings, setTrainings] = React.useState([]);
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [deleteDialogState, setDeleteDialogState] = React.useState(false);

    function fetchTrainings() {
        fetch(global.ApiURL + "/api/trainings")
        .then(res => res.json())
        .then(data => {
            var promises = [];
            data.content.forEach((training, index) => {
                training.id = index;
                promises.push(fetch(training.links[2].href).then(res => res.json()));
            });
            Promise.all(promises)
                .then((results) => {
                    results.forEach((res, index) => {
                        data.content[index].customer = `${res.firstname} ${res.lastname}`;
                    });
                    setTrainings(data.content)
                });
        })
        .catch(err => console.log(err));
    }
    React.useEffect(fetchTrainings, []);

    const handleSelection = (newSelection) => {
        setSelectionModel(newSelection);
    }

    const columns = [
        { field: 'date', headerName: 'Date', type: 'date', flex: 1,
            valueFormatter: (params) => {
                return format(new Date(params.value), "dd/MM/yyyy");
            }
        },
        { field: 'duration', headerName: 'Duration (min)', type: 'number', flex: 1 },
        { field: 'activity', headerName: 'Activity', flex: 1 },
        { field: 'customer', headerName: 'Customer', flex: 1 }
    ];

    return (
        <>
            <DataGrid
                rows={trainings}
                columns={columns}
                style={{marginBottom: 55}}
                components={{
                    Toolbar: () => (
                        <GridToolbarContainer>
                            <Button color="error" onClick={() => {
                                if(selectionModel.length > 0)
                                    setDeleteDialogState(true);
                            }}><DeleteOutlineIcon /> Delete</Button>
                            <GridToolbarColumnsButton />
                            <GridToolbarFilterButton />
                            <GridToolbarDensitySelector />
                        </GridToolbarContainer>
                    ),
                }}
                onSelectionModelChange={handleSelection}
                selectionModel={selectionModel}
                checkboxSelection
                disableSelectionOnClick
                autoHeight
            />
            <Dialog open={deleteDialogState} onClose={() => setDeleteDialogState(false)}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {selectionModel.length} trainings.
                    </DialogContentText>
                </DialogContent>
                    <DialogActions>
                    <Button onClick={() => setDeleteDialogState(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setDeleteDialogState(false);
                        var promises = [];
                        selectionModel.forEach((i) => {
                            promises.push(fetch(trainings[i].links[0].href, {method: "delete"}));
                        });
                        Promise.all(promises)
                            .then(() => {
                                fetchTrainings();
                            })
                    }} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default Trainings;