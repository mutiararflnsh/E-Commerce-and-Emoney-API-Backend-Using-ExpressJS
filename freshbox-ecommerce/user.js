const express = require('express');
const database = require('./database');
const formdata = require('form-data');
const userRouter = express.Router();

const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { Result } = require('express-validator');
const axios = require('axios');




userRouter.put('/updateStatus', async (req, res, next) => {
    try {
        const status = req.body.status;
        const userId = req.body.id;


        if (!status) {
            return res.sendStatus(400);
        }

        const user = await database.updateOrder(status, userId);
        res.json({ message: "Status berhasil di update" });


    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

userRouter.put('/updateProduct', async (req, res, next) => {
    try {
        const stok = req.body.stok;
        const nama_produk = req.body.nama_produk;


        if (!stok || !nama_produk) {
            return res.sendStatus(400);
        }

        const user = await database.updateProduct(stok, nama_produk);
        res.json({ message: "Product berhasil di update" });


    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});





userRouter.post('/addproduct', async (req, res, next) => {
    try {

        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        const tokenDecodablePart = token.split(".")[1];
        const decoded = Buffer.from(tokenDecodablePart, "base64").toString();
        var tokendata = JSON.parse(decoded);

        const nama_produk = req.body.nama_produk;
        const stok = req.body.stok;
        const harga = req.body.harga;
        const nama_seller = tokendata.user.user_name;


        await database.insertproduk(nama_produk, stok, harga, nama_seller);

        return res.json({ message: "Product posted" });

    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

userRouter.post('/order', async (req, res, next) => {
    try {

        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        const tokenDecodablePart = token.split(".")[1];
        const decoded = Buffer.from(tokenDecodablePart, "base64").toString();
        var tokendata = JSON.parse(decoded);

        const produk = req.body.produk;
        const nama_pembeli = tokendata.user.user_name;
        const quantity = req.body.quantity;

        const total_harga = req.body.total_harga;
        const selected = await database.selectproduct(produk);

        const nama_seller = selected.nama_seller;
        const harga = selected.harga;
        await database.insertorder(nama_pembeli, nama_seller, quantity, total_harga, produk,  harga);
        await database.kurang(produk, quantity);

        return res.json({ message: "Order berhasil dilakukan" });

    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

userRouter.post('/payment', async (req, res, next) => {
    const amount = req.body.amount;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const order_id = req.body.order_id;

    var token;
    await axios.post('https://payfresh.herokuapp.com/api/login', {
        email: email,
        password: password
    }).then(function (response) {
        token = (response.data.token);
        console.log(token);
    })
        .catch(function (error) {
            console.log(error);
        })

    await axios.post('https://payfresh.herokuapp.com/api/user/transfer', {
        phone: phone,
        amount: amount
    },
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            return res.send(response.data);
        }).catch(function (error) {
            return res.send(error);
        })
        await database.paid("sudah terbayar",order_id);

});


userRouter.post('/paymentKecana', async (req, res, next) => {
    const nominaltransfer = req.body.nominaltransfer;
    const email = req.body.email;
    const password = req.body.password;
    const nohp = req.body.nohp;
    const id = req.body.id;
    const emoneytujuan = req.body.emoneytujuan;
    const order_id = req.body.order_id;

    var token;
    await axios.post('https://kecana.herokuapp.com/login', {
        email: email,
        password: password
    }).then(function (response) {
        token = (response.data);
        console.log(token);
    })
        .catch(function (error) {
            console.log(error);
        })

    await axios.post('https://kecana.herokuapp.com/transferemoneylain', {
        nohp: nohp,
        nominaltransfer: nominaltransfer,
        id: id,
        emoneytujuan: emoneytujuan
    },
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            return res.send(response.data);
        }).catch(function (error) {
            return res.send(error);
        })
        await database.paid("sudah terbayar",order_id);
});

userRouter.post('/paymentBuskidi', async (req, res, next) => {
    const nomortujuan = req.body.nomortujuan;
    const nominal = req.body.nominal;
    const description = req.body.description;
    const username = req.body.username;
    const password = req.body.password;
    const nomer_hp = req.body.nomer_hp;
    const order_id = req.body.order_id;
    const e_money_tujuan = req.body.e_money_tujuan;
    if (!description || !username || !nomortujuan || !nominal || !password || !nomer_hp || !e_money_tujuan)
    return res.status(400).send('bad request')
    var token;
    var bodyFormData = new formdata();
    bodyFormData.append('username', username);
    bodyFormData.append('password', password);
    
    await axios.post('https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/publics/login', bodyFormData)
        .then(function (response) {
            token = (response.data.message.token);
            console.log(token);
        })
        .catch(function (error) {
            console.log(error);
        })

    var bodyFormData2 = new formdata()
    bodyFormData2.append('nomer_hp', nomer_hp);
    bodyFormData2.append('nomer_hp_tujuan', nomortujuan);
    bodyFormData2.append('e_money_tujuan', e_money_tujuan);
    bodyFormData2.append('amount', nominal);
    bodyFormData2.append('description', description);

    axios.post('https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/admin/transfer', bodyFormData2,
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            return res.send(response.data);
        }).catch(function (error) {
            return res.send(error.response.data);
        })
        await database.paid("sudah terbayar",order_id);
    });

    userRouter.post('/paymentPeacepay', async (req, res, next) => {
        const tujuan = req.body.tujuan;
        const amount = req.body.amount;
        const number = req.body.number;
        const password = req.body.password;
        const order_id = req.body.order_id;
        var token;
        await axios.post('https://e-money-kelompok-12.herokuapp.com/api/login', {
            number: number,
            password: password
        }).then(function (response) {
            token = (response.data.token);
            console.log(token);
        })
            .catch(function (error) {
                console.log(error);
            })
    
       await axios.post('https://e-money-kelompok-12.herokuapp.com/api/payfresh', {
            tujuan: tujuan,
            amount: amount
        },
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(function (response) {
                return res.send(response.data);
            }).catch(function (error) {
                return res.send(error.response.data);
            })
            await database.paid("sudah terbayar",order_id);
        });

        userRouter.post('/paymentMoneyz', async (req, res, next) => {
            const tujuan = req.body.tujuan;
            const amount = req.body.amount;
            const phone = req.body.phone;
            const password = req.body.password;
            const emoney = req.body.emoney;
            const order_id = req.body.order_id;
            var token;
            await axios.post('https://moneyz-kelompok6.herokuapp.com/api/login', {
                phone: phone,
                password: password
            }).then(function (response) {
                token = (response.data.token);
                console.log(token);
            })
                .catch(function (error) {
                    console.log(error);
                })
        
           await axios.post('https://moneyz-kelompok6.herokuapp.com/api/user/transferTo', {
                tujuan: tujuan,
                amount: amount,
                emoney: emoney
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }).then(function (response) {
                    return res.send(response.data);
                }).catch(function (error) {
                    return res.send(error.response.data);
                })
                await database.paid("sudah terbayar",order_id);
        });

        userRouter.post('/paymentGallecoins', async (req, res, next) => {
            const phone_target = req.body.phone_target;
            const amount = req.body.amount;
            const username = req.body.username;
            const password = req.body.password;
            const description = req.body.description;
            const order_id = req.body.order_id;
            var token;
            await axios.post('https://gallecoins.herokuapp.com/api/users', {
                username: username,
                password: password
            }).then(function (response) {
                token = (response.data.token);
            })
                .catch(function (error) {
                    console.log(error);
                })
        
           await axios.post('https://gallecoins.herokuapp.com/api/transfer/payfresh', {
                phone_target: phone_target,
                amount: amount,
                description: description
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }).then(function (response) {
                    return res.send(response.data);
                }).catch(function (error) {
                    return res.send(error.response.data);
                })
                await database.paid("sudah terbayar",order_id);
            });


            userRouter.post('/paymentEcoin', async (req, res, next) => {
                const phone2 = req.body.phone2;
                const phone = req.body.phone;
                const password = req.body.password;
                const amount = req.body.amount;
                const description = req.body.description;
                const dest_emoney = req.body.dest_emoney;
                const order_id = req.body.order_id;
                var token;
                await axios.post('http://ecoin10.my.id/api/masuk', {
                    phone: phone,
                    password: password
                }).then(function (response) {
                    token = (response.data.accessToken);
                    console.log(token);
                })
                    .catch(function (error) {
                        console.log(error);
                    })
            
               await axios.post('http://ecoin10.my.id/api/transfer', {
                    phone2: phone2,
                    amount: amount,
                    description: description,
                    dest_emoney: dest_emoney
                },
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }).then(function (response) {
                        return res.send(response.data);
                    }).catch(function (error) {
                        return res.send(error.response.data);
                    })
                    await database.paid("sudah terbayar",order_id);
        });            

        userRouter.post('/paymentCuanind', async (req, res, next) => {
            const target = req.body.target;
            const amount = req.body.amount;
            const notelp = req.body.notelp;
            const password = req.body.password;
            const order_id = req.body.order_id;
    
            var token;
            await axios.post('https://e-money-kelompok5.herokuapp.com/cuanind/user/login', {
                notelp: notelp,
                password: password
            }).then(function (response) {
                token = (response.data);
                console.log(token);
            })
                .catch(function (error) {
                    console.log(error);
                })
        
           await axios.post('https://e-money-kelompok5.herokuapp.com/cuanind/transfer/payfresh', {
                target: target,
                amount: amount
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }).then(function (response) {
                    return res.send(response.data);
                }).catch(function (error) {
                    return res.send(error.response.data);
                })
                await database.paid("sudah terbayar",order_id);
            });   

    userRouter.get('/myorder', async (req, res, next)=>{
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];

            const tokenDecodablePart = token.split(".")[1];
            const decoded = Buffer.from(tokenDecodablePart, "base64").toString();
            var tokendata = JSON.parse(decoded);
            const nama = tokendata.user.user_name;
            const order = await database.allorder(nama);
            res.json({order: order});
        } catch(e) {
            console.log(e);
        }
     });

     userRouter.get('/pesananmasuk', async (req, res, next)=>{
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];

            const tokenDecodablePart = token.split(".")[1];
            const decoded = Buffer.from(tokenDecodablePart, "base64").toString();
            var tokendata = JSON.parse(decoded);
            const nama = tokendata.user.user_name;
            const order = await database.ordermasuk(nama);
            res.json({order: order});
        } catch(e) {
            console.log(e);
        }
    });

userRouter.post('/paymentPayphone', async (req, res, next) => {
    const telepon = req.body.telepon;
    const jumlah = req.body.jumlah;
    const password = req.body.password;
    const telepon_tujuan = req.body.telepon_tujuan;
    const emoney = req.body.emoney;
    const order_id = req.body.order_id;
    var token;
    var bodyFormData = new formdata();
    bodyFormData.append('telepon', telepon);
    bodyFormData.append('password', password);
    await axios.post('http://fp-payphone.herokuapp.com/public/api/login', bodyFormData)
        .then(function (response) {
            token = (response.data.token);
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })

    var bodyFormData = new formdata()
    bodyFormData.append('telepon', telepon_tujuan);
    bodyFormData.append('emoney', emoney);
    bodyFormData.append('jumlah', jumlah);

    await axios.post('http://fp-payphone.herokuapp.com/public/api/transfer', bodyFormData,
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(function (response) {
            return res.send(response.data);
        }).catch(function (error) {
            return res.send(error.response.data);
        })
        await database.paid("sudah terbayar",order_id);
    });

    userRouter.post('/paymentPadpay', async (req, res, next) => {
        const jumlah = req.body.jumlah;
        const email = req.body.email;
        const password = req.body.password;
        const tujuan = req.body.tujuan;
        const order_id = req.body.order_id;
    
        var token;
        await axios.post('https://mypadpay.xyz/padpay/api/login.php', {
            email: email,
            password: password
        }).then(function (response) {
            token = (response.data.Data.jwt);
            console.log(token);
        })
            .catch(function (error) {
                console.log(error);
            })
    
       await axios.post('https://mypadpay.xyz/padpay/api/coin/payfresh.php', {
            email: email,
            password: password,
            jwt: token,
            tujuan: tujuan,
            jumlah: jumlah
    
            //jwt: (token)
        },
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(function (response) {
                return res.send(response.data);
            }).catch(function (error) {
                return res.send(error.response.data);
            })
            await database.paid("sudah terbayar",order_id);
        });

        userRouter.post('/paymentTalangin', async (req, res, next) => {
            const penerima = req.body.penerima;
            const jumlah = req.body.jumlah;
            const pengirim = req.body.pengirim;
            const email = req.body.email;
            const password = req.body.password;
            const emoney = req.body.emoney;
            const order_id = req.body.order_id;
            const authHeader = req.headers["authorization"];
            const tokenku = authHeader && authHeader.split(" ")[1];
        
            const tokenDecodablePart = tokenku.split(".")[1];
            const decoded = Buffer.from(tokenDecodablePart, "base64").toString();

            
        
            var token;
            await axios.post('https://e-money-kelomok-11.000webhostapp.com/api/login.php', {
                email: email,
                password: password
            }).then(function (response) {
                token = (response.data.jwt);
                console.log(token);
            })
                .catch(function (error) {
                    console.log(error);
                })
        
           await axios.post('https://e-money-kelomok-11.000webhostapp.com/api/transferin.php', {
                penerima: penerima,
                jumlah: jumlah,
                pengirim: pengirim,
                emoney: emoney,
                jwt: token
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }).then(function (response) {
                    return res.send(response.data);
                }).catch(function (error) {
                    return res.send(error.response.data);
                })
                await database.paid("sudah terbayar",order_id);
            });
            
module.exports = userRouter;    