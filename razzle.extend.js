const analyzerPlugin = {
  name: 'bundle-analyzer',
  options: {
    analyzerHost: '0.0.0.0',
    analyzerMode: 'static',
    generateStatsFile: true,
    statsFilename: 'stats.json',
    reportFilename: 'reports.html',
    openAnalyzer: false,
  },
};

const plugins = (defaultPlugins) => {
  return defaultPlugins.concat([analyzerPlugin]);
};
const modify = (config, { target, dev }, webpack) => {
  const themeConfigPath = `${__dirname}/theme/theme.config`;
  config.resolve.alias['../../theme.config$'] = themeConfigPath;
  config.resolve.alias['../../theme.config'] = themeConfigPath;

  return config;
};

module.exports = {
  plugins,
  modify,
};
