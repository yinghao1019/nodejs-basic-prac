const toRegister = require("../models/register_model");
const findMember = require("../models/login_model");
const encryption = require("../services/encryption");
const jwt = require("jsonwebtoken");
const config = require("../configs/development_config");
const verifyToken = require("../utils/verify_token_utils");
const updateMember = require("../models/update_member_model");

const StringUtils = require("../utils/string_utils");
stringUtils = new StringUtils();

module.exports = class Member {
  postRegister(req, res, next) {
    // 進行加密
    const password = encryption(req.body.password);
    // 獲取client端資料
    const memberData = {
      name: req.body.name,
      email: req.body.email,
      password: password,
      create_date: onTime(),
    };

    // check email format
    const isEmailValid = stringUtils.checkEmail(memberData.email);
    if (isEmailValid === false) {
      res.json({
        result: {
          status: "註冊失敗。",
          err: "請輸入正確的Eamil格式。(如1234@email.com)",
        },
      });
    } else if (isEmailValid === true) {
      // 將資料寫入資料庫
      toRegister(memberData).then(
        (result) => {
          // 若寫入成功則回傳
          res.json({
            status: "註冊成功。",
            result: result,
          });
        },
        (err) => {
          // 若寫入失敗則回傳
          res.json({
            result: err,
          });
        }
      );
    }
  }

  postLogin(req, res, next) {
    const memberData = {
      email: req.body.email,
      password: encryption(req.body.password),
    };

    findMember(memberData).then(
      (rows) => {
        if (checkNull(rows) === true) {
          res.json({
            result: {
              status: "登入失敗。",
              err: "請輸入正確的帳號或密碼。",
            },
          });
        } else if (checkNull(rows) === false) {
          // 產生token
          const token = jwt.sign(
            {
              algorithm: "HS256",
              exp: Math.floor(Date.now() / 1000) + 60 * 60, // token一個小時後過期。
              data: rows[0].id,
            },
            config.secret
          );

          res.json({
            result: {
              status: "登入成功。",
              loginMember: "歡迎 " + rows[0].name + " 的登入！",
              token: token,
            },
          });
        }
      },
      (err) => {
        // 登入失敗
        res.json({
          result: err,
        });
      }
    );
  }

  postUpdate(req, res, next) {
    const token = req.headers["authorization"];
    if (checkNull(token) === true) {
      res.json({ err: "please login" });
      res.status(401).end();
    } else if (checkNull(token) === false) {
      verifyToken(token).then((result) => {
        if (result === false) {
          res.json({ err: "token invalid", msg: "token expired or invalid" });
          res.status(401).end();
        } else {
          const userId = result;
          const memberData = {
            name: req.body.name,
            password: encryption(req.body.password),
          };

          updateMember(userId, memberData).then(
            (result) => {
              res.json({
                result: result,
              });
            },
            (err) => {
              res.json({
                result: err,
              });
            }
          );
        }
      });
    }
  }
};

function checkNull(data) {
  for (var key in data) {
    // 不為空
    return false;
  }
  // 為空值
  return true;
}

function onTime() {
  const date = new Date();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const mi = date.getMinutes();
  const ss = date.getSeconds();

  return [
    date.getFullYear(),
    "-" + (mm > 9 ? "" : "0") + mm,
    "-" + (dd > 9 ? "" : "0") + dd,
    " " + (hh > 9 ? "" : "0") + hh,
    ":" + (mi > 9 ? "" : "0") + mi,
    ":" + (ss > 9 ? "" : "0") + ss,
  ].join("");
}
