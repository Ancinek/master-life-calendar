/**
 * Created by micha on 18.03.17.
 */
import React from "react";
import { render } from "react-dom";
import Calendar from "./src/Calendar";

require("./_sources/sass/styles.scss");
require("materialize-loader");

render(<Calendar/>, document.getElementById("app"));
