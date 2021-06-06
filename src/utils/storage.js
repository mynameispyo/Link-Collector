/*
Storage Structure

{
    url
    title
    collection
    update
}
*/

const saveLink = () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        chrome.storage.sync.get(['links'], function(result) {
            if(result.links === undefined){
                chrome.storage.sync.set({'links':{}});
                result.links = {};
            }

            result.links.push(
                {
                    url:tabs[0].url,
                    title: tabs[0].title,
                    collection: '',
                    update: Date.now(),
                }
            )
            chrome.storage.sync.set({'links':result.links});
        });
    });
}

const isInList = (url,links) => {
    for (let i=0; i<links.length;i++){
        
        if (links[i].url === url){
            return true;
        }
    }
    return false;
}

const debuging = () => {
    chrome.storage.sync.get(['dirs'], function(result) {
        console.log(result);
    });
    // reset();
}

const reset = () => {
    chrome.storage.sync.set({'links':[]});
}
export { saveLink, isInList, debuging};
