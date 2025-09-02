const toRegister = require('../models/register_model');
const StringUtils=require('../utils/string_utils');
stringUtils=new StringUtils();

module.exports = class Member {
    postRegister(req, res, next) {
        // 進行加密
        const password = encryption(req.body.password);
        // 獲取client端資料
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        }

        // check email format
        const isEmailValid=string_utils.checkEmail(memberData.email);
        if(isEmailValid===false){
            res.json({
                result: {
                    status: "註冊失敗。",
                    err: "請輸入正確的Eamil格式。(如1234@email.com)"
                }
            })
        }else if(isEmailValid===true){
            // 將資料寫入資料庫
        toRegister(memberData).then(result => {
            // 若寫入成功則回傳
            res.json({
                status: "註冊成功。",
                result: result 
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                result: err
            })
        })
        }
        
    }
}

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