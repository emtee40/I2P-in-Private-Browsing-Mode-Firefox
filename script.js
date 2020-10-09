
browser.runtime.onMessage.addListener(request => {
  var response = '';
  if (request.req === 'i2p-location') {
    response = 'no-alt-location';
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
      try {
        tag = metas[i].getAttribute('http-equiv');
        if (tag.toUpperCase() === 'I2P-LOCATION') {
          response = metas[i].getAttribute('content');
        }
        if (tag.toUpperCase() === 'X-I2P-LOCATION') {
          response = metas[i].getAttribute('content');
        }
      }catch{
      };
    }
  }
  if (request.req === 'i2p-torrentlocation') {
    response = 'no-alt-location';
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
      try {
        tag = metas[i].getAttribute('http-equiv');
        if (tag.toUpperCase() === 'I2P-TORRENTLOCATION') {
          response = metas[i].getAttribute('content');
          var imgs = document.getElementsByTagName('img');
          for (let img of imgs) {
            let tmpsrc = new URL(img.src);
            if (tmpsrc.host == location.host) {
              img.src = 'http://127.0.0.1:7657/i2psnark/' + tmpsrc.host + tmpsrc.pathname;
              img.onerror = function() {
                img.src = tmpsrc;
              };
            }
          }
          var videos = document.getElementsByTagName('video');
          for (let video of videos) {
            let tmpsrc = new URL(video.currentSrc);
            if (tmpsrc.host == location.host) {
              innerHTML = video.innerHTML;
              topInnerHTML = video.innerHTML.replace('src=\"', 'src=\"http://127.0.0.1:7657/i2psnark/' + location.host + '/');
              video.innerHTML = topInnerHTML + innerHTML;
            }
          }
          var audios = document.getElementsByTagName('audio');
          for (let audio of audios) {
            let tmpsrc = new URL(audio.currentSrc);
            if (tmpsrc.host == location.host) {
              innerHTML = audio.innerHTML;
              topInnerHTML = audio.innerHTML.replace('src=\"', 'src=\"http://127.0.0.1:7657/i2psnark/' + location.host + '/');
              audio.innerHTML = topInnerHTML + innerHTML;
            }
          }
        }
        if (tag.toUpperCase() === 'X-I2P-TORRENTLOCATION') {
          response = metas[i].getAttribute('content');
          var imgs = document.getElementsByTagName('img');
          for (let img of imgs) {
            if (tmpsrc.host == location.host) {
              img.src = 'http://127.0.0.1:7657/i2psnark/' + tmpsrc.host + tmpsrc.pathname;
              img.onerror = function() {
                img.src = tmpsrc;
              };
            }
          }
          var videos = document.getElementsByTagName('video');
          for (let video of videos) {
            let tmpsrc = new URL(video.currentSrc);
            if (tmpsrc.host == location.host) {
              innerHTML = video.innerHTML;
              topInnerHTML = video.innerHTML.replace('src=\"', 'src=\"http://127.0.0.1:7657/i2psnark/' + location.host + '/');
              video.innerHTML = topInnerHTML + innerHTML;
            }
          }
          var audios = document.getElementsByTagName('audio');
          for (let audio of audios) {
            let tmpsrc = new URL(audio.currentSrc);
            if (tmpsrc.host == location.host) {
              innerHTML = audio.innerHTML;
              topInnerHTML = audio.innerHTML.replace('src=\"', 'src=\"http://127.0.0.1:7657/i2psnark/' + location.host + '/');
              audio.innerHTML = topInnerHTML + innerHTML;
            }
          }
        }
      }catch{
      };
    }
  }
  return Promise.resolve({content: response});
});
