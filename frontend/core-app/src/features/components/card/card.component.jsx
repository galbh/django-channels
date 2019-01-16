import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardActions, Divider } from '@material-ui/core';
import styles from './card.component.scss';

const CardComponent = ({
  components, className, titleBorder, contentClassName
}) => {
  const baseClass = styles.card;
  const customClassName = className ? `${baseClass} ${className}` : baseClass;
  const componentsCount = components && components.length;

  return (
    <Card className={customClassName}>
      {
        components && components.map((component, i) => {
          const { title, element, titleComponent } = component;

          return (
            <div key={title}>

              <div className={styles.title}>

                <CardHeader className={styles.titleHeader} title={title} />

                {
                  titleComponent && (
                    <CardActions>{titleComponent}</CardActions>
                  )
                }
              </div>

              {titleBorder && <Divider className={styles.divider} />}

              <CardContent className={contentClassName}>{element}</CardContent>

              {titleBorder && i < componentsCount - 1 && <Divider className={styles.divider} />}
            </div>
          );
        })
      }
    </Card>

  );
};

CardComponent.propTypes = {
  components: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    element: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    titleComponent: PropTypes.element
  })),
  className: PropTypes.string,
  titleBorder: PropTypes.bool,
  contentClassName: PropTypes.string
};

CardComponent.defaultProps = {
  className: '', components: null, titleBorder: false, contentClassName: ''
};

export default CardComponent;
