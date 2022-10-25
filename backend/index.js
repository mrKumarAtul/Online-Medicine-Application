const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8000 || process.env.PORT;
const pg = require('pg');
const pool = new pg.Pool();
const createTable = require('./createTable');
const userService = require('./userService');

const client = new pg.Client('postgres://baesfcrc:EvRa-Gs2F29oUsjLPQDLmnDQHNyRiHDN@lucky.db.elephantsql.com/baesfcrc');

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log('createTable', createTable);

createTable.createTableinDB().then((res) => {
    console.log('Table creation success');
}).catch((err) => {
    console.log('Error while creating table');
});

createTable.createOrderTableinDB().then((res) => {
    console.log('Table creation success');
}).catch((err) => {
    console.log('Error while creating table');
});

createTable.createMedicineTableinDB().then((res) => {
    console.log('Table creation -createMedicineTableinDB success');
    // userService.addDataInMedicineTable().then((res) => {
    //     console.log('Table creation -addDataInMedicineTable success');
    // }).catch((err) => {
    //     console.log('Error while creating table');
    // });
}).catch((err) => {
    console.log('Error while creating table');
});



//
app.get('/book', (req, res) => {
    // We will be coding here
    res.send('ac')

});
app.post('/createUser', (req, res) => {
    // We will be coding here
    console.log('POST - createUser API called')
    addUser(req.body).then((data) => {
        console.log('return data to api');
        res.send(data);
    });
});
app.post('/login', (req, res) => {
    // We will be coding here
    console.log('POST - login API called', req.body)
    findUser(req.body).then((data) => {
        console.log('return data to api');
        res.send(data);
    });
});

app.post('/checkout', (req, res) => {
    // We will be coding here
    console.log('POST - checkout API called', req.body)
    addOrder(req.body).then((data) => {
        console.log('return data to api');
        res.send(data);
    });
});

app.post('/orders', (req, res) => {
    // We will be coding here
    console.log('POST - checkout API called', req.body)
    getOrders(req.body.email).then((data) => {
        console.log('return data to api');
        res.send(data);
    });
});
app.post('/changePassword', (req, res) => {
    // We will be coding here
    console.log('POST - changePassword API called', req.body)
    updatePassword(req.body).then((data) => {
        console.log('return data to api');
        res.send(data);
    });
});

app.post('/medicines', (req, res) => {
    // We will be coding here
    console.log('POST - medicines API called')
    userService.getDataInMedicineTable().then((data) => {
        console.log('return data to api');
        res.send(data.rows);
    });
});

app.post('/refill', (req, res) => {
    // We will be coding here
    console.log('POST - refill API called', req.body)
    userService.getAllProductsOfaOrderID(req.body.orderid).then((data) => {
        console.log('result count of getAllProductsOfaOrderID', data.rowCount)
        const userData = {
            "email": req.body.email,
            products: [],
            'orderID': (new Date()).getTime()
        }
        data.rows.forEach((medi) => {
            userData.products.push({
                'quantity': medi.units,
                'name': medi.productName
            });
        });
        userService.addOrder(userData).then((data) => {
            console.log('Refill resp  success',);
            res.send({
                operation : 'success'
            })
        }).catch((err) => {
            console.log('Error', err);
            res.send({
                operation : 'fail',
                reason: err
            })
        })
    });
});

function updatePassword(userData) {
    return new Promise((resolve, rej) => {

        userService.checkIfOldPasswordMatches(userData).then((data) => {
            if (data.rows[0].password === userData.old) {
                userService.updatePassword(userData).then((data) => {
                    console.log('updatePassword - data', data);
                    if (data.rowCount > 0) {
                        console.log('Length of rows', data.rowCount);
                    }
                    resolve({
                        operation: 'success',
                        orders: data.rows
                    });
                })
            } else {
                resolve({
                    operation: 'password mismatch'
                });
            }
        })

    })
}

function getOrders(userEmail) {
    return new Promise((resolve, rej) => {
        userService.getOrders(userEmail).then((data) => {
            console.log('getOrder - rowCount', data);
            if (data.rowCount > 0) {
                console.log('Length of rows', data.rowCount);
            }
            resolve({
                operation: 'success',
                orders: data.rows
            });
        })
    })
}
function addOrder(userData) {
    return new Promise((resolve, rej) => {
        userService.viewOrder(userData).then((data) => {
            console.log('addOrder - rowCount', data.rowCount);

            if (data.rows[0].orders !== null) {
                const existingOrder = data.rows;
                console.log('existingOrder :', existingOrder);
            } else {
                const orderDetail = {
                    email: userData.user,
                    orderID: (new Date()).getTime(),
                    products: userData.orders
                }
                userService.addOrder(orderDetail)
                    .then((data) => {
                        console.log('Data: addOrder - ', data);
                        return resolve({
                            operation: 'success'
                        });
                    });
            }
        })
    })
}

function findUser(userData) {
    return new Promise((resolve, rej) => {
        userService.findUser(userData).then((data) => {
            console.log('findUser - rowCount', data.rowCount);
            if (data.rowCount > 0) {
                for (let i = 0; i < data.rowCount; i++) {
                    if (data.rows[i].password === userData.password) {
                        resolve({
                            operation: 'success',
                            username: data.rows[i].name,
                            email: data.rows[i].email
                        });
                    } else {
                        resolve({
                            operation: 'Wrong password'
                        });
                    }
                }
            } else {
                resolve({
                    operation: 'No match found'
                });
            }
            // if (data.rowCount > 0) {
            //     const values = Object.values(data.rows);
            //     console.log('values:', values);
            //     for (let i = 0; i < data.rows.length; i++) {
            //         console.log('Inside add user..', userData);
            //         console.log(data.rows[i].email)
            //         if (data.rows[i].email === userData.email) {
            //             resolve({
            //                 operation: 'duplicate email'
            //             });
            //         }
            //     }

            // }
            // if (true) {
            //     // no rows in table yet so add user
            //     userService.addUser(userData).then((res) => {
            //         console.log('User add res', res);
            //         resolve({
            //             operation: 'success'
            //         });
            //     })
            // }
        })
    })
}

function addUser(userData) {
    return new Promise((resolve, rej) => {
        console.log('Inside add user..', userData);
        userService.getAllEmails().then((data) => {
            // console.log('Fetch all emails', data);
            if (data.rowCount > 0) {
                const values = Object.values(data.rows);
                console.log('values:', values);
                for (let i = 0; i < data.rows.length; i++) {
                    console.log('Inside add user..', userData);
                    console.log(data.rows[i].email)
                    if (data.rows[i].email === userData.email) {
                        resolve({
                            operation: 'duplicate email'
                        });
                    }
                }

            }
            if (true) {
                // no rows in table yet so add user
                userService.addUser(userData).then((res) => {
                    console.log('User add res', res);
                    resolve({
                        operation: 'success'
                    });
                })
            }
        })
    })

}


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));