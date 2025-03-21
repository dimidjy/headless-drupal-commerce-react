document.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('a.ief-button-dropdown');
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var button_type = link.getAttribute('data-type');
      if (button_type === 'duplicate') {
        let pid = link.getAttribute('data-pid');
        navigator.clipboard.writeText(pid);
      }
      else {
        var buttonId = link.getAttribute('data-button-id');
        var button = document.getElementById(buttonId);

        if (button) {
            var event = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            button.dispatchEvent(event);
        }
      }
      
    });
  });
});

(function (Drupal, once) {
  Drupal.behaviors.paragraphTable = {
    attach: function (context, settings) {
      // Use the 'once' function to ensure the behavior is only attached once per element
      once('paragraphTable', 'a.ief-button-dropdown', context).forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var button_type = link.getAttribute('data-type');
          if (button_type === 'duplicate') {
            let pid = link.getAttribute('data-pid');
            navigator.clipboard.writeText(pid);
          } else {
            var buttonId = link.getAttribute('data-button-id');
            var button = document.getElementById(buttonId);
            if (button) {
              var event = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true
              });
              button.dispatchEvent(event);
            }
          }
        });
      });
    }
  };
})(Drupal, once);