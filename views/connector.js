window.TrelloPowerUp.initialize({
  'card-buttons': function(t) {
    return t.getRestApi()
    .isAuthorized()
    .then(function(authorized) {
      if (authorized) {
        // return signed-in button
      } else {
        // return signed-out button
      }
    });
  }
});