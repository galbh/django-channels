import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Divider, ExpansionPanelDetails, ExpansionPanelSummary, ExpansionPanel } from '@material-ui/core';
import styles from './expansion-panel.component.scss';

const ExpansionPanelComponent = ({
  title, content, className, defaultExpanded
}) => (
  <ExpansionPanel defaultExpanded={defaultExpanded} className={styles.container}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={styles.title}>
      {title}
    </ExpansionPanelSummary>

    <Divider />

    <ExpansionPanelDetails className={styles.content}>
      {content}
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

ExpansionPanelComponent.propTypes = {
  title: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired,
  defaultExpanded: PropTypes.bool,
  className: PropTypes.string
};

ExpansionPanelComponent.defaultProps = { className: '', defaultExpanded: true };

export default ExpansionPanelComponent;
