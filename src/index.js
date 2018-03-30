import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import Layout from './layout/Layout';
require("../node_modules/font-awesome/css/font-awesome.css");


render((
    <Router>
        <Route path="/" component={Layout} />
    </Router>
), document.getElementById("root"));