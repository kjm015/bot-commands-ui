import React, {useEffect, useState} from 'react';
import {makeStyles} from '@mui/styles';
import {DataGrid} from '@mui/x-data-grid';
import {Box} from "@mui/material";
import {fetchCommandEventData} from "../services/api.ts";
import {PieChart} from '@mui/x-charts/PieChart';
import {pieArcLabelClasses} from "@mui/x-charts";

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
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTimer, setRefreshTimer] = useState(0);

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

        // Refresh every 15 seconds
        setInterval(() => {
            setRefreshTimer(refreshTimer + 1);
        }, 15000);

        fetchCommandEventData()
            .then(data => {
                setLoading(false);

                let info = [];
                let chartInfo = [];

                const chartMap = new Map();

                for (let i = 0; i < data.length; i++) {
                    let item = {
                        id: i,
                        username: data[i].sender,
                        commandName: data[i].commandName,
                        args: data[i].commandArguments
                    }
                    info.push(item);

                    if (chartMap.has(data[i].commandName)) {
                        chartMap.set(data[i].commandName, chartMap.get(data[i].commandName) + 1);
                    } else {
                        chartMap.set(data[i].commandName, 1);
                    }
                }

                let id = 0;

                chartMap.forEach((value, key) => {
                    let chartItem = {id: id, value: value, label: `/${key}`}
                    chartInfo.push(chartItem);
                    id++;
                })

                setData(info);
                setChartData(chartInfo);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [refreshTimer]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data!</p>;

    return <div className={classes.root}>
        <PieChart
            series={[
                {
                    arcLabel: (item) => `${item.value}`,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: '60%',
                    data: chartData,
                    highlightScope: {fade: 'global', highlight: 'item'},
                    faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                },
            ]}
            sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: 'bold',
                },
            }}
            width={400}
            height={400}
        />
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