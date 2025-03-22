import app from './index.js';

// Parse command line arguments
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const PORT = portIndex !== -1 ? parseInt(args[portIndex + 1]) : 3001;

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
