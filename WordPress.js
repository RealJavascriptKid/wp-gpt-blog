// Most commonly used WordPress REST API endpoints.
// Each endpoint provides access to all the fields within a record.

// .../wp/v2/posts
// .../wp/v2/categories
// .../wp/v2/tags
// .../wp/v2/pages
// .../wp/v2/media
// .../wp/v2/comments

const axios = require("axios"),
      fs = require('fs');

module.exports = class WordPress {
  /**
   * @typedef {object} WPConfig
   * @prop {string} username WP Username
   * @prop {string} password WP Application Password
   * @prop {string} url The main URL of site
   *
   * @param {WPConfig} wpConfig
   */
  constructor(wpConfig) {
    // Store the URL from the wpConfig object
    this.url = wpConfig.url;

    // Create the headers object with the authorization and content-type headers
    this.headers = {
      Authorization:
        "Basic " +
        Buffer.from(`${wpConfig.username}:${wpConfig.password}`).toString(
          "base64"
        ),
      "Content-Type": "application/json",
    };
  }

  /**
   * @typedef {object} Post PostObject for creating a new post
   * @prop {string} title
   * @prop {string} content
   * @prop {"published","draft"} status  status of post
   *
   * @param {Post} post
   * @returns {Promise<any>}
   */
  async createPost(post) {
    try {
      const response = await axios.post(
        `${this.url}/wp-json/wp/v2/posts`,
        post,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error while creating post: ${error}`);
    }
  }

  // uploadMedia method for uploading an image
  async uploadMedia(path, attributes) {
    // create a new FormData object
    const form = new FormData();

    // append the image file
    form.append("file", fs.createReadStream(path));

    // append the title, caption, and alt text attributes
    form.append("title", attributes.title);
    // form.append("caption", attributes.caption);
    // form.append("alt_text", attributes.alt_text);

    try {
      // make a POST request to the media endpoint
      const response = await axios.post(
        `${this.url}/wp-json/wp/v2/media`,
        form,
        {
          headers: {
            ...this.headers,
            "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error while uploading image: ${error}`);
    }
  }

  async createPostWithFeaturedImage() {
    // path to the image we want to set as the featured image
    const path = "/your-image-path/image.jpg";
    // upload the image to the WordPress API and get the response
    const mediaResponse = await this.uploadMedia(path, {
        title: "sunrise meditation"
    });

    // read the content of the post from a .txt file
    const postContent = fs.readFileSync('/your-post-path/post.txt', 'utf8');

    // create an object to represent the post, including the featured_media field
    const post = {
        title: "Your Post Title",
        content: postContent,
        status: "draft", 
        // set the featured_media field to the image's ID that we got from the mediaResponse
        featured_media: mediaResponse.id
      };
    
    // create the post using the WordPress API
    const postResponse = await this.createPost(post);
    // log a message to the console indicating that the post was created successfully
    console.log(`Post created! link: ${postResponse.link}`);
}
};
