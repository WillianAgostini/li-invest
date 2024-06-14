module.exports = {
  apps: [
    {
      name: 'renda-fixa-api',
      script: './dist/main.js',
      error_file: './logs/errors',
      out_file: './logs/out',
      log_file: './logs/log',
      time: true,
    },
  ],
};
