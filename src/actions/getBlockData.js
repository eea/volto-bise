import { GET_BLOCKDATA } from 'volto-bise/constants';

export function getBlockData(path, blockid) {
  path = `${path}/@blocks/${blockid}`;
  console.log('getBlock', path);
  return {
    type: GET_BLOCKDATA,
    path,
    blockid,
    request: {
      op: 'get',
      path,
    },
  };
}
