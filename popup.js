changeColor.style.backgroundColor = 'black';

changeColor.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 
            `
                function getRGB(elem, property) {
                    var rgb = window.getComputedStyle(elem, null).getPropertyValue(property);
                    rgb = rgb.substring(4, rgb.length-1).replace(/ /g, '').split(',');
                    return [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])];
                }
                var all = document.getElementsByTagName("*");
                for (var i=0, max=all.length; i < max; i++) {
                    try {
                        style = all[i].currentStyle || window.getComputedStyle(all[i], false),
                        bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
                        if (bi === '') {
                            var bb = getRGB(all[i], 'background-color');
                            if (bb[0] + bb[1] + bb[2] > 450)
                                all[i].style.backgroundColor = "black";
                            all[i].style.setProperty('border', 'inherit', 'important');
                            all[i].style.borderColor = "black";
                            var tRGB = getRGB(all[i], 'color'); 
                            if (tRGB[0] < 110 && tRGB[1] < 110 && tRGB[2] < 110)
                                all[i].style.color = "lightgray";
                            else
                                all[i].style.color = 'rgb(' + (tRGB[0] + (tRGB[0]/20)) + ', ' + (tRGB[1] + (tRGB[1]/20)) + ', ' + (tRGB[2] + (tRGB[2]/20)) + ')';
                        }
                    } catch (err) {}
                }
            `
          });
    });
};