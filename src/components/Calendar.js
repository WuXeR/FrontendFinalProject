import React from 'react';
import { format } from 'date-fns';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  WeekView,
  DayView,
  Appointments,
  TodayButton,
  Toolbar,
  DateNavigator,
  ViewSwitcher
} from '@devexpress/dx-react-scheduler-material-ui';

const Calendar = () => {
    const [currentDate, setCurrentDate] = React.useState(format(new Date(), "yyyy-MM-dd"));
    const [schedulerData, setSchedulerData] = React.useState([]);

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

                    var scheduleData = [];
                    data.content.forEach(training => {
                        scheduleData.push({
                            startDate: training.date,
                            endDate: new Date(new Date(training.date).getTime() + training.duration * 60000),
                            title: training.activity + ' ' + training.duration + 'min / ' + training.customer
                        });
                    });
                    setSchedulerData(scheduleData);
                });
        })
        .catch(err => console.log(err));
    }
    React.useEffect(fetchTrainings, []);

    return (
        <>
            <Scheduler data={schedulerData}>
                <ViewState defaultCurrentDate={currentDate} />
                <MonthView />
                <WeekView />
                <DayView />
                <Appointments />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
            </Scheduler>
        </>
    );

}

export default Calendar;