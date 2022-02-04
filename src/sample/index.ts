import express from 'express';

const router = express.Router();

router.use(function timeLog(request, response, next) {
  console.log('Time:', Date.now());
  next();
});
// define the home page route
router.get('/', function (request, response) {
  response.send('Changed stuff home page');
});
// define the about route
router.get('/about', function (request, response) {
  response.send('About birds');
});

export default router;