import React from 'react';
import extend from 'lodash/extend';
import { Table } from 'semantic-ui-react';

import { SpeciesGridItem, SpeciesListItem } from './Species';
import { ArticleListItem } from './Article';
import { DocumentListItem } from './Document';
import { HabitatListItem } from './Habitat';
import { LinkListItem } from './Link';
import { SiteListItem } from './Site';
import { ProtectedAreaListItem } from './ProtectedArea';

const gridItemTypes = {
  species: SpeciesGridItem,
};

const listItemTypes = {
  species: SpeciesListItem,
  article: ArticleListItem,
  document: DocumentListItem,
  habitat: HabitatListItem,
  link: LinkListItem,
  site: SiteListItem,
  protected_area: ProtectedAreaListItem,
};

export const GridItem = (props) => {
  const { bemBlocks, result } = props;
  const source = extend({}, result._source, result.highlight);
  const fieldTitle = props.data?.tile_title || 'title';
  // const fieldDescription = props.data?.tile_description || 'description';
  // const fieldImage = props.data?.tile_image || 'depiction';
  const fieldUrl = props.data?.tile_url || 'about';
  // const title = source[titleField];
  //
  const Item = gridItemTypes[result._type];
  // console.log('griditem props', Item, source);
  // console.log('griditem res', result);
  return (
    <div
      className={bemBlocks.item().mix(bemBlocks.container('item'))}
      data-qa="hit"
    >
      {Item ? (
        <Item source={source} />
      ) : (
        <a href={source[fieldUrl]} target="_blank" rel="noreferrer">
          <div
            data-qa="title"
            className={bemBlocks.item('title')}
            dangerouslySetInnerHTML={{ __html: source[fieldTitle] }}
          ></div>
        </a>
      )}
    </div>
  );
};

export const ListItem = (props) => {
  const { bemBlocks, result } = props;
  // let url = 'http://www.imdb.com/title/' + result._source.imdbId;
  const source = extend({}, result._source, result.highlight);
  const Item = listItemTypes[result._type];

  // <div className={bemBlocks.item('poster')}>
  //   {result._type}
  //   {/* <img alt="presentation" data-qa="poster" src={result._source.poster} /> */}
  // </div>
  //{/* <h3 className={bemBlocks.item('subtitle')}> */}
  //{/*   Released in {source.year}, rated {source.imdbRating}/10 */}
  //{/* </h3> */}
  //{/* <div */}
  //{/*   className={bemBlocks.item('text')} */}
  //{/*   dangerouslySetInnerHTML={{ __html: source.plot }} */}
  //{/* ></div> */}

  return (
    <div
      className={bemBlocks.item().mix(bemBlocks.container('item'))}
      data-qa="hit"
    >
      {Item ? (
        <Item {...props} source={source} />
      ) : (
        <>
          <div className={bemBlocks.item('details')}>
            {/* <a href={url} target="_blank" rel="noreferrer"> */}
            <h4>Search for: {source.query}</h4>
            <small>
              on {source.queried_at} in {source.categories.join(', ')}
            </small>
            <small>
              in page {source.page} / {source.per}
            </small>
            {/* </a> */}
          </div>
        </>
      )}
    </div>
  );
};

export const TableView = (props) => {
  const fieldTitle = props.data?.tile_title || 'title';
  const fieldUrl = props.data?.tile_url || 'about';
  return (
    <Table celled striped>
      {(props.hits || []).map((item) => {
        const source = extend({}, item._source, item.highlight);
        // console.log('item', item);
        return (
          <tr>
            <td>
              <a href={source[fieldUrl]}>
                <span
                  data-qa="title"
                  dangerouslySetInnerHTML={{ __html: source[fieldTitle] }}
                ></span>
              </a>
            </td>
          </tr>
        );
      })}
    </Table>
  );
};
