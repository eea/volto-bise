const plugins = (defaultPlugins) => {
  return defaultPlugins; // .concat(['scss']);
};
const modify = (config, { target, dev }, webpack) => {
  config.resolve.alias[
    '../../theme.config$'
  ] = `${__dirname}/theme/theme.config`;

  console.log('config', config.resolve.alias);
  return config;
};

module.exports = {
  plugins,
  modify,
};
