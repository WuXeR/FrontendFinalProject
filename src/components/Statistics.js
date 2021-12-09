import React from 'react';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
    Title,
    Tooltip,
    Legend
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker, Stack } from '@devexpress/dx-react-chart';
const { getGender } = require('gender-detection-from-name');

const Statistics = () => {
    const [chartData, setChartData] = React.useState([]);

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
                        data.content[index].customer = res.firstname;
                    });

                    var activityDurations = [];
                    data.content.forEach(training => {
                        if(!activityDurations[training.activity])
                            activityDurations[training.activity] = {};
                        
                        const gender = getGender(training.customer);
                        if(!activityDurations[training.activity][gender])
                            activityDurations[training.activity][gender] = 0;
                        activityDurations[training.activity][gender] += training.duration;
                    });
                    var finalChartData = [];
                    for(var key in activityDurations) {
                        finalChartData.push({
                            activity: key,
                            female: activityDurations[key]["female"],
                            male: activityDurations[key]["male"]
                        });
                    }
                    setChartData(finalChartData);
                });
        })
        .catch(err => console.log(err));
    }
    React.useEffect(fetchTrainings, []);

    return (
        <Chart data={chartData}>
            <Title text="Training Duration(min) Per Activity"/>
            <ArgumentAxis/>
            <ValueAxis />
            <BarSeries name="(Probably) Male" valueField="male" argumentField="activity"/>
            <BarSeries name="(Probably) Female" valueField="female" argumentField="activity"/>
            <Stack stacks={[{series: ['(Probably) Male', '(Probably) Female']}]}/>
            <Legend />
            <EventTracker />
            <Tooltip />
            <Animation />
        </Chart>
    );

}

export default Statistics;