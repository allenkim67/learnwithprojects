import 'react-tabs/style/react-tabs.css'

import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import urljoin from 'url-join'
import sharedStyles from '../../shared.css'
import styles from './sidebar2.css'
import TeachingNotes from './teaching-notes/teaching-notes'
import ReactDisqusComments from 'react-disqus-comments'

export default class Sidebar extends React.Component {
  render() {
    const url = this.props.location.params.commit ?
      urljoin(location.origin, this.props.location.url) :
      urljoin(location.origin, this.props.location.url, this.props.commit);

    return (
      <div>
        <Tabs>
          <TabList className={"react-tabs__tab-list " + sharedStyles.tabList}>
            <Tab>Notes</Tab>
            <Tab>Comments</Tab>
          </TabList>

          <TabPanel>
            <TeachingNotes teachingNotes={this.props.teachingNotes}/>
          </TabPanel>

          <TabPanel>
            <div className={styles.comments}>
              {this.props.commit === '' ? null :
                <ReactDisqusComments shortname="codefirsttutorials"
                                     url={url}
                                     identifier={this.props.commit}/>}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}