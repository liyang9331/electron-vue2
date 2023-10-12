/**
 * Created by supervisor on 2021/03/15
 */
import db from '@/utils/db'
class DbServer{
  constructor(path) {
    this.dbObj=db;
    this.dbObj.init(path)
    this.dbObj.db = this.dbObj.getDb();
  }
}
export  {DbServer}
