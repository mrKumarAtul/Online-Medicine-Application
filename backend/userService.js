const { Client } = require("pg")
const dotenv = require("dotenv")
dotenv.config();

function getAllEmails() {
    const query = `SELECT "email" FROM users;`
    return runOnTable(query);
}
function addUser(userData) {
    const query = ` INSERT INTO users ("email", "name", "password")
    VALUES ('${userData.email}', '${userData.name}', '${userData.password}')`;
    return runOnTable(query);
}
function getOrders(userEmail) {
    const query = `SELECT * from orders where "email" = '${userEmail}' order by id desc`;
    return runOnTable(query);
}
function updatePassword(userData) {
    const query = `UPDATE users SET "password" = '${userData.new}' WHERE "email" = '${userData.email}'`
    return runOnTable(query);
}
function checkIfOldPasswordMatches(userData) {
    const query = `Select "password" from users WHERE "email" = '${userData.email}'`
    return runOnTable(query);
}
function addOrder(orderDetail) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '/' + mm + '/' + yyyy;

    console.log('at addOrder', orderDetail);
    let queryArr = [];
    for (let i = 0; i < orderDetail.products.length; i++) {
        const itemName = orderDetail.products[i]['name'];
        const units = orderDetail.products[i]['quantity'];
        const query = `INSERT INTO orders ("email","productName","orderid","units","orderdate") VALUES 
    ('${orderDetail.email}','${itemName}','${orderDetail.orderID}','${units}','${formattedToday}')  `;
        console.log('q', query);

        queryArr.push(runOnTable(query));
    }

    // const dddd = {


    return Promise.all(queryArr).then((values) => values );

    //     'some ' : orderDetail.products
    // }
    // const query = `INSERT INTO orders ("email","order","orderId","productName","units") VALUES 
    // (${orderDetail.email},'${JSON.stringify(dddd)}') WHERE "email" = '${orderDetail.email}' `;
    // return runOnTable(query);   
}
function viewOrder(userData) {
    console.log('viewOrder order', userData);
    const query = `SELECT "orders" FROM users;`
    return runOnTable(query);
}

function findUser(userData) {
    //SELECT * FROM Customers WHERE CustomerID=1;
    const query = `SELECT * FROM users WHERE "email"='${userData.email}' `;
    console.log('called - findUser');
    return runOnTable(query);

}

function addDataInMedicineTable() {
    const query=`insert into medicine (name,manufacturer,alergy,benifits,instock, PRICE, prescribed)
    VALUES ('mk atenol ${(new Date()).getTime()}','sds','sds','ffgfg','true','100','true')`;
    return runOnTable(query);
}
function getDataInMedicineTable() {
    const query=`select * from  medicine order by id desc`;
    return runOnTable(query);
}
function getAllProductsOfaOrderID(orderID) {
    const query=`select * from  orders WHERE "orderid" ='${orderID}' `;
    return runOnTable(query);
}
function runOnTable(query) {
    console.log('called - runOnTable');
    return new Promise((resolve, reject) => {
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })

        client.connect().then(async () => {
            console.log('query to execute:', query);
            const res = await client.query(query);
            console.log(query);
            //  console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            reject(err);
        }).finally(async () => {
            await client.end();

        })

    });

}


module.exports = {
    getAllEmails: getAllEmails,
    addUser: addUser,
    findUser: findUser,
    viewOrder: viewOrder,
    addOrder: addOrder,
    getOrders:getOrders,
    updatePassword:updatePassword,
    checkIfOldPasswordMatches:checkIfOldPasswordMatches,
    addDataInMedicineTable:addDataInMedicineTable,
    getDataInMedicineTable:getDataInMedicineTable,
    getAllProductsOfaOrderID:getAllProductsOfaOrderID
}
