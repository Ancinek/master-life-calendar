import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

class Week extends React.Component {
    constructor(props) {
        super(props);
        this.selectDate = this.selectDate.bind(this);
    }
    selectDate(day) {
        this.props.selectDate(day.date);
    }
    dateIsSelected(date) {
        return this.props.selectedDates.findIndex((selectedDate) => {
            return selectedDate.isSame(date, "day");
        }) !== -1;
    }
    render() {
        const { startOfWeek, displayedMonth } = this.props;
        const days = [];

        let iterDate = startOfWeek.clone();
        for (let i = 0; i < 7; i++) {
            const day = {
                date: iterDate.clone(),
                isSelected: this.dateIsSelected(iterDate),
                isInDisplayedMonth: iterDate.month() === displayedMonth
            };
            days.push(
                <td key={day.date.date()}
                    onClick={this.selectDate.bind(null, day)}
                    className={
                        (day.isSelected ? "active" : "") +
                        (!day.isInDisplayedMonth ? " not-current" : "")
                    }
                >
                    {day.date.date()}
                </td>
            );
            iterDate.add(1, "days");
        }
        return (
            <tr>
                {days}
            </tr>
        );
    }
}

Week.propTypes = {
    startOfWeek: PropTypes.instanceOf(moment).isRequired,
    displayedMonth: PropTypes.number.isRequired,
    selectDate: PropTypes.func.isRequired,
    selectedDates: PropTypes.array.isRequired
};

export default Week;
