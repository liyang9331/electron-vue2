/**
 * Created by supervisor on 2021/03/15
 */


class TableServer{
  constructor() {
    this.db=null
    this.tableName="";
  }
  init(db,tableName){
    this.db=db
    this.tableName=tableName
  }
  //删除数据
  deleteById(id,succ,fail){
    this.db.run(`DELETE FROM '${this.tableName}' WHERE id='${id}' `, (err) => {
      if (err) {
       if(fail){
         fail(err)
       }
      } else {
         if(succ){
          succ(err)
        }
      }
    })

  }
  //查询数据






}
export {TableServer}
