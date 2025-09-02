var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.body.test);
  res.send("success");
  res.sendStatus(200);
});

function onTime(){
  const date = new Date();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}
module.exports = router;