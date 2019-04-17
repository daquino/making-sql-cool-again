'use strict'
const { Client } = require('pg')
const categories = [
    {
        "name": "AUTOMOTIVE",
        "pricing": [
            3.00,
            10.00,
            25.00
        ],
        "modifierMin": 3,
        "modifierMax": 5
    },
    {
        "name": "BOOKS",
        "pricing": [
            5.00,
            8.00,
            12.00
        ],
        "modifierMin": 3,
        "modifierMax": 5
    },
    {
        "name": "BEAUTY/HEALTH",
        "pricing": [
            5.00,
            15.00,
            25.00
        ],
        "modifierMin": 3,
        "modifierMax": 5
    },
    {
        "name": "CLOTHING",
        "pricing": [
            10.00,
            25.00,
            45.00
        ],
        "modifierMin": 10,
        "modifierMax": 25
    },
    {
        "name": "ELECTRONICS",
        "pricing": [
            50.00,
            500.00,
            1500.00
        ],
        "modifierMin": 200,
        "modifierMax": 400
    },
    {
        "name": "MOVIES",
        "pricing": [
            5.00,
            7.00,
            10.00
        ],
        "modifierMin": 3,
        "modifierMax": 5
    },
    {
        "name": "SPORTS",
        "pricing": [
            10.00,
            20.00,
            30.00
        ],
        "modifierMin": 10,
        "modifierMax": 20
    },
    {
        "name": "TOYS/GAMES",
        "pricing": [
            1.00,
            10.00,
            20.00
        ],
        "modifierMin": 5,
        "modifierMax": 10
    }
]

const reviewDescriptions = [
    "Terrible.  Avoid at all costs.",
    "Not quite what was hoped for",
    "Does the job ok.",
    "Almost perfect!",
    "Amazing!"
]

function randomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPriceModifier(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }

function generateRandomProduct(i) {
    var randomCategoryIndex = randomInteger(0, categories.length-1)
    var category = categories[randomCategoryIndex];
    var randomPricingIndex = randomInteger(0, category.pricing.length-1)
    var pricing = category.pricing[randomPricingIndex];
    var price = pricing + randomPriceModifier(category.modifierMin, category.modifierMax)
    return {
        'category': category.name,
        'name': `${category.name} ${i}`,
        'price': price
    }
}

async function insertProducts(client, products) {
    var environment = process.argv[3]
    var query = `insert into ${environment !== undefined ? environment+'.' : ''}product (category,name,price) VALUES `
    for(var i = 0; i < products.length; i++) {
        var product = products[i]
        if(i > 0) {
            query += ', '
        }
        query += `('${product.category}','${product.name}',${product.price})`
    }
    await client.query(query)
}

async function loadProducts(client,productCount) {
    console.log('Loading products....')
    var products = []
    var total = 0
    try {
        for(var i =0; i<productCount;i++) {
            products.push(generateRandomProduct(i))
            if(products.length % 100000 == 0) {
                await insertProducts(client, products)
                total += products.length
                console.log(`Loaded ${total} products so far...`)
                products = []

            }
        }
        if(products.length > 0) {
            await insertProducts(client, products)
        }
    } catch(err) {
        console.log(err);
    }
}

function generateRandomReview(productId) {
    var randomUserId = Math.floor(Math.random() * 10000) + 1
    var randomRating = Math.floor(Math.random() * 5) + 1
    var description = reviewDescriptions[randomRating-1];
    return {
        'productId': productId,
        'username': `user_${randomUserId}`,
        'rating': randomRating,
        'description': description
    }
}

async function insertReviews(client, reviews) {
    var environment = process.argv[3]
    var query = `insert into ${environment !== undefined ? environment+'.' : ''}product_review (product_id,username,rating,description) VALUES `
    for(var i = 0; i < reviews.length; i++) {
        var review = reviews[i]
        if(i > 0) {
            query += ', '
        }
        query += `('${review.productId}','${review.username}',${review.rating},'${review.description}')`
    }
    await client.query(query)
}


async function loadReviews(client, productCount) {
    console.log('Loading reviews....')
    var reviews = []
    var total = 0;
    try {
        for(var i=0; i < productCount; i++) {
            const randomReviewCount = randomInteger(150,175)
            for(var j=0; j < randomReviewCount; j++) {
                reviews.push(generateRandomReview(i+1))
            }
            if(reviews.length >= 100000) {
                await insertReviews(client, reviews)
                total += reviews.length
                console.log(`Loaded ${total} reviews so far...`)
                reviews = []
            }
        }
        if(reviews.length > 0) {
            await insertReviews(client, reviews)        
        }
    } catch(err) {
        console.log(err)
    }
}

async function main() {
    const client = new Client({
        'host': 'localhost',
        'user': 'postgres',
        'database': 'postgres'
    })

    var productCount = parseInt(process.argv[2])
    try {
        await client.connect()
        await loadProducts(client, productCount)
        await loadReviews(client, productCount)
        await client.end()
    } catch(err) {
        console.log(err)
    }
}

main()
  .then(console.log)
  .catch(console.error)