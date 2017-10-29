import { Component } from 'react'
import ReactGA from 'react-ga'


export default class Analytics extends Component {
  constructor(props) {
    super(props);

    ReactGA.initialize('UA-108227328-1');

    // Initial page load - only fired once
    this.sendPageChange(props.location.pathname, props.location.search)
  }

  componentWillReceiveProps(nextProps) {
    // When props change, check if the URL has changed or not
    if (this.props.location.pathname !== nextProps.location.pathname
      || this.props.location.search !== nextProps.location.search) {
      this.sendPageChange(nextProps.location.pathname, nextProps.location.search)
    }
  }

  sendPageChange(pathname, search='') {
    const page = pathname + search;

    ReactGA.set({page});
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}