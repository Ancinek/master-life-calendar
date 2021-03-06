/**
 * Created by micha on 18.03.17.
 */
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import formats from "./formats";
import Week from "./calendar-components/Week";
import DayNames from "./calendar-components/DayNames";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayedDate: moment().startOf("month"),
            selectedDates: [],
            dateRange: {}
        };
        this.clearAll = this.clearAll.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.previousMonth = this.previousMonth.bind(this);
        this.toggleSelectedDate = this.toggleSelectedDate.bind(this);
        this.toggleSelectedWeekday = this.toggleSelectedWeekday.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.dateFrom === this.props.dateFrom && nextProps.dateTo === this.props.dateTo) {
            return;
        }
        this.selectDates(nextProps);
    }
    previousMonth() {
        const month = this.state.displayedDate;
        month.subtract(1, "month");
        this.setState({
            displayedDate: month
        });
    }
    nextMonth() {
        const month = this.state.displayedDate;
        month.add(1, "month");
        this.setState({
            displayedDate: month
        });
    }
    componentDidMount() {
        this.selectDates(this.props);
    }
    isDateIncluded(dates, date) {
        const index = dates.findIndex((includedDay) => {
            return includedDay.isSame(date, "day");
        });
        return index !== -1;
    }
    selectFromTo(props) {
        const dateFrom = moment(props.dateFrom, formats.dateFormat);
        const dateTo = moment(props.dateTo, formats.dateFormat);
        if (dateTo.isBefore(dateFrom, "day")) {
            return;
        }
        const selectedDates = this.state.selectedDates;
        const iterDate = dateFrom.clone();
        while (iterDate.isSameOrBefore(dateTo, "day")) {
            if (!this.isDateIncluded(selectedDates, iterDate)) {
                selectedDates.push(iterDate.clone());
            }
            iterDate.add(1, "day");
        }
        this.setState({
            selectedDates: selectedDates
        });
    }
    selectPredefined(props) {
        const predefinedDates = props.selectedDates;
        const selectedDates = this.state.selectedDates;
        for (let i = 0; i < predefinedDates.length; i++) {
            const date = moment(predefinedDates[i], formats.dateFormat);
            if (!this.isDateIncluded(selectedDates, predefinedDates)) {
                selectedDates.push(date);
            }
        }
        this.setState({
            selectedDates: selectedDates
        });
    }
    selectDates(props) {
        this.setState({
            selectedDates: []
        }, () => {
            if (props.dateFrom && props.dateTo) {
                this.selectFromTo(props);
            }
            if (props.selectedDates) {
                this.selectPredefined(props);
            }
        });
    }
    toggleSelectedWeekday(weekday) {
        // No dateFrom and dateTo is supplied in this example
        // Mock dateFrom and dateTo below, to be removed in the final application
        // const { dateFrom, dateTo } = this.props;
        const { selectedDates, dateRange } = this.state;
        const dateFrom = moment().add(-3, "months");
        const dateTo = moment();
        const format = "DD-MM-YYYY";
        let range = {};
        if (Object.keys(dateRange).length == 0) {
            while(dateFrom.add(1, "days").diff(dateTo) < 0) {
                const cloned = dateFrom.clone();
                range[cloned.format(format)] = cloned;
            }
            this.setState({ dateRange: range });
        } else {
            range = dateRange;
        }
        let result = {};
        selectedDates.forEach(date => {
            result[date.format(format)] = date;
        });
        const weekdays = {};
        const commonDates = {}; // Indexes of common dates
        Object.keys(range).forEach(key => {
            const value = range[key];
            const valueFormat = value.format(format);
            if (value.format("dd") === weekday) {
                weekdays[valueFormat] = value;
                if (result[valueFormat]) {
                    commonDates[valueFormat] = value;
                }
            }
        });
        // Select the missing dates if there are several already selected
        const commonDatesKeys = Object.keys(commonDates);
        const weekdaysKeys = Object.keys(weekdays);
        if (weekdaysKeys.length > commonDatesKeys.length) {
            weekdaysKeys.forEach(key => {
                result[key] = weekdays[key];
            });
        } else {
            commonDatesKeys.forEach(key => {
                delete result[key];
            });
        }
        this.setState({
            selectedDates: Object.values(result)
        });

    }
    getSelectedDates() {
        return this.state.selectedDates.slice(0);
    }
    clearAll() {
        this.setState({ selectedDates: [] });
    }
    toggleSelectedDate(date) {
        if (!this.props.allowDateSelect) {
            return;
        }
        const selectedDates = this.state.selectedDates;
        const index = selectedDates.findIndex((day) => {
            return day.isSame(date, "day");
        });
        if (index === -1) {
            selectedDates.push(date);
        } else {
            selectedDates.splice(index, 1);
        }
        this.setState({
            selectedDates: selectedDates
        }, () => {
            if (this.props.onChange) {
                this.props.onChange();
            }
        });

    }
    render() {
        const { children } = this.props;
        const { selectedDates } = this.state;
        return (
            <div className="container valign-wrapper" style={{height: "100vh"}}>
                <div className="row" style={{flex: 1}}>
                    <div className="col s6 offset-s3">
                        <table className="calendar">
                            <thead>
                            <tr className="options">
                                <td className="center-align"><i className="material-icons" onClick={this.previousMonth}>keyboard_arrow_left</i></td>
                                <td className="year-month center-align" colSpan="5">{this.renderMonthLabel()}</td>
                                <td className="center-align"><i className="material-icons" onClick={this.nextMonth}>keyboard_arrow_right</i></td>
                            </tr>
                            <DayNames
                                selectWeekdays={this.toggleSelectedWeekday}
                            />
                            </thead>

                            <tbody>
                            {this.renderWeeks()}
                            </tbody>

                        </table>
                        <button
                            className={`clear-all btn ${selectedDates.length == 0 && "disabled"}`}
                            onClick={this.clearAll}
                        >
                            Clear all
                        </button>
                    </div>
                </div>


                {children && React.cloneElement(children, {selectedDates: this.state.selectedDates})}

            </div>
        );
    }
    renderMonthLabel() {
        return (
            <span>{this.state.displayedDate.format("MMMM YYYY")}</span>
        );
    }
    renderWeeks() {
        const weeks = [];
        const iterWeek = this.state.displayedDate.clone();
        const iterationEndMonth = this.state.displayedDate.clone().add(1, "month").month();
        iterWeek.weekday(0);
        while (iterWeek.month() !== iterationEndMonth) {
            weeks.push(
                <Week key={iterWeek.week()}
                      selectDate={this.toggleSelectedDate}
                      selectedDates={this.state.selectedDates}
                      startOfWeek={iterWeek.clone()}
                      displayedMonth={this.state.displayedDate.month()}
                />
            );
            iterWeek.add(1, "week");
        }
        return weeks;
    }
}

Calendar.propTypes = {
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
    selectedDates: PropTypes.array,
    onChange: PropTypes.func,
    allowDateSelect: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

Calendar.defaultProps = {
    allowDateSelect: true
};


export default Calendar;
