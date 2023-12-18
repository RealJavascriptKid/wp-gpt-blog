// From https://javascript.plainenglish.io/wordpress-rest-api-in-javascript-1e90d747e09d#c868
const express = require('express');
const GPT = require('./GPT');
      require('dotenv').config(),
      WordPress = require('./WordPress');

async function run() {


    const wp = new WordPress({
        username:process.env.WP_USER,
        password:process.env.WP_KEY,
        url:process.env.WP_SITE
    })

    const gpt = new GPT({
        apiKey:process.env.OPENAI_API_KEY,
        model:process.env.OPENAI_MODEL,
    })
   

    let title = 'The Rise of AI Assistants: Your Ultimate Guide to Productivity and Convenience'

    let content = await gpt.getArticle({title})

     await wp.createPost({
        title,
        content,
        status:'draft'
    })
}

run()
.then(result => {
    console.log("Done:",result)
}).catch(ex => {
    console.error("Error:",ex)
})

