import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Layout from './layout/Layout';
require("../node_modules/font-awesome/css/font-awesome.css");


render((
    <Router>
        <Route path="/" component={Layout}>
        </Route>
    </Router>
), document.getElementById("root"));