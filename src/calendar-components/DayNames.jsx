import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

// Setting Polish locale in momentJS
moment.locale("pl");
const weekdays = moment.weekdaysMin(true);

class DayNames extends Component {
    constructor(props) {
        super(props);
        this.selectWeekdays = this.selectWeekdays.bind(this);
    }
    selectWeekdays(e) {
        this.props.selectWeekdays($(e.target).text());
    }
    render() {
        return (
            <tr className="week-days">
                {weekdays.map(weekday => {
                    return (
                        <td
                            key={weekday}
                            onClick={this.selectWeekdays}
                        >{weekday}</td>
                    );
                })}
            </tr>
        );
    }
}

DayNames.propTypes = {
    selectWeekdays: PropTypes.func.isRequired
};

export default DayNames;
