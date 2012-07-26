module.exports = {
  search: function() {
    return {
      'data': 'in search'
    };
  },
  
  info: function() {
    return {
      'name': 'google',
      'info': 'How to use the google search function',
      'functions': ["search"]
    };
  }
}
