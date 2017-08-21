function showBar() {
  var domain = app.domain + '/api/' + m + '/' + a + '/';
  var url = domain
  var i = 0
  for (var key in arr) {
    if (i == 0) {
      url += '?' + key + '=' + arr[key];
    } else {
      url += '&' + key + '=' + arr[key];
    }
    i++
  }
  return url;
}