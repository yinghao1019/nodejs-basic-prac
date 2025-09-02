const db = require("./connection_db");

module.exports = function updateMember(id, memberData) {
  return new Promise((resolve, reject) => {
    const result = {};
    const sql = `UPDATE member_info SET name = ?, password = ? WHERE id = ?`;
    db.query(sql, [memberData.name, memberData.password, id], (err, data) => {
      if (err) {
        console.log(err);
        result.status = "會員資料更新失敗。";
        result.err = "伺服器錯誤，請稍後在試！";
        reject(result);
      } else {
        result.status = "會員資料更新成功。";
        result.memberData = memberData;
        resolve(result);
      }
    });
  });
};
