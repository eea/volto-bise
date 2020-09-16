import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';

/**
 * Get some content or data from an external source
 *
 * @function getExternalContent
 * @param {string} url Content url
 * @param {string} subrequest Key of the subrequest. Defaults to value of url
 * @param {Object} request Additional parameters for the request
 * @returns {Object} Get external content action
 */
export function getExternalContent(url, request = {}, subrequest = null) {
  return {
    type: GET_CONTENT,
    subrequest: subrequest || url,
    request: {
      op: 'get',
      path: url,
      ...request,
    },
  };
}
// ## volto-corsproxy
//
