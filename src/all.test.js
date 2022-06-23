const https = require('https');

const e = () => {
  let result;
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/users',
    method: 'GET',
  };
  
  const req = https.request(options, res => {
    res.on('data', d => {
      console.log(d)
      result = d;
    });
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.end();
  return result;
}
test('Check array length', () => {
  expect(e().length).toBe(0);
});
