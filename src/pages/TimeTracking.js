import React from "react";
import { DataGrid } from '@material-ui/data-grid';
import DatePicker from 'react-datepicker';
import {FormLabel, Grid} from "@material-ui/core";
import Select from "react-select";
import {subDays} from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

import db from '../data.json';
import DonutChart from "./DonutChart";

function TimeTracking() {
    const [startDate, setStartDate] = React.useState(subDays(new Date(), 6));
    const [endDate, setEndDate] = React.useState(new Date());
    const [team, setTeam] = React.useState([]);
    const [teamMember, setTeamMember] = React.useState([]);
    const [activity, setActivity] = React.useState([]);
    const [tags, setTags] = React.useState([]);

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 78
        },
        {
            field: "date",
            headerName: "Date",
            type: "date",
            flex: 1
        },
        {
            field: "team",
            headerName: "Team",
            flex: 1
        },
        {
            field: "teamMember",
            headerName: "Team Member",
            flex: 1
        },
        {
            field: "activity",
            headerName: "Activity",
            flex: 1
        },
        {
            field: "hours",
            headerName: "Duration",
            flex: 1
        },
        {
            field: "tags",
            headerName: "Tags",
            flex: 1
        }
    ]

    const isFilterFulfilled = entry => {
        const date = new Date(entry["Date"]);
        const entryTeam = entry["Team"];
        const user = entry["Team Member"];
        const entryActivity = entry["Activity"];
        const entryTags = entry["Tags"].split(",");

        let dateFilter = date <= endDate && date >= startDate;
        let teamFilter = team.length === 0 || team.includes(entryTeam);
        let userFilter = teamMember.length === 0 || teamMember.includes(user);
        let activityFilter = activity.length === 0 || activity.includes(entryActivity);
        let tagsFilter = tags.length === 0;

        for (let t of entryTags) {
            if (tags.includes(t)) {
                tagsFilter = true;
                break;
            }
        }

        return dateFilter && activityFilter && tagsFilter && userFilter && teamFilter;
    }

    let rows = [];
    let i = 0;
    db.forEach(entry => {
        if (isFilterFulfilled(entry)) {
            rows.push({
                id: i++,
                date: new Date(entry["Date"]),
                team: entry["Team"],
                teamMember: entry["Team Member"],
                activity: entry["Activity"],
                hours: entry["Hours"],
                tags: entry["Tags"]
            });
        }
    })

    const data = {
        columns: columns,
        rows: rows
    }

    const changeStartDate = date => {
        setStartDate(date);
    }

    const changeEndDate = date => {
        setEndDate(date);
    }

    const changeTeam = entries => {
        let teams = entries.map(entry => entry.value);
        setTeam(teams);
    }

    const changeTeamMembers = entries => {
        let users = entries.map(entry => entry.value);
        setTeamMember(users);
    }

    const changeActivities = entries => {
        let activities = entries.map(entry => entry.value);
        setActivity(activities);
    }

    const changeTags = entries => {
        let tags = entries.map(entry => entry.value);
        setTags(tags);
    }

    const getAllFromDb = (toGet) => {
        const lookUp = {};
        const toGets = [];

        db.forEach(entry => {
            const entryElement = entry[toGet];

            if (!(entryElement in lookUp)) {
                toGets.push({
                    value: entryElement,
                    label: entryElement
                });
                lookUp[entryElement] = 1;
            }
        })

        return toGets;
    }

    const getAllTags = () => {
        const lookUp = {};
        const tags = [];

        db.forEach(entry => {
            const tagsFromEntry = entry["Tags"];
            tagsFromEntry.split(",").map(tag => {
                if (!(tag in lookUp)) {
                    tags.push({
                        value: tag,
                        label: tag
                    });
                    lookUp[tag] = 1;
                }
            })
        })

        return tags;
    }
    const allTeams = getAllFromDb("Team")
    const allTeamMembers = getAllFromDb("Team Member");
    const allActivities = getAllFromDb("Activity");
    const allTags = getAllTags();

    return (
        <div>
            <div className="filterOptions">
                <Grid container justify={"space-evenly"} style={{width: "50%"}}>
                    <div className="startDateForm">
                        <FormLabel>Start Date: </FormLabel>
                        <DatePicker
                            selected={startDate}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            onChange={date => changeStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="endDateForm">
                        <FormLabel>End Date: </FormLabel>
                        <DatePicker
                            selected={endDate}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            onChange={date => changeEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </Grid>
                <Grid container justify={"space-evenly"} style={{width: "50%"}}>
                    <div className="teamForm" style={{width: 220}} >
                        <FormLabel>Team:</FormLabel>
                        <Select
                            isMulti
                            names="teams"
                            options={allTeams}
                            onChange={changeTeam}
                        />
                    </div>
                    <div className="userForm" style={{width: 220}} >
                        <FormLabel>User:</FormLabel>
                        <Select
                            isMulti
                            names="users"
                            options={allTeamMembers}
                            onChange={changeTeamMembers}
                        />
                    </div>
                    <div className="activityForm" style={{width: 220}} >
                        <FormLabel>Activity:</FormLabel>
                        <Select
                            isMulti
                            names="activities"
                            options={allActivities}
                            onChange={changeActivities}
                        />
                    </div>
                    <div className="tagForm" style={{width: 220}} >
                        <FormLabel>Tags:</FormLabel>
                        <Select
                            isMulti
                            names="tags"
                            options={allTags}
                            onChange={changeTags}
                        />
                    </div>
                </Grid>
            </div>
            <div style={{ height: 520, width:'50%' }}>
                <DataGrid
                    autoPageSize={true}
                    {...data}
                    loading={data.rows.length === 0}
                    rowHeight={40}
                    checkboxSelection
                    sortingOrder={['asc', 'desc']}
                />
            </div>
            <div className="donutChart">
                <DonutChart data={rows}/>
            </div>
        </div>
    );
};

export default TimeTracking;