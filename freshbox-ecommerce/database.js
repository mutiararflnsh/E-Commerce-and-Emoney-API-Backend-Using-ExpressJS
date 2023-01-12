
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,    // the number of connections node.js will hold open to our database
    password: "zwVDW6AzKK",
    user: "OEmnHkDIbK",
    database: "OEmnHkDIbK",
    host: "remotemysql.com",
    port: "3306"
    
});
    
let database = {};
 
// ***Requests to the User table ***
 
database.allUser = () =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM user ', (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users);
        });
    });
};

database.allproduct = () =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM product ', (error, product)=>{
            if(error){
                return reject(error);
            }
            return resolve(product);
        });
    });
};
 
database.getUserByEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM user WHERE email = ?', [email], (error, users)=>{
            if(error){
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};
 
database.insertUser = (userName, email, password, phone, alamat) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO user (user_name, email, password, phone, alamat) VALUES (?,  ?, ?, ?, ?)', [userName, email, password, phone, alamat], (error, result)=>{
            if(error){
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};




 
database.kurang = (nama_produk, stok) =>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE product SET stok = stok - ? WHERE nama_produk = ?', [stok, nama_produk], (error, result)=>{
            if(error){
                return reject(error);
            }
              return resolve();
        });
    });
};
 

database.updateOrder = (status, id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE orderan SET status=? WHERE id = ?', [status, id], (error)=>{
            if(error){
                return reject(error);
            }
             
              return resolve();
        });
    });
};
 
database.tracking = (userId, amount, tujuan, method) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO tracking (user_id, jumlah, tujuan, method) VALUE (?, ?, ?, ?)', [userId, amount, tujuan, method], (error, result)=>{
            if(error){
                return reject(error);
            }
              return resolve();
        });
    });
};
 
database.trackRecord = (userId) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT jumlah, tujuan, method, time FROM tracking WHERE user_id = ?', [userId], (error, track)=>{
            if(error){
                return reject(error);
            }
              return resolve(track);
        });
    });
};

database.searchproduct = (nama_produk) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT nama_produk, harga, stok, nama_seller FROM product WHERE nama_produk = ?', [nama_produk], (error, search)=>{
            if(error){
                return reject(error);
            }
              return resolve(search);
        });
    });
};

database.selectproduct = (produk) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM product WHERE nama_produk = ?', [produk], (error, select)=>{
            if(error){
                return reject(error);
            }
              return resolve(select[0]);
        });
}); 
};

database.insertorder = (nama_pembeli, nama_seller, quantity, total_harga, produk, harga) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO orderan (nama_pembeli, nama_seller, quantity, total_harga, produk, harga) VALUE (?, ?, ?, ?, ?, ?)', [nama_pembeli, nama_seller, quantity, total_harga, produk, harga], (error, result)=>{
            if(error){
                return reject(error);
            }
              return resolve();
        });
    });
};


 
database.deleteUser = (id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM User WHERE id = ?', [id], (error)=>{
            if(error){
                return reject(error);
            }
            return resolve(console.log("User deleted"));
        });
    });
};

database.insertproduk = (nama_produk, stok, harga, nama_seller) =>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO product (nama_produk, stok, harga, nama_seller) VALUES (?,  ?, ?, ?)', [nama_produk, stok, harga, nama_seller], (error, result)=>{
            if(error){
                return reject(error);
            }
             
              return resolve(result.insertId);
        });
    });
};

database.allorder = (nama_pembeli) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM orderan WHERE nama_pembeli = ? ', [nama_pembeli], (error, product)=>{
            if(error){
                return reject(error);
            }
            return resolve(product);
        });
    });
};

database.updateProduct = (nama_produk, stok) =>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE product SET stok = ? WHERE nama_produk = ?', [nama_produk, stok], (error)=>{
            if(error){
                return reject(error);
            }
             
              return resolve();
        });
    });
};

database.paid = (status, order_id) =>{
    return new Promise((resolve, reject)=>{
        pool.query('UPDATE orderan SET status = ? WHERE id = ?', [status, order_id], (error)=>{
            if(error){
                return reject(error);
            }

              return resolve();
        });
    });
};

database.allorder = (nama) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM orderan WHERE nama_pembeli = ? ', [nama], (error, product)=>{
            if(error){
                return reject(error);
            }
            return resolve(product);
        });
    });
};

database.ordermasuk = (nama) =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM orderan WHERE nama_seller = ? ', [nama], (error, product)=>{
            if(error){
                return reject(error);
            }
            return resolve(product);
        });
    });
};


module.exports = database