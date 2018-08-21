import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Autor from './Autor';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

ReactDOM.render(
    (<Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/autor" component={Autor} />
            <Route path="/livro" />
        </Route>
    </Router>), 
    document.getElementById('root')
);

registerServiceWorker();
