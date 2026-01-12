import React, { useEffect, useState } from 'react';
import {makeStyles} from '@mui/styles';
import {DataGrid} from '@mui/x-data-grid';
import {Box} from "@mui/material";
import {fetchCommandEventData} from "../services/api.js";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        textDecorationStyle: "solid",
        backgroundColor: 'rgb(255,255,255)',
    },
}));

export default function CommandsDataChart() {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'username',
            headerName: 'Username',
            width: 210,
            editable: false,
        },
        {
            field: 'commandName',
            headerName: 'Command',
            width: 150,
            editable: false,
        },
        {
            field: 'args',
            headerName: 'Arguments',
            width: 420,
            editable: false,
        },
    ];

    useEffect(() => {
        fetchCommandEventData()
            .then(data => {
                setLoading(false);

                let info = [];

                for (let i = 0; i < data.length; i++) {
                    let item =  {id: i, username: data[i].sender, commandName: data[i].commandName, args: data[i].commandArguments}
                    info.push(item);
                }

                setData(info);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data!</p>;

    return <div className={classes.root}>
        <Box sx={{height: 400, width: '100%'}}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            />
        </Box>
    </div>
}