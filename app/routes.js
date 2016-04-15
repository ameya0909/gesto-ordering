var Order = require('./models/orderModel');
var Menu = require('./models/menuModel');

function getOrder(res) {
    Order.find(function (err, foods) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        //console.log(foods);
        res.json(foods); // return all foods in JSON format
    });
}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all foods from menu for dropdown
    app.get('/api/menu', function (req, res) {
        Menu.find(function (err, foods) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }
            //console.log(foods);
            res.json(foods); // return all foods from menu collection in JSON format
        });
    });


    // get all foods to display on home page
    app.get('/api/food', function (req, res) {
        // use mongoose to get all foods from order collection in the database
        getOrder(res);
    });


    // create order and send back all foods after creation
    app.post('/api/food', function (req, res) {
        //console.log(req.body.name);
        // create a food order, information comes from AJAX request from Angular
        var name = req.body.name;
        // find food from menu collection matching the name selected from dropdown
        var query = Menu.findOne({'name': name});

        // selecting the price field
        query.select('price');

        query.exec(function (err, item) {
            if (err) return handleError(err);
            //console.log(price);

            Order.create({
                name: name,
                price: item.price
            }, function (err, order) {
                if (err)
                    res.send(err);

                // get and return all the foods after you create another
                getOrder(res);
            });
        });
    });


    // delete a food
    app.delete('/api/food/:food_id', function (req, res) {
        Order.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getOrder(res);
        });
    });

    // cacluate total
    app.get('/api/total', function (req, res) {

        Order.find(function (err, foods) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }
            //console.log(foods);
            var subTotal = 0;
            for (var i = 0; i < foods.length; i++) {
                var food = foods[i];
                subTotal += food.price;
            }
            var total = subTotal + (0.075 * subTotal);
            res.json({total: total});
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};