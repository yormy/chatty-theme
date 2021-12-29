// Code to handle install prompt on desktop
let deferredPrompt;

function clickedAway() {
  setCookie('prevent-install');
}

function canInstall() {
  return "nothing" !== getCookie('prevent-install');
}

function setCookie(name) {
  const value ='nothing';
  const expiresInDays = 5;
  var expires = "";
  if (expiresInDays) {
    var date = new Date();
    date.setTime(date.getTime() + (expiresInDays*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

const installbar = document.querySelector('.notifiy-bar-install');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();

  if (!canInstall()) {
    return;
  }

  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  installbar.classList.remove('close');

  installbar.addEventListener('click', () => {
    // hide our user interface that shows our A2HS button
    installbar.classList.add('close');
    clickedAway(); // prevent showing too often

    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        // console.log('User accepted the A2HS prompt');
      } else {
        // console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});


