import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  
  // filteredimage Endpoint
  app.get( "/filteredimage/", async ( req, res ) => {
    // Validate image_url query
    let { image_url } = req.query;
    if ( !image_url ) {
      return res.status(400)
                .send(`Image URL is required.`);
    }
    try {
      // Call filterImageFromURL to filter the image
      let filtered_image = await filterImageFromURL(image_url);

      // Send the resulting file in the response
      res.status(200).sendFile(filtered_image);

      // Delete any files in the tmp folder
      await delay(2000);
      await deleteLocalFiles([filtered_image]);
    } catch(err) {
      // Send response that provided URL was not good
      return res.status(400).send(`This is not a valid URL.`);
    }
  } );

  // Root
  app.get("/", async(req, res) => {
    return res.send("root")
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();