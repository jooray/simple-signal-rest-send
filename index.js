var port=6775;
var bind_uri='/wheretobind1337/signal_send';
var username='+123458718123';
var default_recipient='+123989817292';
var signal_cli_path='/usr/local/bin/signal-cli';


const { spawnSync } = require('child_process');
var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
 console.log("Server running on port "+port);
 app.post(bind_uri, (req, res) => {
  var recipient=default_recipient;
  if (req.body.recipient) recipient=req.body.recipient;
  console.log('Sending ' + req.body.message + ' to ', recipient);
  const signal_cli = spawnSync(signal_cli_path, ['-u', username, 'send', recipient],
      {
        input: req.body.message,
        timeout: 15000,
        killSignal: "SIGKILL",
        cwd: process.cwd(),
        env: process.env,
      });

  return res.send({
    error: signal_cli.error,
    stdout: signal_cli.stdout.toString('utf8'),
    stderr: signal_cli.stderr.toString('utf8')
  });
 });

 app.get(bind_uri, (req, res) => {
    return res.send("Hello signal"); // enables lame monitoring of running service
 });
});
