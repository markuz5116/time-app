import React from "react";
import {FormLabel} from "@material-ui/core";
import Select from "react-select";
import {Doughnut} from "react-chartjs-2";
// import { GroupingState, IntegratedGrouping } from '@devexpress/dx-react-grid';

function DonutChart(props) {
    const [sortBy, setSortBy] = React.useState("team");

    const sortMethods = [
        { value: "team", label: "Team" },
        { value: "teamMember", label: "User" },
        { value: "activity", label: "Activity" },
        { value: "tags", label: "Tags" },
    ]
    let data = props.data;

    const changeSortMethod = (event) => {
        setSortBy(event.value);
    }

    let labels = [];
    let chartData = [];
    const getChartData = () => {
        let lookUp = {};

        data.forEach(entry => {
            let label = entry[sortBy];
            let hours = entry["hours"];

            if (!(label in lookUp)) {
                lookUp[label] = hours;
            } else {
                lookUp[label] += hours;
            }
        })

        for (let entry in lookUp) {
            labels.push(entry);
            chartData.push(lookUp[entry]);
        }
    }
    getChartData();

    const state = {
        labels: labels,
        datasets: [
            {
                label: 'Sorted By',
                backgroundColor: [
                    '#B21F00',
                    '#C9DE00',
                    '#2FDE00',
                    '#00A6B4',
                    '#6800B4'
                ],
                hoverBackgroundColor: [
                    '#501800',
                    '#4B5000',
                    '#175000',
                    '#003350',
                    '#35014F'
                ],
                data: chartData
            }
        ]
    }

    return(
        <div>
            <div className="sortingOption">
                <div className="sortForm" style={{width: 220}} >
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                        names="sortBy"
                        options={sortMethods}
                        onChange={changeSortMethod}
                    />
                </div>
            </div>
            <div className="chart">
                <Doughnut
                    height={75}
                    width={150}
                    data={state}
                    options={{
                        title:{
                            display:false,
                            text:'Average Rainfall per month',
                            fontSize:20
                        },
                        legend:{
                            display:false,
                            position:'left'
                        },
                        maintainAspectRatio:false
                    }}
                />
            </div>
        </div>
    );
}

export default DonutChart;