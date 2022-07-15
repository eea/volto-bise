import React from 'react';
import { Container, Accordion } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';

const FactsheetsListingView = (props) => {
  const { data, properties, id } = props;
  const sections = [
    {
      '@id': id,
      id,
      title: data.block_title,
      items: properties?.items || [],
      factsheet_group_title: data.block_title,
    },
  ];
  const [activeIndex, setActiveIndex] = React.useState(0);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  }

  return (
    <div className="factsheet-view">
      <Container>
        <Accordion fluid styled exclusive={false}>
          {sections.map((section, index) => {
            return (
              <React.Fragment key={section['@id']}>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={handleClick}
                >
                  <span className="section-title">{section.title}</span>
                  <div className="accordion-tools">
                    {activeIndex === index ? (
                      <Icon name={upSVG} size="40px" color="#f3c715" />
                    ) : (
                      <Icon name={downSVG} size="40px" color="#f3c715" />
                    )}
                  </div>
                </Accordion.Title>
                <Accordion.Content
                  className={section.id}
                  active={activeIndex === index}
                >
                  <div
                    className="fdl-listing-section"
                    key={section['@id']}
                    style={{ columns: data.cols || 3 }}
                  >
                    {section.items?.map((item) => (
                      <div key={item['@id']}>
                        <Link to={flattenToAppURL(item['@id'])}>
                          {item.title}
                        </Link>
                        {section.factsheet_group_title && (
                          <div>{item.factsheet_group}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </Accordion.Content>
              </React.Fragment>
            );
          })}
        </Accordion>
      </Container>
    </div>
  );
};

export default FactsheetsListingView;
