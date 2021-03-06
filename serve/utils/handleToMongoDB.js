/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2018-09-07 19:17:57
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-06-27 11:30:55
 */

const connect = require('./db.js');

const handleToMongoDB = {
  insert: (collectionName, data) => connect((err, db, client) => {
  		//连接到表
      const collection = db.collection(collectionName);
  		//插入数据库
      collection.insertOne(data, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        client.close();
      });
    }),
  update: (collectionName, query, data) => connect((err, db, client) => {
    //连接到表
    const collection = db.collection(collectionName);
    //插入数据库
    collection.updateOne(query, {
        $set: data,
        $currentDate: { lastModified: true }
      }, function(err, result) {
      if(err)
      {
          console.log('Error:'+ err);
          return;
      }
      client.close();
    });
  }),
  findOne: (collectionName, query) => new Promise((resolve, reject) => {
    connect((err, db, client) => {
      const collection = db.collection(collectionName);
      return collection.findOne(query,  {fields: {_id: 0, url: 0, lastModified: 0}}, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            reject(err);
        }
        resolve(result);
        client.close();
      });
    })
  }),
  find: (collectionName, query, fields) => new Promise((resolve, reject) => {
    connect((err, db, client) => {
      const collection = db.collection(collectionName);
      return collection.find(query,  {fields: fields}).toArray(function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            reject(err);
        }
        resolve(result.map(item => {item.id = item._id;delete item._id; return item}));
        client.close();
      });
    })
  }),
  findOneNode: (collectionName, query) => new Promise((resolve, reject) => {
    connect((err, db, client) => {
      const collection = db.collection(collectionName);
      return collection.findOne(query, {fields: {lastModified: 0}}, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            reject(err);
        }
        resolve(result);
        client.close();
      });
    })
  }),
}

module.exports = handleToMongoDB;
