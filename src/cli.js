export default function parseArgs() {
  const args = process.argv.slice(2);

  let port = 8080;
  let origin = "http://localhost:3000";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--port") {
      port = Number(args[i + 1]);
      i++;
    } else if (args[i] === "--origin") {
      origin = args[i + 1];
      i++;
    }
  }

  return {
    port,
    origin,
  };
}
